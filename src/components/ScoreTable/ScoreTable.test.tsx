import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreTable } from "./ScoreTable";
import type { ScoreEntry } from "../../types";

const entries: ScoreEntry[] = [
  { id: "1", name: "Alice", score: 15, date: "2026-01-15T10:30:00.000Z" },
  { id: "2", name: "Bob", score: 12, date: "2026-01-16T14:00:00.000Z" },
  { id: "3", name: "Charlie", score: 8, date: "2026-01-17T09:15:00.000Z" },
];

describe("ScoreTable", () => {
  it("renders all entries", () => {
    render(<ScoreTable entries={entries} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("displays rank numbers", () => {
    render(<ScoreTable entries={entries} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays scores", () => {
    render(<ScoreTable entries={entries} />);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("highlights the entry matching highlightId", () => {
    render(<ScoreTable entries={entries} highlightId="2" />);
    const row = screen.getByText("Bob").closest("tr")!;
    expect(row.className).toMatch(/highlighted/);
  });

  it("does not highlight when no highlightId", () => {
    render(<ScoreTable entries={entries} />);
    const rows = screen.getAllByRole("row").slice(1); // skip header
    rows.forEach((row) => {
      expect(row.className).not.toMatch(/highlighted/);
    });
  });
});
