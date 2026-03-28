import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GridCell } from "./GridCell";
import { CELL_TYPE } from "../../utils/constants";

const foxCell = {
  id: "fox-1",
  imageUrl: "https://example.com/fox.jpg",
  type: CELL_TYPE.FOX,
};

const dogCell = {
  id: "dog-1",
  imageUrl: "https://example.com/dog.jpg",
  type: CELL_TYPE.DOG,
};

describe("GridCell", () => {
  it("renders an image with the correct src", () => {
    render(<GridCell cell={foxCell} onClick={() => {}} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", foxCell.imageUrl);
  });

  it("calls onClick with cell type when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<GridCell cell={foxCell} onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(CELL_TYPE.FOX);
  });

  it("passes dog type on click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<GridCell cell={dogCell} onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(CELL_TYPE.DOG);
  });

  it("is disabled when disabled prop is true", () => {
    render(<GridCell cell={dogCell} onClick={() => {}} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
