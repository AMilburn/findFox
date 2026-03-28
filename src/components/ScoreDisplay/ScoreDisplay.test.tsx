import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreDisplay } from "./ScoreDisplay";

describe("ScoreDisplay", () => {
  it("renders the score", () => {
    render(<ScoreDisplay score={7} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders zero score", () => {
    render(<ScoreDisplay score={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders the label", () => {
    render(<ScoreDisplay score={3} />);
    expect(screen.getByText("Score:")).toBeInTheDocument();
  });
});
