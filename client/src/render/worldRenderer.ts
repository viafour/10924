import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import type { PlayerState } from "@10924/shared";
import { gridToScreen } from "./isoMath";

export class WorldRenderer {
  private readonly stage = new Container();

  constructor(private readonly app: Application) {
    this.app.stage.addChild(this.stage);
  }

  draw(player: PlayerState): void {
    this.stage.removeChildren();

    this.stage.x = this.app.screen.width / 2;
    this.stage.y = 120;

    this.drawGround();
    this.drawPlayer(player);
  }

  private drawGround(): void {
    const ground = new Graphics();
    const radius = 5;

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
      .stroke({ color: 0x5f7c82, alpha: 0.35, width: 1 });
  }

  private drawPlayer(player: PlayerState): void {
    const position = gridToScreen({ x: player.x, y: player.y });
    const marker = new Graphics();

    marker
      .circle(position.x, position.y - 20, 12)
      .fill({ color: 0xd8d1b3 })
      .stroke({ color: 0x111820, width: 3 });

    marker
      .moveTo(position.x, position.y - 8)
      .lineTo(position.x + 14, position.y + 16)
      .lineTo(position.x - 14, position.y + 16)
      .closePath()
      .fill({ color: 0x8fb0a9, alpha: 0.95 });

    const label = new Text({
      text: player.displayName,
      style: new TextStyle({
        fill: "#d9e0d8",
        fontFamily: "Georgia, serif",
        fontSize: 14
      })
    });

    label.anchor.set(0.5);
    label.position.set(position.x, position.y + 34);

    this.stage.addChild(marker, label);
  }
}
