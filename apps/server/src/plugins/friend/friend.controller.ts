import type { FastifyRequest, FastifyReply } from "fastify";
import type { FriendService } from "./friend.service.js";
import type { CreateFriendRequest } from "@nila/types/schemas/friend.schema";

export const createFriendController = (friendService: FriendService) => ({
  sendFriendRequest: async (
    request: FastifyRequest<{ Body: CreateFriendRequest }>,
    reply: FastifyReply,
  ) => {
    const requesterId = request.user.id;
    const { userId: addresseeId } = request.body;
    const friendship = await friendService.sendFriendRequest(
      requesterId,
      addresseeId,
    );
    return reply.code(201).send(friendship);
  },

  acceptFriendRequest: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const { id: friendshipId } = request.params;
    const friendship = await friendService.acceptFriendRequest(
      userId,
      friendshipId,
    );
    return reply.send(friendship);
  },

  getFriends: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const friends = await friendService.getFriends(userId);
    return reply.send(friends);
  },

  getPendingRequests: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const pendingRequests = await friendService.getPendingRequests(userId);
    return reply.send(pendingRequests);
  },

  removeFriendship: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const { id: friendshipId } = request.params;
    await friendService.removeFriendship(userId, friendshipId);
    return reply.code(204).send();
  },
});
