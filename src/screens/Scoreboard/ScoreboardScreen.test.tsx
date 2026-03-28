import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlayerProvider } from "../../context/PlayerProvider";
import { ScoreboardScreen } from "./ScoreboardScreen";

function renderScoreboard(locationState?: Record<string, unknown>) {
  return render(
    <PlayerProvider initialName="TestPlayer">
      <MemoryRouter initialEntries={[{ pathname: "/scoreboard", state: locationState }]}>
        <ScoreboardScreen />
      </MemoryRouter>
    </PlayerProvider>,
  );
}

describe("ScoreboardScreen", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows empty state when no scores", () => {
    renderScoreboard();
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
  });

  it("displays scores from localStorage", () => {
    const scores = [
      { id: "a", name: "Alice", score: 10, date: "2026-01-15T10:00:00Z" },
      { id: "b", name: "Bob", score: 5, date: "2026-01-16T10:00:00Z" },
    ];
    localStorage.setItem("findfox_scores", JSON.stringify(scores));

    renderScoreboard();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("has Play Again and Home buttons", () => {
    renderScoreboard();
    expect(screen.getByRole("button", { name: /play again/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
  });

  it("highlights the current player entry via entryId", () => {
    const scores = [
      { id: "a", name: "Alice", score: 10, date: "2026-01-15T10:00:00Z" },
      { id: "b", name: "Bob", score: 5, date: "2026-01-16T10:00:00Z" },
    ];
    localStorage.setItem("findfox_scores", JSON.stringify(scores));

    renderScoreboard({ entryId: "b" });
    const row = screen.getByText("Bob").closest("tr")!;
    expect(row.className).toMatch(/highlighted/);
  });
});
