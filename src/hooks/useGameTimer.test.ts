import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameTimer } from "./useGameTimer";

describe("useGameTimer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with full duration", () => {
    const { result } = renderHook(() => useGameTimer(30));
    expect(result.current.remainingSeconds).toBe(30);
    expect(result.current.hasExpired).toBe(false);
  });

  it("counts down over time", () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => start);

    const { result } = renderHook(() => useGameTimer(10));

    vi.spyOn(Date, "now").mockImplementation(() => start + 4000);
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.remainingSeconds).toBe(6);
    expect(result.current.hasExpired).toBe(false);
    vi.useRealTimers();
  });

  it("expires when time runs out", () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => start);

    const { result } = renderHook(() => useGameTimer(5));

    vi.spyOn(Date, "now").mockImplementation(() => start + 5000);
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.remainingSeconds).toBe(0);
    expect(result.current.hasExpired).toBe(true);
    vi.useRealTimers();
  });

  it("never goes below 0", () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => start);

    const { result } = renderHook(() => useGameTimer(3));

    vi.spyOn(Date, "now").mockImplementation(() => start + 10000);
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.remainingSeconds).toBe(0);
    vi.useRealTimers();
  });
});
