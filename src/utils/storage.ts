import type { ScoreEntry } from "../types";

const STORAGE_KEY = "findfox_scores";

export function getScores(): ScoreEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveScore(entry: ScoreEntry): void {
  const scores = getScores();
  scores.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}
