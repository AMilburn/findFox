import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { PlayerProvider } from "./PlayerProvider";
import { usePlayer } from "./PlayerContext";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PlayerProvider>{children}</PlayerProvider>
);

describe("PlayerContext", () => {
  it("starts with empty player name", () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });
    expect(result.current.playerName).toBe("");
  });

  it("updates player name", () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });

    act(() => {
      result.current.setPlayerName("Alice");
    });

    expect(result.current.playerName).toBe("Alice");
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => usePlayer());
    }).toThrow("usePlayer must be used within PlayerProvider");
  });
});
