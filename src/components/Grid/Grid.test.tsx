import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Grid } from "./Grid";
import type { GridCell } from "../../types";
import { CELL_TYPE } from "../../utils/constants";

function makeCells(foxIndex = 0): GridCell[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `cell-${i}`,
    imageUrl: `https://example.com/${i}.jpg`,
    type: i === foxIndex ? CELL_TYPE.FOX : CELL_TYPE.DOG,
  }));
}

describe("Grid", () => {
  it("renders 9 cells", () => {
    render(<Grid cells={makeCells()} onCellClick={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
  });

  it("calls onCellClick with 'fox' when fox cell is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Grid cells={makeCells(0)} onCellClick={onClick} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(onClick).toHaveBeenCalledWith(CELL_TYPE.FOX);
  });

  it("calls onCellClick with 'dog' when dog cell is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Grid cells={makeCells(0)} onCellClick={onClick} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);
    expect(onClick).toHaveBeenCalledWith(CELL_TYPE.DOG);
  });

  it("disables all buttons when disabled prop is true", () => {
    render(<Grid cells={makeCells()} onCellClick={() => {}} disabled />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("does not re-render when props are unchanged", () => {
    const cells = makeCells();
    const onClick = vi.fn();
    const renderSpy = vi.fn();

    const SpyGrid = ({ cells, onCellClick, disabled }: Parameters<typeof Grid>[0] & { ref?: never }) => {
      renderSpy();
      return <Grid cells={cells} onCellClick={onCellClick} disabled={disabled} />;
    };

    const { rerender } = render(<SpyGrid cells={cells} onCellClick={onClick} disabled={false} />);
    rerender(<SpyGrid cells={cells} onCellClick={onClick} disabled={false} />);

    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});
