import { CELL_TYPE } from "../utils/constants";

export type CellType = (typeof CELL_TYPE)[keyof typeof CELL_TYPE];

export interface GridCell {
  id: string;
  imageUrl: string;
  type: CellType;
}

export interface ImageBatch {
  cells: GridCell[];
  ready: boolean;
}

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  date: string;
}
