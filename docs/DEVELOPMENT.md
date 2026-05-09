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

## Milestone 2 Manual Test

After `npm run dev`, open `http://localhost:5173` in two browser tabs.

Expected behavior:

- The local player is named `Explorer`, not `Naem`.
- Naem appears as a stationary NPC placeholder.
- Left-clicking the isometric grid moves the local player toward the clicked world location.
- The camera follows the local player.
- Each browser tab receives a different temporary Explorer identity.
- Moving in one tab updates the remote marker in the other tab.
- Closing one tab removes that remote player from the other tab.
- `http://localhost:3000/health` returns ok.

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
- large-scale MMO systems

Milestone 2 adds temporary multiplayer presence only. Player identities and positions are kept in server memory and disappear when the server restarts.

For future PostgreSQL and account planning, see [PERSISTENCE-PLAN.md](PERSISTENCE-PLAN.md).
