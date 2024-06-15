import { Piece } from 'src/chess-logic/pieces/piece.ts'
import { Color, Coords, FENChar } from 'src/chess-logic/models.ts'

export class Bishop extends Piece {
  protected override _FENChar: FENChar
  protected override _directions: Coords[] = [
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 }
  ]

  constructor(pieceColor: Color) {
    super(pieceColor)
    this._FENChar = pieceColor === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop
  }
}
