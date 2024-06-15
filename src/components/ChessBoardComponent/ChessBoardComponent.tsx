import classNames from 'classnames'
import { FC, useState } from 'react'
import chessBoard from 'src/chess-logic/chessBoard.ts'
import {
  CheckState,
  Color,
  Coords,
  FENChar,
  LastMove,
  pieceImagePaths
} from 'src/chess-logic/models.ts'
import s from 'src/components/ChessBoardComponent/ChessBoardComponent.module.scss'
import { SelectedSquare } from 'src/components/ChessBoardComponent/types.ts'

interface ChessBoardComponentProps {}

const ChessBoardComponent: FC<ChessBoardComponentProps> = ({}) => {
  const [chessBoardView, setChessBoardView] = useState<(FENChar | null)[][]>(
    chessBoard.chessBoardView
  )
  const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>({ piece: null })
  const [pieceSafeSquares, setPieceSafeSquares] = useState<Coords[]>([])
  const [lastMove, setLastMove] = useState<LastMove | undefined>(chessBoard.lastMove)
  const [checkState, setCheckState] = useState<CheckState | undefined>(chessBoard.checkState)
  const [isPromotionActive, setIsPromotionActive] = useState<boolean>(false)
  const [promotionCoords, setPromotionCoords] = useState<Coords | null>(null)

  function isSquarePromotionSquare(x: number, y: number): boolean {
    if (!promotionCoords) return false

    return promotionCoords.x === x && promotionCoords.y === y
  }

  function unMarkingPreviouslySelectedAndSafeSquares(): void {
    setSelectedSquare({ piece: null })
    setPieceSafeSquares([])

    if (isPromotionActive) {
      setIsPromotionActive(false)
      setPromotionCoords(null)
    }
  }

  function updateBoard(
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    promotedPiece: FENChar | null
  ): void {
    chessBoard.move(prevX, prevY, newX, newY, promotedPiece)
    setChessBoardView(chessBoard.chessBoardView)
    setCheckState(chessBoard.checkState)
    setLastMove(chessBoard.lastMove)
    unMarkingPreviouslySelectedAndSafeSquares()
  }

  function selectingPiece(x: number, y: number): void {
    if (chessBoard.gameOverMessage !== undefined) return
    const piece: FENChar | null = chessBoardView[x][y]
    if (!piece) return
    if (isWrongPieceSelected(piece)) return

    const isSameSquareClicked: boolean = !!(
      selectedSquare &&
      selectedSquare.piece &&
      selectedSquare.x === x &&
      selectedSquare.y === y
    )
    unMarkingPreviouslySelectedAndSafeSquares()
    if (isSameSquareClicked) return
    setSelectedSquare({ piece, x, y })
    setPieceSafeSquares(chessBoard.safeSquares.get(x + ',' + y) || [])
  }

  function promotionPieces(): FENChar[] {
    return chessBoard.playerColor === Color.White
      ? [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen]
      : [FENChar.BlackKnight, FENChar.BlackBishop, FENChar.BlackRook, FENChar.BlackQueen]
  }

  function promotePiece(piece: FENChar): void {
    if (!promotionCoords || !selectedSquare.piece) return
    const { x: newX, y: newY } = promotionCoords
    const { x: prevX, y: prevY } = selectedSquare
    updateBoard(prevX, prevY, newX, newY, piece)
  }

  function isSquareSelected(x: number, y: number): boolean {
    if (!selectedSquare.piece) return false
    return selectedSquare.x === x && selectedSquare.y === y
  }

  function isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return pieceSafeSquares.some(coords => coords.x === x && coords.y === y)
  }

  function isSquareLastMove(x: number, y: number): boolean {
    if (!lastMove) return false
    const { prevX, prevY, currX, currY } = lastMove
    return (x === prevX && y === prevY) || (x === currX && y === currY)
  }

  function isSquareChecked(x: number, y: number): boolean {
    return !!(checkState?.isInCheck && checkState.x === x && checkState.y === y)
  }

  function placingPiece(newX: number, newY: number): void {
    if (!selectedSquare.piece) return
    if (!isSquareSafeForSelectedPiece(newX, newY)) return

    const isPawnSelected: boolean =
      selectedSquare.piece === FENChar.WhitePawn || selectedSquare.piece === FENChar.BlackPawn

    const isPawnOnLastRank: boolean = isPawnSelected && (newX === 7 || newX === 0)

    const shouldOpenPromotionDialog: boolean = !isPromotionActive && isPawnOnLastRank

    if (shouldOpenPromotionDialog) {
      setPieceSafeSquares([])
      setIsPromotionActive(true)
      setPromotionCoords({ x: newX, y: newY })
      return
    }

    const { x: prevX, y: prevY } = selectedSquare

    updateBoard(prevX, prevY, newX, newY, null)
  }

  function closePawnPromotionDialog(): void {
    unMarkingPreviouslySelectedAndSafeSquares()
  }

  function move(x: number, y: number): void {
    selectingPiece(x, y)
    placingPiece(x, y)
  }

  function isWrongPieceSelected(piece: FENChar): boolean {
    const isWrongPieceSelected: boolean = piece === piece.toUpperCase()
    return (
      (isWrongPieceSelected && chessBoard.playerColor === Color.Black) ||
      (!isWrongPieceSelected && chessBoard.playerColor === Color.White)
    )
  }

  return (
    <div className={s.ChessBoard}>
      {chessBoardView.map((row, rowIndex) => (
        <div className={s.Row} key={rowIndex}>
          {row.map((piece, pieceIndex) => (
            <div
              className={classNames(s.Square, s[chessBoard.isSquareDark(rowIndex, pieceIndex)], {
                [s.SelectedSquare]: isSquareSelected(rowIndex, pieceIndex),
                [s.LastMove]: isSquareLastMove(rowIndex, pieceIndex),
                [s.KingInCheck]: isSquareChecked(rowIndex, pieceIndex),
                [s.PromotionSquare]: isSquarePromotionSquare(rowIndex, pieceIndex)
              })}
              onClick={() => move(rowIndex, pieceIndex)}
              key={pieceIndex}>
              <div
                className={classNames({
                  [s.SafeSquare]: isSquareSafeForSelectedPiece(rowIndex, pieceIndex)
                })}
              />
              {piece && <img src={pieceImagePaths[piece]} alt="piece" className={s.Piece} />}
            </div>
          ))}
        </div>
      ))}

      {chessBoard.gameOverMessage && (
        <h2 className={s.GameOverMessage}>{chessBoard.gameOverMessage}</h2>
      )}

      {isPromotionActive && (
        <div className={s.PromotionDialog}>
          {promotionPieces().map((piece, index) => (
            <img
              key={index}
              src={pieceImagePaths[piece]}
              alt="piece"
              onClick={() => promotePiece(piece)}
            />
          ))}
          <span className={s.ClosePromotionDialog} onClick={closePawnPromotionDialog}>
            &times;
          </span>
        </div>
      )}
    </div>
  )
}

export default ChessBoardComponent
