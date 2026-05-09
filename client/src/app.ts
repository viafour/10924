import { Application } from "pixi.js";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, NpcState, ServerToClientEvents, WorldPosition } from "@10924/shared";
import { getDialogueScript } from "./dialogue/dialogueData";
import { DialogueState } from "./dialogue/dialogueState";
import { findClickedNpc, findInteractableNpc, isPlayerNearNpc } from "./game/interactions";
import { moveToward } from "./game/movement";
import { ClientWorldState } from "./game/worldState";
import { screenToGrid, type ScreenPoint } from "./render/isoMath";
import { DialogueBox } from "./ui/dialogueBox";
import { WorldRenderer } from "./render/worldRenderer";

const movementSpeedTilesPerSecond = 3;
const positionUpdateIntervalSeconds = 0.1;
const targetUpdateIntervalSeconds = 0.05;
const naemNpcId = "naem";

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
  const dialogueState = new DialogueState();
  const dialogueBox = new DialogueBox(root);
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000", {
    transports: ["websocket", "polling"]
  });

  let sendAccumulator = 0;
  let targetUpdateAccumulator = 0;
  let isLeftMouseHeld = false;
  let latestPointerPosition: ScreenPoint | null = null;

  dialogueBox.setAdvanceHandler(() => {
    advanceDialogue(dialogueState, dialogueBox);
  });

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

    latestPointerPosition = getCanvasPointerPosition(app.canvas, event);
    const target = getWorldPositionFromPointer(world, latestPointerPosition);

    if (tryOpenClickedNpcDialogue(state, dialogueState, dialogueBox, target)) {
      isLeftMouseHeld = false;
      latestPointerPosition = null;
      return;
    }

    isLeftMouseHeld = true;
    targetUpdateAccumulator = 0;
    app.canvas.setPointerCapture(event.pointerId);
    state.setMovementTarget(target);
  });

  app.canvas.addEventListener("pointermove", (event) => {
    if (!isLeftMouseHeld) {
      return;
    }

    latestPointerPosition = getCanvasPointerPosition(app.canvas, event);
  });

  app.canvas.addEventListener("pointerup", (event) => {
    if (event.button !== 0) {
      return;
    }

    isLeftMouseHeld = false;
    app.canvas.releasePointerCapture(event.pointerId);
  });

  app.canvas.addEventListener("pointercancel", (event) => {
    isLeftMouseHeld = false;
    app.canvas.releasePointerCapture(event.pointerId);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dialogueState.close();
      dialogueBox.hide();
      return;
    }

    if (event.key === "Enter" && dialogueState.isOpen()) {
      advanceDialogue(dialogueState, dialogueBox);
      return;
    }

    if (event.key.toLowerCase() === "e" && !dialogueState.isOpen()) {
      tryOpenNearbyNpcDialogue(state, dialogueState, dialogueBox, naemNpcId);
    }
  });

  app.ticker.add((ticker) => {
    const deltaSeconds = ticker.deltaMS / 1000;

    if (isLeftMouseHeld && latestPointerPosition) {
      targetUpdateAccumulator += deltaSeconds;

      if (targetUpdateAccumulator >= targetUpdateIntervalSeconds) {
        updateMovementTargetFromPointer(state, world, latestPointerPosition);
        targetUpdateAccumulator = 0;
      }
    }

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

    world.update({
      localPlayer: state.localPlayer,
      remotePlayers: state.getRemotePlayers(),
      npcs: state.getNpcs()
    });
  });
}

function getCanvasPointerPosition(canvas: HTMLCanvasElement, event: PointerEvent): ScreenPoint {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  };
}

function getWorldPositionFromPointer(world: WorldRenderer, pointerPosition: ScreenPoint): WorldPosition {
  return screenToGrid(world.screenToWorld(pointerPosition));
}

function updateMovementTargetFromPointer(
  state: ClientWorldState,
  world: WorldRenderer,
  pointerPosition: ScreenPoint
): void {
  state.setMovementTarget(getWorldPositionFromPointer(world, pointerPosition));
}

function tryOpenClickedNpcDialogue(
  state: ClientWorldState,
  dialogueState: DialogueState,
  dialogueBox: DialogueBox,
  target: WorldPosition
): boolean {
  const npc = findClickedNpc(state.getNpcs(), target);

  if (!npc || !state.localPlayer || !isPlayerNearNpc(state.localPlayer, npc)) {
    return false;
  }

  return openNpcDialogue(dialogueState, dialogueBox, npc);
}

function tryOpenNearbyNpcDialogue(
  state: ClientWorldState,
  dialogueState: DialogueState,
  dialogueBox: DialogueBox,
  npcId: string
): boolean {
  if (!state.localPlayer) {
    return false;
  }

  const npc = findInteractableNpc(state.localPlayer, state.getNpcs(), npcId);

  if (!npc) {
    return false;
  }

  return openNpcDialogue(dialogueState, dialogueBox, npc);
}

function openNpcDialogue(
  dialogueState: DialogueState,
  dialogueBox: DialogueBox,
  npc: NpcState
): boolean {
  const script = getDialogueScript(npc.id);

  if (!script) {
    return false;
  }

  dialogueBox.show(dialogueState.open(script));
  return true;
}

function advanceDialogue(dialogueState: DialogueState, dialogueBox: DialogueBox): void {
  const nextDialogue = dialogueState.advance();

  if (!nextDialogue) {
    dialogueBox.hide();
    return;
  }

  dialogueBox.show(nextDialogue);
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
