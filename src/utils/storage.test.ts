import { describe, it, expect, beforeEach } from "vitest";
import { getScores, saveScore } from "./storage";
import type { ScoreEntry } from "../types";

function makeEntry(overrides: Partial<ScoreEntry> = {}): ScoreEntry {
  return {
    id: crypto.randomUUID(),
    name: "TestPlayer",
    score: 5,
    date: new Date().toISOString(),
    ...overrides,
  };
}

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array when no scores saved", () => {
    expect(getScores()).toEqual([]);
  });

  it("saves and retrieves a score", () => {
    const entry = makeEntry({ name: "Alice", score: 10 });
    saveScore(entry);
    const scores = getScores();
    expect(scores).toHaveLength(1);
    expect(scores[0]).toEqual(entry);
  });

  it("accumulates multiple scores", () => {
    saveScore(makeEntry({ score: 1 }));
    saveScore(makeEntry({ score: 2 }));
    saveScore(makeEntry({ score: 3 }));
    expect(getScores()).toHaveLength(3);
  });


  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("findfox_scores", "not-json");
    expect(getScores()).toEqual([]);
  });
});
