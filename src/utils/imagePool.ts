import type { GridCell } from "../types";
import { shuffle } from "./shuffle";
import { CELL_TYPE, PROMISE_STATUS } from "./constants";
import { preloadImage } from "./imageLoader";

const DOG_API = "https://dog.ceo/api/breeds/image/random";
const FOX_API = "https://randomfox.ca/floof/";

// keep the pool stocked (20 batches)
const TARGET_DOGS = 160;
const TARGET_FOXES = 20;
const REFILL_THRESHOLD_DOGS = 40;
const REFILL_THRESHOLD_FOXES = 5;

class ImagePool {
  private dogs: string[] = [];
  private foxes: string[] = [];
  private filling = false;

  constructor() {
    this.fill();
  }

  assembleBatch(): GridCell[] | null {
    if (this.dogs.length < 8 || this.foxes.length < 1) {
      return null;
    }

    const dogUrls = this.dogs.splice(0, 8);
    const foxUrl = this.foxes.shift()!;

    const dogCells: GridCell[] = dogUrls.map((url) => ({
      id: crypto.randomUUID(),
      imageUrl: url,
      type: CELL_TYPE.DOG,
    }));

    const foxCell: GridCell = {
      id: crypto.randomUUID(),
      imageUrl: foxUrl,
      type: CELL_TYPE.FOX,
    };

    const cells = shuffle([foxCell, ...dogCells]);

    if (
      this.dogs.length < REFILL_THRESHOLD_DOGS ||
      this.foxes.length < REFILL_THRESHOLD_FOXES
    ) {
      this.fill();
    }

    return cells;
  }

  // used on first load, poll every 50s until there is enough for a batch
  isReady(): boolean {
    return this.dogs.length >= 8 && this.foxes.length >= 1;
  }

  waitUntilReady(): Promise<void> {
    if (this.isReady()) return Promise.resolve();
    return new Promise((resolve) => {
      const check = () => {
        if (this.isReady()) {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  private async fill(): Promise<void> {
    // guard to avoid concurrent reqs
    if (this.filling) return;
    this.filling = true;

    try {
      while (
        this.dogs.length < TARGET_DOGS ||
        this.foxes.length < TARGET_FOXES
      ) {
        const promises: Promise<void>[] = [];

        if (this.dogs.length < TARGET_DOGS) {
          promises.push(
            Promise.allSettled(
              Array(16) // run 16 fetch chains in parallel
                .fill(null)
                .map(() =>
                  fetch(DOG_API)
                    .then((r) => r.json())
                    .then((d) => d.message as string)
                    .then(preloadImage),
                ),
            ).then((results) => {
              for (const r of results) {
                if (r.status === PROMISE_STATUS.FULFILLED && r.value) {
                  this.dogs.push(r.value);
                }
              }
            }),
          );
        }

        if (this.foxes.length < TARGET_FOXES) {
          promises.push(
            Promise.allSettled(
              Array(2) // run 2 fetch chains in parallel (ratio 8:1)
                .fill(null)
                .map(() =>
                  fetch(FOX_API)
                    .then((r) => r.json())
                    .then((d) => d.image as string)
                    .then(preloadImage),
                ),
            ).then((results) => {
              for (const r of results) {
                if (r.status === PROMISE_STATUS.FULFILLED && r.value) {
                  this.foxes.push(r.value);
                }
              }
            }),
          );
        }
        await Promise.all(promises);
        // Yield between bursts — prevents a tight spin loop if the API is down
        // and failed fetches resolve instantly, which would exhaust memory.
        await new Promise((r) => setTimeout(r, 50));
      }
    } finally {
      this.filling = false;
    }
  }
}

let pool: ImagePool | null = null;

export function getImagePool(): ImagePool {
  // ensure only one image pool ever exists
  if (!pool) {
    pool = new ImagePool();
  }
  return pool;
}
