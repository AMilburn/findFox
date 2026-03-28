import { useState, useCallback, useEffect } from "react";
import type { ImageBatch } from "../types";
import { getImagePool } from "../utils/imagePool";

export function useImageQueue() {
  const [currentBatch, setCurrentBatch] = useState<ImageBatch | null>(null);
  const pool = getImagePool();

  // Wait for the pool to have enough images, then show the first batch
  useEffect(() => {
    let mounted = true;

    pool.waitUntilReady().then(() => {
      if (mounted) {
        const cells = pool.assembleBatch();
        if (cells) {
          setCurrentBatch({ cells, ready: true });
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [pool]);

  // Synchronous: grab the next batch from the pool instantly.
  // Returns true if the batch advanced, false if pool was empty.
  const advanceBatch = useCallback((): boolean => {
    const cells = pool.assembleBatch();
    if (cells) {
      setCurrentBatch({ cells, ready: true });
      return true;
    }
    return false;
  }, [pool]);

  return { currentBatch, advanceBatch };
}
