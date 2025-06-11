import { FastifyInstance } from "fastify";
import { prisma } from "./prisma";

export async function chatRoutes(app: FastifyInstance) {
  app.get("/events/:eventId/messages", async (request, reply) => {
    const { eventId } = request.params as { eventId: string };

    const messages = await prisma.chatMessage.findMany({
      where: { eventId: parseInt(eventId) },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return messages;
  });
}
