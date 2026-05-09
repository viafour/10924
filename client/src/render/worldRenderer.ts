import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import type { NpcState, PlayerState } from "@10924/shared";
import { gridToScreen, type ScreenPoint } from "./isoMath";

export type WorldRenderState = {
  localPlayer: PlayerState | null;
  remotePlayers: PlayerState[];
  npcs: NpcState[];
};

type MarkerView = {
  container: Container;
  label: Text;
  displayName: string;
};

const gridRadius = 20;
const diagnosticsIntervalMs = 5000;

export class WorldRenderer {
  private readonly world = new Container();
  private readonly groundLayer = new Container();
  private readonly npcLayer = new Container();
  private readonly playerLayer = new Container();
  private readonly playerMarkers = new Map<string, MarkerView>();
  private readonly npcMarkers = new Map<string, MarkerView>();
  private lastDiagnosticsAt = 0;

  constructor(private readonly app: Application) {
    this.world.addChild(this.groundLayer, this.npcLayer, this.playerLayer);
    this.app.stage.addChild(this.world);
    this.initializeGround();
  }

  update(state: WorldRenderState): void {
    this.updateCamera(state.localPlayer);
    this.syncNpcs(state.npcs);
    this.syncPlayers([
      ...state.remotePlayers,
      ...(state.localPlayer ? [state.localPlayer] : [])
    ]);
    this.logDiagnostics();
  }

  screenToWorld(point: ScreenPoint): ScreenPoint {
    return {
      x: point.x - this.world.x,
      y: point.y - this.world.y
    };
  }

  private updateCamera(player: PlayerState | null): void {
    if (!player) {
      this.world.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
      return;
    }

    const playerScreen = gridToScreen(player);
    this.world.position.set(
      this.app.screen.width / 2 - playerScreen.x,
      this.app.screen.height / 2 - playerScreen.y
    );
  }

  private initializeGround(): void {
    const ground = new Graphics();

    for (let y = -gridRadius; y <= gridRadius; y += 1) {
      for (let x = -gridRadius; x <= gridRadius; x += 1) {
        this.drawTile(ground, x, y);
      }
    }

    this.groundLayer.addChild(ground);
  }

  private drawTile(graphics: Graphics, gridX: number, gridY: number): void {
    const center = gridToScreen({ x: gridX, y: gridY });
    const halfWidth = 48;
    const halfHeight = 24;
    const alternatingFill = (gridX + gridY) % 2 === 0 ? 0x1d2b32 : 0x22333a;

    graphics
      .moveTo(center.x, center.y - halfHeight)
      .lineTo(center.x + halfWidth, center.y)
      .lineTo(center.x, center.y + halfHeight)
      .lineTo(center.x - halfWidth, center.y)
      .closePath()
      .fill({ color: alternatingFill, alpha: 0.92 })
      .stroke({ color: 0x5f7c82, alpha: 0.28, width: 1 });
  }

  private syncPlayers(players: PlayerState[]): void {
    const activeIds = new Set<string>();

    for (const player of players) {
      activeIds.add(player.id);

      const marker = this.getOrCreatePlayerMarker(player);
      const position = gridToScreen(player);

      marker.container.position.set(position.x, position.y);
    }

    this.removeMissingMarkers(this.playerMarkers, activeIds);
  }

  private syncNpcs(npcs: NpcState[]): void {
    const activeIds = new Set<string>();

    for (const npc of npcs) {
      activeIds.add(npc.id);

      const marker = this.getOrCreateNpcMarker(npc);
      const position = gridToScreen(npc);

      marker.container.position.set(position.x, position.y);
    }

    this.removeMissingMarkers(this.npcMarkers, activeIds);
  }

  private getOrCreatePlayerMarker(player: PlayerState): MarkerView {
    const existing = this.playerMarkers.get(player.id);

    if (existing) {
      this.updateLabel(existing, player.displayName);
      return existing;
    }

    const isLocalPlayer = player.displayName === "Explorer 1" || this.playerMarkers.size === 0;
    const marker = this.createPlayerMarker(
      player.displayName,
      isLocalPlayer ? 0xd8d1b3 : 0x8fa6c9,
      isLocalPlayer ? 0x8fb0a9 : 0x657b9f
    );

    this.playerMarkers.set(player.id, marker);
    this.playerLayer.addChild(marker.container);

    return marker;
  }

  private getOrCreateNpcMarker(npc: NpcState): MarkerView {
    const existing = this.npcMarkers.get(npc.id);

    if (existing) {
      this.updateLabel(existing, npc.displayName);
      return existing;
    }

    const marker = this.createNpcMarker(npc.displayName);

    this.npcMarkers.set(npc.id, marker);
    this.npcLayer.addChild(marker.container);

    return marker;
  }

  private createPlayerMarker(displayName: string, headColor: number, bodyColor: number): MarkerView {
    const container = new Container();
    const marker = new Graphics();

    marker
      .circle(0, -20, 12)
      .fill({ color: headColor })
      .stroke({ color: 0x111820, width: 3 });

    marker
      .moveTo(0, -8)
      .lineTo(14, 16)
      .lineTo(-14, 16)
      .closePath()
      .fill({ color: bodyColor, alpha: 0.95 });

    const label = this.createLabel(displayName);

    container.addChild(marker, label);

    return { container, label, displayName };
  }

  private createNpcMarker(displayName: string): MarkerView {
    const container = new Container();
    const marker = new Graphics();

    marker
      .circle(0, -22, 11)
      .fill({ color: 0xd9d2c0 })
      .stroke({ color: 0x111820, width: 3 });

    marker
      .moveTo(-18, -2)
      .lineTo(0, 18)
      .lineTo(18, -2)
      .stroke({ color: 0xb9c7bd, alpha: 0.85, width: 4 });

    const label = this.createLabel(displayName);

    container.addChild(marker, label);

    return { container, label, displayName };
  }

  private createLabel(displayName: string): Text {
    const label = new Text({
      text: displayName,
      style: new TextStyle({
        fill: "#d9e0d8",
        fontFamily: "Georgia, serif",
        fontSize: 14
      })
    });

    label.anchor.set(0.5);
    label.position.set(0, 34);

    return label;
  }

  private updateLabel(marker: MarkerView, displayName: string): void {
    if (marker.displayName === displayName) {
      return;
    }

    marker.displayName = displayName;
    marker.label.text = displayName;
  }

  private removeMissingMarkers(markers: Map<string, MarkerView>, activeIds: Set<string>): void {
    for (const [id, marker] of markers) {
      if (activeIds.has(id)) {
        continue;
      }

      markers.delete(id);
      marker.container.destroy({ children: true });
    }
  }

  private logDiagnostics(): void {
    if (window.location.hostname !== "localhost") {
      return;
    }

    const now = performance.now();

    if (now - this.lastDiagnosticsAt < diagnosticsIntervalMs) {
      return;
    }

    this.lastDiagnosticsAt = now;
    console.debug("WorldRenderer diagnostics", {
      worldChildren: this.world.children.length,
      groundChildren: this.groundLayer.children.length,
      playerMarkers: this.playerMarkers.size,
      npcMarkers: this.npcMarkers.size
    });
  }
}
