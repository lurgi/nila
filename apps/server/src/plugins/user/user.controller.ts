import type { FastifyRequest, FastifyReply } from "fastify";
import createError from "http-errors";
import type { UserService } from "./user.service.js";
import type { UpdateUserRequest } from "@/dtos/user/request.dto.js";
import type { UserResponse } from "@/dtos/user/response.dto.js";
import type { User } from "@/generated/prisma/client.js";

const toUserResponse = (user: User): UserResponse => {
  const { providerId, ...rest } = user;
  return rest;
};

export const createUserController = (userService: UserService) => ({
  getMe: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    return reply.send(toUserResponse(user));
  },

  updateMe: async (
    request: FastifyRequest<{ Body: UpdateUserRequest }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const user = await userService.updateUser(userId, request.body);

    return reply.send(toUserResponse(user));
  },
});
