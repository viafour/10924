# Development

10924 starts as a small browser-first TypeScript prototype. The current first-game direction is **10924: Liberty**, an isometric narrative RPG centered on Via Four.

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

## Liberty Runtime Manual Test

After `npm run dev`, open `http://localhost:5173`.

Expected behavior:

- The primary local playable character is named `Via Four`.
- Via Four does not also appear as a stationary NPC placeholder.
- Left-clicking the isometric grid moves Via Four toward the clicked world location.
- Holding left mouse button guides movement toward the current cursor position.
- The camera follows Via Four.
- `http://localhost:3000/health` returns ok.

## Local Multi-Tab Test

The server/socket foundation remains available for future-ready session infrastructure and local testing.

Expected behavior with multiple browser tabs:

- The first active tab controls `Via Four`.
- Additional local test tabs receive non-canon labels such as `Echo 1` and `Echo 2`.
- Moving in one tab updates the remote marker in the other tab.
- Closing one tab removes that remote marker from the other tab.
- Extra tabs are development/session test clients, not canon duplicate Via Fours.

## Optional Docker Compose

`infra/docker-compose.yml` is only a local development convenience. It is not production infrastructure and does not introduce cloud deployment, managed services, or persistence.

## Current Non-Goals

The foundation intentionally does not include:

- authentication
- accounts
- database persistence
- combat
- inventory
- quest systems
- cloud deployment
- production infrastructure
- large-scale multiplayer systems

The server currently stores temporary session positions in memory only. Player identities and positions disappear when the server restarts.

For future PostgreSQL and account planning, see [PERSISTENCE-PLAN.md](PERSISTENCE-PLAN.md).
