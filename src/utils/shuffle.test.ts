import { describe, it, expect } from "vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("returns an array of the same length", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
  });

  it("contains all original elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it("does not mutate the original array", () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it("returns an empty array for empty input", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("returns a single-element array unchanged", () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it("produces different orderings over many runs", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const serialized = JSON.stringify(input);
    let sawDifferent = false;
    for (let i = 0; i < 20; i++) {
      if (JSON.stringify(shuffle(input)) !== serialized) {
        sawDifferent = true;
        break;
      }
    }
    expect(sawDifferent).toBe(true);
  });
});
