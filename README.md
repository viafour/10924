# 10924

This repository exists to bring to life the universe of 10924 as a browser-based, explorable RPG narrative world.

The current first-game direction is **10924: Liberty**: an isometric narrative RPG centered on Via Four, the surviving Via-class dedrix weapon created during the Great War. The project is being built to explore what can happen when Bliss, Ciarelle, and Codex collaborate as creative and technical partners.

## Project shape

- **Format:** browser-first isometric narrative RPG prototype
- **Primary experience:** transformation-driven action, exploration, atmosphere, memory, and narrative discovery
- **Initial world focus:** Via Four, dedrix transformation, the Great War, and the aftermath of being classified as a sentient catastrophe-class weapon
- **Secondary/archival focus:** Druz, the Druzhinzi, and Naem Etil remain important 10924 canon, but they are no longer the initial playable focus
- **Core inspiration:** the atmosphere and mystery of Diablo II, the tactical pressure of deliberate input systems, and morally complicated war stories where no faction remains clean

## Development posture

This project starts local-first and simple. It should prefer understandable architecture over premature scale, visible progress over perfect abstractions, and small playable milestones over sprawling design documents that never become real.

The first goal is not to build the final version of 10924. The first goal is to let someone open a browser and feel a little piece of the world breathing back.

## Local development

Requirements:

- Node.js 20 or newer
- npm 10 or newer
- Opera GX or Google Chrome for initial browser testing

Install dependencies:

```sh
npm install
```

Start the local client and server:

```sh
npm run dev
```

Local URLs:

- Client: `http://localhost:5173`
- Server: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

Useful scripts:

```sh
npm run typecheck
npm run build
```

For more detail, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

For game-facing lore, start with [docs/LORE.md](docs/LORE.md).
