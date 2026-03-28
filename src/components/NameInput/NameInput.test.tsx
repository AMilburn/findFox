import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NameInput } from "./NameInput";

describe("NameInput", () => {
  it("renders with placeholder text", () => {
    render(<NameInput onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("submit button is disabled when input is empty", () => {
    render(<NameInput onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Start" })).toBeDisabled();
  });

  it("submit button enables when name is entered", async () => {
    const user = userEvent.setup();
    render(<NameInput onSubmit={() => {}} />);

    await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
    expect(screen.getByRole("button", { name: "Start" })).toBeEnabled();
  });

  it("calls onSubmit with trimmed name on form submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NameInput onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Enter your name"), "  Bob  ");
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(onSubmit).toHaveBeenCalledWith("Bob");
  });

  it("uses custom button label", () => {
    render(<NameInput onSubmit={() => {}} buttonLabel="Save" />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("does not submit when input is only whitespace", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NameInput onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Enter your name"), "   ");
    await user.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
