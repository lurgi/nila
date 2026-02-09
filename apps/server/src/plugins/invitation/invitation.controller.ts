import type { FastifyRequest, FastifyReply } from "fastify";
import type { InvitationService } from "./invitation.service.js";

export const createInvitationController = (
  invitationService: InvitationService,
) => ({
  createInvitation: async (request: FastifyRequest, reply: FastifyReply) => {
    const inviterId = request.user.id;
    const invitation = await invitationService.createInvitation(inviterId);
    return reply.code(201).send(invitation);
  },

  consumeInvitation: async (
    request: FastifyRequest<{ Params: { code: string } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const { code } = request.params;
    const result = await invitationService.consumeInvitation(userId, code);
    return reply.send(result);
  },
});
