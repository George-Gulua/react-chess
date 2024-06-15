import { Piece } from 'src/chess-logic/pieces/piece.ts'

export const enum Color {
  White,
  Black
}

export interface Coords {
  x: number
  y: number
}

export const enum FENChar {
  WhitePawn = 'P',
  WhiteKnight = 'N',
  WhiteBishop = 'B',
  WhiteRook = 'R',
  WhiteQueen = 'Q',
  WhiteKing = 'K',
  BlackPawn = 'p',
  BlackKnight = 'n',
  BlackBishop = 'b',
  BlackRook = 'r',
  BlackQueen = 'q',
  BlackKing = 'k'
}

export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
  [FENChar.WhitePawn]: 'src/assets/images/piece/white/pawn.svg',
  [FENChar.WhiteBishop]: 'src/assets/images/piece/white/bishop.svg',
  [FENChar.WhiteKing]: 'src/assets/images/piece/white/king.svg',
  [FENChar.WhiteQueen]: 'src/assets/images/piece/white/queen.svg',
  [FENChar.WhiteRook]: 'src/assets/images/piece/white/rook.svg',
  [FENChar.WhiteKnight]: 'src/assets/images/piece/white/knight.svg',
  [FENChar.BlackPawn]: 'src/assets/images/piece/black/pawn.svg',
  [FENChar.BlackBishop]: 'src/assets/images/piece/black/bishop.svg',
  [FENChar.BlackKing]: 'src/assets/images/piece/black/king.svg',
  [FENChar.BlackQueen]: 'src/assets/images/piece/black/queen.svg',
  [FENChar.BlackRook]: 'src/assets/images/piece/black/rook.svg',
  [FENChar.BlackKnight]: 'src/assets/images/piece/black/knight.svg'
}

export type SaveSquares = Map<string, Coords[]>

export interface LastMove {
  piece: Piece
  prevX: number
  prevY: number
  currX: number
  currY: number
}

interface KingChecked {
  isInCheck: true
  x: number
  y: number
}

interface KingNotChecked {
  isInCheck: false
}

export type CheckState = KingChecked | KingNotChecked
