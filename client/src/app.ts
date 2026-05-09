import { Application } from "pixi.js";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@10924/shared";
import { moveToward } from "./game/movement";
import { ClientWorldState } from "./game/worldState";
import { screenToGrid } from "./render/isoMath";
import { WorldRenderer } from "./render/worldRenderer";

const movementSpeedTilesPerSecond = 3;
const positionUpdateIntervalSeconds = 0.1;

type MovementTickResult = {
  moved: boolean;
  arrived: boolean;
};

export async function startApp(root: HTMLElement): Promise<void> {
  const app = new Application();

  await app.init({
    background: "#111820",
    resizeTo: root,
    antialias: true
  });

  root.appendChild(app.canvas);

  const state = new ClientWorldState();
  const world = new WorldRenderer(app);
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000", {
    transports: ["websocket", "polling"]
  });

  let sendAccumulator = 0;

  socket.on("connect", () => {
    console.info("Connected to 10924 server", socket.id);
  });

  socket.on("world:snapshot", (snapshot) => {
    state.applySnapshot(snapshot);
  });

  socket.on("player:joined", ({ player }) => {
    state.upsertPlayer(player);
  });

  socket.on("player:moved", ({ player }) => {
    state.upsertPlayer(player);
  });

  socket.on("player:left", ({ id }) => {
    state.removePlayer(id);
  });

  app.canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const bounds = app.canvas.getBoundingClientRect();
    const screenPoint = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    };
    const worldPoint = world.screenToWorld(screenPoint);

    state.setMovementTarget(screenToGrid(worldPoint));
  });

  app.ticker.add((ticker) => {
    const deltaSeconds = ticker.deltaMS / 1000;
    const movement = updateLocalMovement(state, deltaSeconds);

    if (movement.moved) {
      sendAccumulator += deltaSeconds;
    }

    if (
      movement.moved &&
      state.localPlayer &&
      (movement.arrived || sendAccumulator >= positionUpdateIntervalSeconds)
    ) {
      socket.emit("player:move", {
        x: state.localPlayer.x,
        y: state.localPlayer.y
      });
      sendAccumulator = 0;
    }

    world.draw({
      localPlayer: state.localPlayer,
      remotePlayers: state.getRemotePlayers(),
      npcs: state.getNpcs()
    });
  });
}

function updateLocalMovement(state: ClientWorldState, deltaSeconds: number): MovementTickResult {
  if (!state.localPlayer || !state.movementTarget) {
    return { moved: false, arrived: false };
  }

  const result = moveToward(
    state.localPlayer,
    state.movementTarget,
    movementSpeedTilesPerSecond,
    deltaSeconds
  );

  state.updateLocalPosition(result.position);

  if (result.arrived) {
    state.movementTarget = null;
  }

  return { moved: true, arrived: result.arrived };
}
