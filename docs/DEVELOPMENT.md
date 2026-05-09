# Development

10924 starts as a small browser-first TypeScript prototype. The goal is a visible, understandable foundation for an isometric narrative MMO/RPG, not a complete MMO architecture.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A Chromium-based browser such as Opera GX or Chrome

## Setup

```sh
npm install
npm run dev
```

The local client runs at:

```text
http://localhost:5173
```

The local server runs at:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

## Workspace Layout

- `client/` contains the Vite, TypeScript, and PixiJS browser app.
- `server/` contains the Node.js TypeScript Socket.IO server.
- `shared/` contains TypeScript types shared by client and server.
- `infra/` contains optional local development orchestration.
- `docs/` contains project direction, lore, and development notes.

## Scripts

```sh
npm run dev
npm run typecheck
npm run build
```

`npm run dev` starts the client and server together. `npm run typecheck` verifies TypeScript across all workspaces. `npm run build` builds the shared package first, then the client and server.

## Optional Docker Compose

`infra/docker-compose.yml` is only a local development convenience. It is not production infrastructure and does not introduce cloud deployment, managed services, or persistence.

## Current Non-Goals

The foundation intentionally does not include:

- authentication
- accounts
- database persistence
- combat
- inventory
- cloud deployment
- production infrastructure
- large-scale MMO systems

The first target is a tiny playable vertical foundation: a browser view, a visible isometric space, a placeholder player marker, and a minimal realtime server.
