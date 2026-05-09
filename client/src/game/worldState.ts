import type { NpcState, PlayerState, WorldPosition, WorldSnapshot } from "@10924/shared";

export class ClientWorldState {
  localPlayer: PlayerState | null = null;
  movementTarget: WorldPosition | null = null;

  private readonly players = new Map<string, PlayerState>();
  private readonly npcs = new Map<string, NpcState>();

  applySnapshot(snapshot: WorldSnapshot): void {
    this.localPlayer = snapshot.localPlayer;
    this.players.clear();
    this.npcs.clear();

    for (const player of snapshot.players) {
      this.players.set(player.id, player);
    }

    for (const npc of snapshot.npcs) {
      this.npcs.set(npc.id, npc);
    }
  }

  setMovementTarget(target: WorldPosition): void {
    this.movementTarget = target;
  }

  updateLocalPosition(position: WorldPosition): void {
    if (!this.localPlayer) {
      return;
    }

    this.localPlayer = {
      ...this.localPlayer,
      x: position.x,
      y: position.y
    };

    this.players.set(this.localPlayer.id, this.localPlayer);
  }

  upsertPlayer(player: PlayerState): void {
    this.players.set(player.id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  getRemotePlayers(): PlayerState[] {
    if (!this.localPlayer) {
      return [...this.players.values()];
    }

    return [...this.players.values()].filter((player) => player.id !== this.localPlayer?.id);
  }

  getNpcs(): NpcState[] {
    return [...this.npcs.values()];
  }
}
