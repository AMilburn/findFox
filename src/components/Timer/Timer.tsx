import { useEffect, useState } from "react";
import styles from "./Timer.module.css";

interface TimerProps {
  duration: number;
  onExpire: () => void;
}

export function Timer({ duration, onExpire }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(duration);

  useEffect(() => {
    const startTime = Date.now();
    const durationMs = duration * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, durationMs - elapsed);
      const seconds = Math.ceil(remaining / 1000);

      setRemainingSeconds(seconds);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onExpire]);

  const isUrgent = remainingSeconds <= 5;

  return (
    <div className={`${styles.timer} ${isUrgent ? styles.urgent : ""}`}>
      <span className={styles.label}>Time:</span>
      <span className={styles.value}>{remainingSeconds}s</span>
    </div>
  );
}
