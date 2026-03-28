import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CELL_TYPE } from "./constants";

// ImagePool is not exported — access it via getImagePool().
// The module uses a singleton, so we reset modules before each test
// to get a fresh pool with a clean fill state.

function makeFetch() {
  let n = 0;
  return vi.fn().mockImplementation((url: string) => {
    n++;
    const body = url.includes("dog.ceo")
      ? { message: `https://dog.com/${n}.jpg` }
      : { image: `https://fox.com/${n}.jpg` };
    return Promise.resolve({ json: () => Promise.resolve(body) });
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", makeFetch());
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
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

async function getReadyPool() {
  const { getImagePool } = await import("./imagePool");
  const pool = getImagePool();
  // Drain the fill loop: fetch resolves instantly, only setTimeouts need advancing
  await vi.runAllTimersAsync();
  return pool;
}

describe("ImagePool — before fill completes", () => {
  it("assembleBatch returns null when pool is empty", async () => {
    const { getImagePool } = await import("./imagePool");
    const pool = getImagePool();
    // Don't advance timers — fill hasn't completed yet
    expect(pool.assembleBatch()).toBeNull();
  });

  it("isReady returns false when pool is empty", async () => {
    const { getImagePool } = await import("./imagePool");
    const pool = getImagePool();
    expect(pool.isReady()).toBe(false);
  });
});

describe("ImagePool — after fill completes", () => {
  it("isReady returns true", async () => {
    const pool = await getReadyPool();
    expect(pool.isReady()).toBe(true);
  });

  it("waitUntilReady resolves", async () => {
    const { getImagePool } = await import("./imagePool");
    const pool = getImagePool();
    const ready = pool.waitUntilReady();
    await vi.runAllTimersAsync();
    await expect(ready).resolves.toBeUndefined();
  });

  it("assembleBatch returns 9 cells", async () => {
    const pool = await getReadyPool();
    const cells = pool.assembleBatch();
    expect(cells).toHaveLength(9);
  });

  it("assembleBatch returns exactly 1 fox", async () => {
    const pool = await getReadyPool();
    const cells = pool.assembleBatch()!;
    expect(cells.filter((c) => c.type === CELL_TYPE.FOX)).toHaveLength(1);
  });

  it("assembleBatch returns 8 dogs", async () => {
    const pool = await getReadyPool();
    const cells = pool.assembleBatch()!;
    expect(cells.filter((c) => c.type === CELL_TYPE.DOG)).toHaveLength(8);
  });

  it("each cell has a unique id", async () => {
    const pool = await getReadyPool();
    const cells = pool.assembleBatch()!;
    const ids = cells.map((c) => c.id);
    expect(new Set(ids).size).toBe(9);
  });

  it("consumes urls from the pool on each call", async () => {
    const pool = await getReadyPool();
    const first = pool.assembleBatch()!;
    const second = pool.assembleBatch()!;
    const firstUrls = new Set(first.map((c) => c.imageUrl));
    const secondUrls = second.map((c) => c.imageUrl);
    expect(secondUrls.some((url) => firstUrls.has(url))).toBe(false);
  });

  it("returns null once pool is drained", async () => {
    const pool = await getReadyPool();
    // Drain all batches (pool fills with 160 dogs / 20 foxes = 20 batches max)
    let result = pool.assembleBatch();
    while (result !== null) {
      result = pool.assembleBatch();
    }
    expect(result).toBeNull();
  });
});
