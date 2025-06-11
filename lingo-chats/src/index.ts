import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { chatRoutes } from "./routes";
import { prisma } from "./prisma";

const fastify = Fastify();
const httpServer = createServer(fastify.server);

// WebSocket
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  // Утилита для получения первого элемента из массива или строки
  function getFirstString(
    value: string | string[] | undefined
  ): string | undefined {
    if (Array.isArray(value)) return value[0];
    return value;
  }

  const { eventId, userId } = socket.handshake.query;
  const eventIdStr = getFirstString(eventId);
  const userIdStr = getFirstString(userId);

  if (!eventIdStr || !userIdStr) {
    socket.disconnect();
    return;
  }

  const eventIdNum = parseInt(eventIdStr, 10);
  const userIdNum = parseInt(userIdStr, 10);

  if (isNaN(eventIdNum) || isNaN(userIdNum)) {
    socket.disconnect();
    return;
  }

  console.log(`User ${userIdNum} connected to event ${eventIdNum}`);

  socket.join(`event-${eventIdNum}`);

  socket.on("message", async (msg: string) => {
    try {
      const chatMessage = await prisma.chatMessage.create({
        data: {
          eventId: eventIdNum,
          senderId: userIdNum,
          message: msg,
        },
      });

      io.to(`event-${eventIdNum}`).emit("message", chatMessage);
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${userIdNum} disconnected`);
  });
});

// REST API (проверка)
fastify.get("/", async () => ({ status: "ok" }));

const start = async () => {
  await fastify.register(fastifyCors);
  await fastify.register(chatRoutes);

  await fastify.listen({ port: 5000, host: "0.0.0.0" });
  console.log("Server running at http://localhost:5000");

  httpServer.listen(5001, () => {
    console.log("Socket.IO running at http://localhost:5001");
  });
};

start();
