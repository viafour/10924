import type { NpcState, PlayerState, WorldPosition } from "@10924/shared";

export const interactionRadius = 1.5;
export const npcClickRadius = 0.75;

export function isPlayerNearNpc(player: PlayerState, npc: NpcState): boolean {
  return getDistance(player, npc) <= interactionRadius;
}

export function findClickedNpc(npcs: NpcState[], point: WorldPosition): NpcState | null {
  return npcs.find((npc) => getDistance(npc, point) <= npcClickRadius) ?? null;
}

export function findInteractableNpc(player: PlayerState, npcs: NpcState[], npcId: string): NpcState | null {
  const npc = npcs.find((candidate) => candidate.id === npcId);

  if (!npc || !isPlayerNearNpc(player, npc)) {
    return null;
  }

  return npc;
}

function getDistance(a: WorldPosition, b: WorldPosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
