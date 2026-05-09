import { createServer } from "node:http";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  NpcState,
  PlayerState,
  ServerToClientEvents,
  WorldPosition
} from "@10924/shared";

const port = Number(process.env.PORT ?? 3000);
const players = new Map<string, PlayerState>();
const npcs: NpcState[] = [
  {
    id: "naem",
    displayName: "Naem",
    x: 0,
    y: 0
  }
];

let nextExplorerNumber = 1;

const httpServer = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true, service: "10924-server" }));
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "not_found" }));
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
  }
});

io.on("connection", (socket) => {
  const player = createPlayer(socket.id);
  players.set(socket.id, player);

  console.info(`Client connected: ${socket.id} as ${player.displayName}`);

  socket.emit("world:snapshot", {
    localPlayer: player,
    players: [...players.values()],
    npcs
  });

  socket.broadcast.emit("player:joined", { player });

  socket.on("player:move", (position) => {
    const currentPlayer = players.get(socket.id);

    if (!currentPlayer || !isValidPosition(position)) {
      return;
    }

    const updatedPlayer = {
      ...currentPlayer,
      x: position.x,
      y: position.y
    };

    players.set(socket.id, updatedPlayer);
    socket.broadcast.emit("player:moved", { player: updatedPlayer });
  });

  socket.on("disconnect", (reason) => {
    players.delete(socket.id);
    socket.broadcast.emit("player:left", { id: socket.id });
    console.info(`Client disconnected: ${socket.id} (${reason})`);
  });
});

httpServer.listen(port, () => {
  console.info(`10924 server listening on http://localhost:${port}`);
});

function createPlayer(id: string): PlayerState {
  const explorerNumber = nextExplorerNumber;
  nextExplorerNumber += 1;

  return {
    id,
    displayName: `Explorer ${explorerNumber}`,
    x: 1 + explorerNumber * 0.35,
    y: 1
  };
}

function isValidPosition(position: WorldPosition): boolean {
  return Number.isFinite(position.x) && Number.isFinite(position.y);
}
