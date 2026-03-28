import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { preloadImage } from "./imageLoader";

function stubImageSuccess() {
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
}

function stubImageError() {
  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_: string) {
        Promise.resolve().then(() => this.onerror?.());
      }
    },
  );
}

beforeEach(() => stubImageSuccess());
afterEach(() => vi.unstubAllGlobals());

describe("preloadImage", () => {
  it("resolves with the url when image loads", async () => {
    const url = "https://example.com/fox.jpg";
    await expect(preloadImage(url)).resolves.toBe(url);
  });

  it("rejects when image fails to load", async () => {
    stubImageError();
    await expect(preloadImage("https://bad.com/img.jpg")).rejects.toThrow();
  });
});
