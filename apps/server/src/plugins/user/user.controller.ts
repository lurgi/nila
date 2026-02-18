import type { FastifyRequest, FastifyReply } from "fastify";
import createError from "http-errors";
import type { Static } from "@sinclair/typebox";
import type { UserService } from "./user.service.js";
import type {
  UpdateProfileRequest,
  UpdateUserRequest,
  UserResponseSchema,
} from "@nila/types/schemas/user.schema";
import type { User } from "@/generated/prisma/client.js";

type UserResponse = Static<typeof UserResponseSchema>;

const toUserResponse = (user: User): UserResponse => {
  const { providerId, ...rest } = user;
  return {
    ...rest,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
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

  updateProfile: async (
    request: FastifyRequest<{ Body: UpdateProfileRequest }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const user = await userService.updateProfile(userId, request.body);

    return reply.send(toUserResponse(user));
  },
});
