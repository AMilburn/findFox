import type { ScoreEntry } from "../../types";
import styles from "./ScoreTable.module.css";

interface ScoreTableProps {
  entries: ScoreEntry[];
  highlightId?: string;
}

export function ScoreTable({ entries, highlightId }: ScoreTableProps) {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rankCol}>Rank</th>
            <th className={styles.nameCol}>Name</th>
            <th className={styles.scoreCol}>Score</th>
            <th className={styles.dateCol}>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className={`${styles.row} ${
                highlightId === entry.id ? styles.highlighted : ""
              }`}
            >
              <td className={styles.rankCol}>{index + 1}</td>
              <td className={styles.nameCol}>{entry.name}</td>
              <td className={styles.scoreCol}>{entry.score}</td>
              <td className={styles.dateCol}>{formatDate(entry.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
