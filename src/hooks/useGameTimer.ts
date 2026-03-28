import { useEffect, useState } from "react";

interface UseGameTimerReturn {
  remainingSeconds: number;
  hasExpired: boolean;
}

export function useGameTimer(durationSeconds: number): UseGameTimerReturn {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const durationMs = durationSeconds * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, durationMs - elapsed);
      const seconds = Math.ceil(remaining / 1000);

      setRemainingSeconds(seconds);

      if (remaining <= 0) {
        setHasExpired(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [durationSeconds]);

  return { remainingSeconds, hasExpired };
}
