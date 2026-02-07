import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthService } from "./auth.service.js";
import type { Static } from "@sinclair/typebox";
import type {
  LoginBodySchema,
  RefreshBodySchema,
} from "@/types/schemas/auth.schema.js";

export const createAuthController = (authService: AuthService) => ({
  login: async (
    request: FastifyRequest<{ Body: Static<typeof LoginBodySchema> }>,
    reply: FastifyReply,
  ) => {
    const result = await authService.login(request.body);
    return result;
  },

  refresh: async (
    request: FastifyRequest<{ Body: Static<typeof RefreshBodySchema> }>,
    reply: FastifyReply,
  ) => {
    try {
      const result = await authService.refresh(request.body.refreshToken);
      return result;
    } catch (error) {
      return reply.status(401).send({ message: (error as Error).message });
    }
  },

  logout: async (
    request: FastifyRequest<{ Body: Static<typeof RefreshBodySchema> }>,
    reply: FastifyReply,
  ) => {
    await authService.logout(request.body.refreshToken);
    return reply.status(204).send();
  },
});
