import fp from "fastify-plugin";
import { createUserRepository } from "./user.repository.js";
import { createUserService } from "./user.service.js";
import { createUserController } from "./user.controller.js";
import { GetMeSchema, UpdateMeSchema } from "@/types/schemas/user.schema.js";
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
    fastify.get("/me", { schema: GetMeSchema }, userController.getMe);
    fastify.patch("/me", { schema: UpdateMeSchema }, userController.updateMe);
  },
  {
    name: "userPlugin",
    dependencies: ["prismaPlugin"],
  },
);
