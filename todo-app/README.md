# Fresh Sort

A small interactive produce-sorting demo demonstrating unidirectional state flow with Zustand inside a Next.js 16 App Router page.

## Live Demo

Deployed on Vercel: <https://todo-app-iota-steel-32.vercel.app>

## Requirements

From the [7Solutions frontend assignment](https://github.com/7-solutions/frontend-assignment):

- A list of clickable buttons (11 items: Fruit / Vegetable).
- Clicking an item in the main list moves it into a column based on its type.
- After 5 seconds the item automatically returns to the **bottom** of the main list.
- Clicking an item inside a column returns it to the bottom of the main list **immediately** and cancels the timer.

## Tech Stack

| Library               | Version | Why                                                          |
| --------------------- | ------- | ------------------------------------------------------------ |
| Next.js               | 16      | App Router, static generation, default production setup.     |
| React                 | 19      | Latest stable runtime for the project template.              |
| TypeScript            | 5       | Type-safe actions and state slices.                          |
| Tailwind CSS          | 4       | Utility-first styling with built-in design tokens.           |
| Zustand               | 5       | Tiny, unopinionated store with selector-based subscriptions. |
| Vitest                | 4       | Fast unit tests with fake timers.                            |
| React Testing Library | 16      | Component tests focused on user behavior.                    |
| Playwright            | 1       | E2E tests against the real browser with clock mocking.       |

Zustand was chosen over Redux here because the state surface is small; it still demonstrates flux-style unidirectional flow (actions as the single writer to state) without the boilerplate of a larger store.

## State Architecture

The source of truth is a single Zustand store:

- `mainList`: ordered items in the left column.
- `columns.Fruit` / `columns.Vegetable`: items currently moved out.
- `moveToColumn(item)`: removes from `mainList`, pushes into the correct column, and starts a 5-second `setTimeout`.
- `returnToMain(item)`: clears the timeout, removes from the column, and pushes to the end of `mainList`.

Timeout handles are kept in a module-level `Map` keyed by item name rather than in React state. This avoids re-rendering on every tick and keeps timer bookkeeping out of the component tree, making the logic easy to test without rendering.

### Why not `useReducer` + Context?

`useReducer` is a valid alternative for this scope. Zustand was selected to show a lightweight external store with selector-based subscriptions, which avoids re-rendering unrelated columns when an item moves.

### Why not put timers in state?

Timer handles are not render data. Putting them in state would trigger unnecessary re-renders and complicate SSR snapshots. Keeping them in a module-level Map keeps the public state serializable and hydration-safe.

## SSR / Hydration Notes

`page.tsx` is a Server Component. It renders the client boundary at `TodoBoard`, which is marked with `'use client'`. Timers are only started by user interaction, so there is no mismatch between server-rendered HTML and hydrated state. The dataset is a static constant, so the initial markup is identical on server and client.

## Run Locally

```bash
cd todo-app
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Test

```bash
pnpm test
```

## E2E Tests

```bash
pnpm exec playwright install chromium
pnpm e2e
```

Scenarios:

- Move a fruit to the Fruit column and verify it returns to the bottom of the main list after 5 seconds.
- Click a column item to return it immediately and confirm the auto-return timer is cancelled.

Playwright `page.clock` is used to advance time without real waits.

## Build

```bash
pnpm build
```
