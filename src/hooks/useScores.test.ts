import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScores } from "./useScores";

describe("useScores", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty scores", () => {
    const { result } = renderHook(() => useScores());
    expect(result.current.scores).toEqual([]);
  });

  it("adds a score", () => {
    const { result } = renderHook(() => useScores());
    const entry = {
      id: "test-1",
      name: "Alice",
      score: 10,
      date: new Date().toISOString(),
    };

    act(() => {
      result.current.addScore(entry);
    });

    expect(result.current.scores).toHaveLength(1);
    expect(result.current.scores[0]).toEqual(entry);
  });

  it("persists scores to localStorage", () => {
    const { result } = renderHook(() => useScores());
    const entry = {
      id: "test-2",
      name: "Bob",
      score: 5,
      date: new Date().toISOString(),
    };

    act(() => {
      result.current.addScore(entry);
    });

    const stored = JSON.parse(localStorage.getItem("findfox_scores")!);
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe("Bob");
  });

  it("loads existing scores from localStorage on mount", () => {
    const existing = [
      { id: "pre-1", name: "Pre", score: 3, date: "2026-01-01T00:00:00Z" },
    ];
    localStorage.setItem("findfox_scores", JSON.stringify(existing));

    const { result } = renderHook(() => useScores());
    expect(result.current.scores).toHaveLength(1);
    expect(result.current.scores[0].name).toBe("Pre");
  });
});
