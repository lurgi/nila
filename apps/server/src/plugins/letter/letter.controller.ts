import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateLetterRequest } from "@/dtos/letter/request.dto.js";
import type { LetterService } from "./letter.service.js";

const toIsoDateString = (value: Date | null) => {
  if (!value) {
    return null;
  }
  return value.toISOString();
};

export const createLetterController = (letterService: LetterService) => ({
  createLetter: async (
    request: FastifyRequest<{ Body: CreateLetterRequest }>,
    reply: FastifyReply,
  ) => {
    const senderId = request.user.id;
    const letter = await letterService.sendLetter(senderId, {
      recipientId: request.body.recipientId,
      content: request.body.content,
      deliverAt: new Date(request.body.deliverAt),
    });

    return reply.code(201).send({
      id: letter.id,
      senderId: letter.senderId,
      recipientId: letter.recipientId,
      deliverAt: letter.deliverAt.toISOString(),
      readAt: toIsoDateString(letter.readAt),
      createdAt: letter.createdAt.toISOString(),
    });
  },

  getInbox: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const letters = await letterService.getInbox(userId, new Date());

    return reply.send(
      letters.map((letter) => ({
        id: letter.id,
        senderId: letter.senderId,
        recipientId: letter.recipientId,
        content: letter.content,
        deliverAt: letter.deliverAt.toISOString(),
        readAt: toIsoDateString(letter.readAt),
        createdAt: letter.createdAt.toISOString(),
      })),
    );
  },

  getSent: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const letters = await letterService.getSent(userId);

    return reply.send(
      letters.map((letter) => ({
        id: letter.id,
        senderId: letter.senderId,
        recipientId: letter.recipientId,
        deliverAt: letter.deliverAt.toISOString(),
        readAt: toIsoDateString(letter.readAt),
        createdAt: letter.createdAt.toISOString(),
      })),
    );
  },

  getLetterDetail: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const letter = await letterService.getLetterDetail(
      userId,
      request.params.id,
      new Date(),
    );

    return reply.send({
      id: letter.id,
      senderId: letter.senderId,
      recipientId: letter.recipientId,
      content: letter.content,
      deliverAt: letter.deliverAt.toISOString(),
      readAt: toIsoDateString(letter.readAt),
      createdAt: letter.createdAt.toISOString(),
    });
  },
});
