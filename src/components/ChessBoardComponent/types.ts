import { FENChar } from 'src/chess-logic/models.ts'

interface SquareWithPiece {
  piece: FENChar
  x: number
  y: number
}

interface SquareWithoutPiece {
  piece: null
}

export type SelectedSquare = SquareWithPiece | SquareWithoutPiece

export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
