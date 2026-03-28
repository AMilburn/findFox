import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// This ensures each test gets a fresh ImagePool singleton and PlayerContext,
// and that GameScreen and the test wrapper reference the same instances.
async function renderGame() {
  const [{ GameScreen }, { PlayerProvider }] = await Promise.all([
    import("../screens/Game/GameScreen"),
    import("../context/PlayerProvider"),
  ]);

  render(
    <PlayerProvider initialName="TestPlayer">
      <MemoryRouter>
        <GameScreen />
      </MemoryRouter>
    </PlayerProvider>,
  );
}

function clickFox() {
  fireEvent.click(screen.getByAltText("fox").closest("button")!);
}
function clickDog() {
  fireEvent.click(screen.getAllByAltText("dog")[0].closest("button")!);
}
function getScore() {
  return screen
    .getByText("Score:")
    .parentElement!.querySelector("span:last-child")!.textContent;
}

async function waitForGrid() {
  await act(() => vi.advanceTimersByTimeAsync(500));
}

beforeEach(() => {
  vi.useFakeTimers();

  let n = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((url: string) => {
      n++;
      const body = url.includes("dog.ceo")
        ? { message: `https://dog.com/${n}.jpg` }
        : { image: `https://fox.com/${n}.jpg` };
      return Promise.resolve({ json: () => Promise.resolve(body) });
    }),
  );

  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_: string) {
        Promise.resolve().then(() => this.onload?.());
      }
    },
  );

  vi.resetModules();
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Image API integration", () => {
  it("shows loading state before pool fills", async () => {
    await renderGame();
    expect(screen.getByText("Loading game...")).toBeInTheDocument();
  });

  it("renders 9 cells once pool fills from mocked APIs", async () => {
    await renderGame();
    await waitForGrid();
    expect(screen.queryByText("Loading game...")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("renders exactly 1 fox image and 8 dog images", async () => {
    await renderGame();
    await waitForGrid();
    expect(screen.getAllByAltText("fox")).toHaveLength(1);
    expect(screen.getAllByAltText("dog")).toHaveLength(8);
  });

  it("fox click increments score", async () => {
    await renderGame();
    await waitForGrid();
    expect(getScore()).toBe("0");

    clickFox();
    await act(async () => {});

    expect(getScore()).toBe("1");
  });

  it("dog click does not go below 0", async () => {
    await renderGame();
    await waitForGrid();

    clickDog();
    await act(async () => {});

    expect(getScore()).toBe("0");
  });

  it("grid advances to a new batch after fox click", async () => {
    await renderGame();
    await waitForGrid();

    const urlsBefore = screen
      .getAllByRole("img")
      .map((img) => img.getAttribute("src"));

    clickFox();
    await act(async () => {});

    const urlsAfter = screen
      .getAllByRole("img")
      .map((img) => img.getAttribute("src"));
    expect(urlsAfter).not.toEqual(urlsBefore);
  });

  it("three consecutive fox clicks score exactly 3", async () => {
    await renderGame();
    await waitForGrid();

    for (let i = 0; i < 3; i++) {
      clickFox();
      await act(async () => {});
    }

    expect(getScore()).toBe("3");
  });

  it("timer counts down correctly (10s elapsed → 20s shown)", async () => {
    await renderGame();
    await waitForGrid();
    await act(() => vi.advanceTimersByTimeAsync(10000));
    expect(screen.getByText("20s")).toBeInTheDocument();
  });

  it("saves score to localStorage when timer reaches 0", async () => {
    await renderGame();
    await waitForGrid();

    clickFox();
    await act(async () => {});
    clickFox();
    await act(async () => {}); // score = 2

    await act(() => vi.advanceTimersByTimeAsync(30200));

    const scores = JSON.parse(localStorage.getItem("findfox_scores") ?? "[]");
    expect(scores).toHaveLength(1);
    expect(scores[0].score).toBe(2);
    expect(scores[0].name).toBe("TestPlayer");
  });

  it("grid buttons are disabled after timer expires", async () => {
    await renderGame();
    await waitForGrid();
    await act(() => vi.advanceTimersByTimeAsync(30000));

    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("stays in loading state when image API is down", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    await renderGame();
    await act(() => vi.advanceTimersByTimeAsync(500));

    expect(screen.getByText("Loading game...")).toBeInTheDocument();
  });

  it("each batch uses unique image URLs from the pool", async () => {
    await renderGame();
    await waitForGrid();

    const allUrls: string[] = [];
    for (let i = 0; i < 3; i++) {
      screen
        .getAllByRole("img")
        .forEach((img) => allUrls.push(img.getAttribute("src")!));
      clickFox();
      await act(async () => {});
    }

    expect(new Set(allUrls).size).toBe(allUrls.length);
  });
});
