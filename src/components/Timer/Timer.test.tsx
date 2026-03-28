import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Timer } from "./Timer";

describe("Timer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays the initial duration", () => {
    const onExpire = vi.fn();
    render(<Timer duration={30} onExpire={onExpire} />);
    expect(screen.getByText("30s")).toBeInTheDocument();
  });

  it("counts down over time", () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => start);

    const onExpire = vi.fn();
    render(<Timer duration={10} onExpire={onExpire} />);

    // Advance 3 seconds
    vi.spyOn(Date, "now").mockImplementation(() => start + 3000);
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("7s")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("calls onExpire when timer reaches 0", () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => start);

    const onExpire = vi.fn();
    render(<Timer duration={5} onExpire={onExpire} />);

    vi.spyOn(Date, "now").mockImplementation(() => start + 5000);
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(screen.getByText("0s")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("applies urgent styling at 5 seconds or less", () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.spyOn(Date, "now").mockImplementation(() => start);

    const onExpire = vi.fn();
    render(<Timer duration={10} onExpire={onExpire} />);

    // At 6s remaining — not urgent
    vi.spyOn(Date, "now").mockImplementation(() => start + 4000);
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    const timerEl = screen.getByText("6s").closest("div")!;
    expect(timerEl.className).not.toMatch(/urgent/);

    // At 5s remaining — urgent
    vi.spyOn(Date, "now").mockImplementation(() => start + 5100);
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    const timerEl2 = screen.getByText("5s").closest("div")!;
    expect(timerEl2.className).toMatch(/urgent/);
    vi.useRealTimers();
  });
});
