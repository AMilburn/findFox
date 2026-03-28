import { useState, useCallback } from "react";
import type { ScoreEntry } from "../types";
import { getScores, saveScore as saveScoreToStorage } from "../utils/storage";

export function useScores() {
  const [scores, setScores] = useState<ScoreEntry[]>(() => getScores());

  const addScore = useCallback((entry: ScoreEntry) => {
    saveScoreToStorage(entry);
    setScores((prev) => [...prev, entry]);
  }, []);

  const getAllScores = useCallback(() => {
    return scores;
  }, [scores]);

  return {
    scores,
    addScore,
    getAllScores,
  };
}
