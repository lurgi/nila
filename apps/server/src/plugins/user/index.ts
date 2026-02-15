import fp from "fastify-plugin";
import { createUserRepository } from "./user.repository.js";
import { createUserService } from "./user.service.js";
import { createUserController } from "./user.controller.js";
import {
  GetMeSchema,
  UpdateMeSchema,
  UpdateProfileSchema,
  type UpdateProfileRequest,
  type UpdateUserRequest,
} from "@/types/schemas/user.schema.js";
import type { UserService } from "./user.service.js";
import type { User } from "@/generated/prisma/client.js";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
  interface FastifyInstance {
    userService: UserService;
  }
}

export default fp(
  async (fastify) => {
    const userRepository = createUserRepository(fastify.prisma);
    const userService = createUserService(userRepository);
    const userController = createUserController(userService);

    fastify.decorate("userService", userService);
    fastify.get(
      "/me",
      {
        schema: GetMeSchema,
        onRequest: [
          async (req, reply) => await fastify.authenticate(req, reply),
        ],
      },
      userController.getMe,
    );
    fastify.patch<{ Body: UpdateUserRequest }>(
      "/me",
      {
        schema: UpdateMeSchema,
        onRequest: [
          async (req, reply) => await fastify.authenticate(req, reply),
        ],
      },
      userController.updateMe,
    );
    fastify.patch<{ Body: UpdateProfileRequest }>(
      "/me/profile",
      {
        schema: UpdateProfileSchema,
        onRequest: [
          async (req, reply) => await fastify.authenticate(req, reply),
        ],
      },
      userController.updateProfile,
    );
  },
  {
    name: "userPlugin",
    dependencies: ["prismaPlugin"],
  },
);
