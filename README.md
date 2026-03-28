# FindFox 🦊

A speed-based browser game built with React, TypeScript, and Vite. A 3x3 grid shows 8 dog images and 1 fox image — click the fox to score a point and advance to the next grid. Click a dog and lose a point. Score as many as you can before the 30-second timer runs out.

## How It Works

**Image pool with background prefetching:** An `ImagePool` singleton fetches and caches images in the background. It maintains a buffer of 160 dog and 20 fox URLs — enough for ~20 rounds of uninterrupted gameplay. When the buffer drops below a threshold, it silently refills. Every image URL is run through `new Image()` before entering the pool, so the browser cache is warm and all 9 images appear simultaneously when the grid renders.

**Timer isolation:** The countdown timer manages its own state internally. Timer ticks (every 100ms) only re-render the timer component — the grid and score display are unaffected, keeping click response instant.

**Click lock:** A ref-based lock prevents double-scoring if the user clicks faster than React can swap the grid. The lock is set on a successful fox click and released when the new batch renders.

**Score persistence:** Scores are saved to `localStorage` so they survive page reloads.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v7
- CSS Modules
- Vitest + React Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Running Tests

```bash
npm test           # single run
npm run test:watch # watch mode
```

## External APIs

- Dogs: [dog.ceo/api](https://dog.ceo/dog-api/)
- Foxes: [randomfox.ca](https://randomfox.ca/)
