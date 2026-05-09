import { Application } from "pixi.js";
import { io } from "socket.io-client";
import type { PlayerState } from "@10924/shared";
import { WorldRenderer } from "./render/worldRenderer";

const localPlayer: PlayerState = {
  id: "local-player",
  x: 0,
  y: 0,
  displayName: "Naem"
};

export async function startApp(root: HTMLElement): Promise<void> {
  const app = new Application();

  await app.init({
    background: "#111820",
    resizeTo: root,
    antialias: true
  });

  root.appendChild(app.canvas);

  const world = new WorldRenderer(app);
  world.draw(localPlayer);

  const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"]
  });

  socket.on("connect", () => {
    console.info("Connected to 10924 server", socket.id);
  });

  socket.on("welcome", (message: string) => {
    console.info(message);
  });
}
