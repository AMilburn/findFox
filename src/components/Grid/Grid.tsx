import React from "react";
import type { GridCell as GridCellType, CellType } from "../../types";
import { GridCell } from "../GridCell/GridCell";
import styles from "./Grid.module.css";

interface GridProps {
  cells: GridCellType[];
  onCellClick: (type: CellType) => void;
  disabled?: boolean;
}

export const Grid = React.memo(
  ({ cells, onCellClick, disabled = false }: GridProps) => {
    return (
      <div className={styles.grid}>
        {cells.map((cell) => (
          <GridCell
            key={cell.id}
            cell={cell}
            onClick={onCellClick}
            disabled={disabled}
          />
        ))}
      </div>
    );
  },
);
