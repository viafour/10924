import { createServer } from "node:http";
import { Server } from "socket.io";

const port = Number(process.env.PORT ?? 3000);

const httpServer = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true, service: "10924-server" }));
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "not_found" }));
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
  }
});

io.on("connection", (socket) => {
  console.info(`Client connected: ${socket.id}`);
  socket.emit("welcome", "Welcome to 10924.");

  socket.on("disconnect", (reason) => {
    console.info(`Client disconnected: ${socket.id} (${reason})`);
  });
});

httpServer.listen(port, () => {
  console.info(`10924 server listening on http://localhost:${port}`);
});
