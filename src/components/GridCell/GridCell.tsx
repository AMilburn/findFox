import type { GridCell as GridCellType, CellType } from "../../types";
import styles from "./GridCell.module.css";

interface GridCellProps {
  cell: GridCellType;
  onClick: (type: CellType) => void;
  disabled?: boolean;
}

export function GridCell({ cell, onClick, disabled = false }: GridCellProps) {
  return (
    <button
      className={styles.cell}
      onClick={() => onClick(cell.type)}
      disabled={disabled}
      aria-label={`Click to find the fox`}
    >
      <img
        src={cell.imageUrl}
        alt={cell.type}
        className={styles.image}
        loading="eager"
      />
    </button>
  );
}
