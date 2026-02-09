import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply } from "fastify";
import { createInvitationRepository } from "./invitation.repository.js";
import { createInvitationService } from "./invitation.service.js";
import { createInvitationController } from "./invitation.controller.js";
import { createFriendRepository } from "../friend/friend.repository.js";
import {
  CreateInvitationSchema,
  ConsumeInvitationSchema,
} from "@/types/schemas/invitation.schema.js";

export default fp(
  async (fastify) => {
    const invitationRepository = createInvitationRepository(fastify.prisma);
    const friendRepository = createFriendRepository(fastify.prisma);
    const invitationService = createInvitationService(
      invitationRepository,
      friendRepository,
    );
    const invitationController = createInvitationController(invitationService);

    const authenticate = {
      onRequest: [
        async (req: FastifyRequest, reply: FastifyReply) =>
          await fastify.authenticate(req, reply),
      ],
    };

    fastify.post(
      "/invitations",
      { schema: CreateInvitationSchema, ...authenticate },
      invitationController.createInvitation,
    );

    fastify.post<{ Params: { code: string } }>(
      "/invitations/consume/:code",
      { schema: ConsumeInvitationSchema, ...authenticate },
      invitationController.consumeInvitation,
    );
  },
  {
    name: "invitationPlugin",
    dependencies: ["prismaPlugin", "authPlugin", "friendPlugin"],
  },
);
