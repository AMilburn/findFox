import styles from "./ScoreDisplay.module.css";

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className={styles.scoreDisplay}>
      <span className={styles.label}>Score:</span>
      <span className={styles.value}>{score}</span>
    </div>
  );
}
