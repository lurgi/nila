import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { env } from "@/config/env.js";
import { createAuthRepository } from "./auth.repository.js";
import { createAuthService } from "./auth.service.js";
import { createAuthController } from "./auth.controller.js";
import {
  LoginSchema,
  RefreshSchema,
  LogoutSchema,
} from "@/types/schemas/auth.schema.js";

import type { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

export default fp(
  async (fastify) => {
    fastify.register(jwt, {
      secret: env.JWT_SECRET,
    });

    fastify.decorate(
      "authenticate",
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const payload = await request.jwtVerify<{ sub: string }>();
          const userId = payload.sub;
          const user = await fastify.userService.getUserById(userId);

          if (!user) {
            return reply.status(401).send({ message: "User not found" });
          }

          request.user = user;
        } catch (err) {
          reply.send(err);
        }
      },
    );

    const authRepository = createAuthRepository(fastify.prisma);
    const authService = createAuthService(
      authRepository,
      fastify.userService,
      fastify.jwt,
    );
    const authController = createAuthController(authService);

    fastify.post("/auth/login", { schema: LoginSchema }, authController.login);
    fastify.post(
      "/auth/refresh",
      { schema: RefreshSchema },
      authController.refresh,
    );
    fastify.post(
      "/auth/logout",
      { schema: LogoutSchema },
      authController.logout,
    );
  },
  {
    name: "authPlugin",
    dependencies: ["prismaPlugin", "userPlugin"],
  },
);
