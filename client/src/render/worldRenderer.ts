import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import type { NpcState, PlayerState } from "@10924/shared";
import { gridToScreen, type ScreenPoint } from "./isoMath";

export type WorldRenderState = {
  localPlayer: PlayerState | null;
  remotePlayers: PlayerState[];
  npcs: NpcState[];
};

export class WorldRenderer {
  private readonly stage = new Container();

  constructor(private readonly app: Application) {
    this.app.stage.addChild(this.stage);
  }

  draw(state: WorldRenderState): void {
    this.stage.removeChildren();
    this.followLocalPlayer(state.localPlayer);

    this.drawGround();

    for (const npc of state.npcs) {
      this.drawNpc(npc);
    }

    for (const player of state.remotePlayers) {
      this.drawPlayer(player, 0x8fa6c9, 0x657b9f);
    }

    if (state.localPlayer) {
      this.drawPlayer(state.localPlayer, 0xd8d1b3, 0x8fb0a9);
    }
  }

  screenToWorld(point: ScreenPoint): ScreenPoint {
    return {
      x: point.x - this.stage.x,
      y: point.y - this.stage.y
    };
  }

  private followLocalPlayer(player: PlayerState | null): void {
    if (!player) {
      this.stage.x = this.app.screen.width / 2;
      this.stage.y = this.app.screen.height / 2;
      return;
    }

    const playerScreen = gridToScreen(player);
    this.stage.x = this.app.screen.width / 2 - playerScreen.x;
    this.stage.y = this.app.screen.height / 2 - playerScreen.y;
  }

  private drawGround(): void {
    const ground = new Graphics();
    const radius = 20;

    for (let y = -radius; y <= radius; y += 1) {
      for (let x = -radius; x <= radius; x += 1) {
        this.drawTile(ground, x, y);
      }
    }

    this.stage.addChild(ground);
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

  private drawPlayer(player: PlayerState, headColor: number, bodyColor: number): void {
    const position = gridToScreen(player);
    const marker = new Graphics();

    marker
      .circle(position.x, position.y - 20, 12)
      .fill({ color: headColor })
      .stroke({ color: 0x111820, width: 3 });

    marker
      .moveTo(position.x, position.y - 8)
      .lineTo(position.x + 14, position.y + 16)
      .lineTo(position.x - 14, position.y + 16)
      .closePath()
      .fill({ color: bodyColor, alpha: 0.95 });

    this.stage.addChild(marker, this.createLabel(player.displayName, position));
  }

  private drawNpc(npc: NpcState): void {
    const position = gridToScreen(npc);
    const marker = new Graphics();

    marker
      .circle(position.x, position.y - 22, 11)
      .fill({ color: 0xd9d2c0 })
      .stroke({ color: 0x111820, width: 3 });

    marker
      .moveTo(position.x - 18, position.y - 2)
      .lineTo(position.x, position.y + 18)
      .lineTo(position.x + 18, position.y - 2)
      .stroke({ color: 0xb9c7bd, alpha: 0.85, width: 4 });

    this.stage.addChild(marker, this.createLabel(npc.displayName, position));
  }

  private createLabel(displayName: string, position: ScreenPoint): Text {
    const label = new Text({
      text: displayName,
      style: new TextStyle({
        fill: "#d9e0d8",
        fontFamily: "Georgia, serif",
        fontSize: 14
      })
    });

    label.anchor.set(0.5);
    label.position.set(position.x, position.y + 34);

    return label;
  }
}
