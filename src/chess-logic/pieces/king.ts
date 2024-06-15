import { Piece } from 'src/chess-logic/pieces/piece.ts'
import { Color, Coords, FENChar } from 'src/chess-logic/models.ts'

export class King extends Piece {
  private _hasMoved: boolean = false
  protected override _FENChar: FENChar
  protected override _directions: Coords[] = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 }
  ]

  constructor(pieceColor: Color) {
    super(pieceColor)
    this._FENChar = pieceColor === Color.White ? FENChar.WhiteKing : FENChar.BlackKing
  }

  public get hasMoved(): boolean {
    return this._hasMoved
  }

  set hasMoved(_) {
    this._hasMoved = true
  }
}
