import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply } from "fastify";
import { createFriendRepository } from "./friend.repository.js";
import { createFriendService } from "./friend.service.js";
import { createFriendController } from "./friend.controller.js";
import { createUserRepository } from "../user/user.repository.js";
import {
  SendFriendRequestSchema,
  AcceptFriendRequestSchema,
  GetFriendsSchema,
  GetPendingRequestsSchema,
  DeleteFriendshipSchema,
} from "@/types/schemas/friend.schema.js";
import type { CreateFriendRequest } from "@/dtos/friend/request.dto.js";

export default fp(
  async (fastify) => {
    const friendRepository = createFriendRepository(fastify.prisma);
    const userRepository = createUserRepository(fastify.prisma);
    const friendService = createFriendService(friendRepository, userRepository);
    const friendController = createFriendController(friendService);

    const authenticate = {
      onRequest: [
        async (req: FastifyRequest, reply: FastifyReply) =>
          await fastify.authenticate(req, reply),
      ],
    };

    fastify.post<{ Body: CreateFriendRequest }>(
      "/friends/request",
      { schema: SendFriendRequestSchema, ...authenticate },
      friendController.sendFriendRequest,
    );

    fastify.get(
      "/friends",
      { schema: GetFriendsSchema, ...authenticate },
      friendController.getFriends,
    );

    fastify.get(
      "/friends/pending",
      { schema: GetPendingRequestsSchema, ...authenticate },
      friendController.getPendingRequests,
    );

    fastify.patch<{ Params: { id: string } }>(
      "/friends/accept/:id",
      { schema: AcceptFriendRequestSchema, ...authenticate },
      friendController.acceptFriendRequest,
    );

    fastify.delete<{ Params: { id: string } }>(
      "/friends/:id",
      { schema: DeleteFriendshipSchema, ...authenticate },
      friendController.removeFriendship,
    );
  },
  {
    name: "friendPlugin",
    dependencies: ["prismaPlugin", "authPlugin", "userPlugin"],
  },
);
