import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WelcomeScreen } from "./WelcomeScreen";
import { TestWrapper } from "../../test/helpers";

describe("WelcomeScreen", () => {
  it("shows name input on first visit", () => {
    render(<WelcomeScreen />, { wrapper: TestWrapper });
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("shows title", () => {
    render(<WelcomeScreen />, { wrapper: TestWrapper });
    expect(screen.getByText("Find the Fox")).toBeInTheDocument();
  });

  it("transitions to greeting after entering name", async () => {
    const user = userEvent.setup();
    render(<WelcomeScreen />, { wrapper: TestWrapper });

    await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
    await user.click(screen.getByRole("button", { name: "Start" }));

    expect(screen.getByText("Hello, Alice!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Name" })).toBeInTheDocument();
  });

  it("returns to name input when Edit Name is clicked", async () => {
    const user = userEvent.setup();
    render(<WelcomeScreen />, { wrapper: TestWrapper });

    await user.type(screen.getByPlaceholderText("Enter your name"), "Bob");
    await user.click(screen.getByRole("button", { name: "Start" }));
    await user.click(screen.getByRole("button", { name: "Edit Name" }));

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });
});
