import createError from "http-errors";
import crypto from "node:crypto";
import { FriendshipStatus } from "@/generated/prisma/client.js";
import type { InvitationRepository } from "./invitation.repository.js";
import type { FriendRepository } from "../friend/friend.repository.js";

export const createInvitationService = (
  invitationRepository: InvitationRepository,
  friendRepository: FriendRepository,
) => ({
  createInvitation: async (inviterId: string) => {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();

    return invitationRepository.createInvitation({
      inviterId,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  },

  consumeInvitation: async (userId: string, code: string) => {
    const invitation = await invitationRepository.findInvitationByCode(code);

    if (!invitation) {
      throw createError(404, "Invalid invitation code");
    }

    if (invitation.usedAt) {
      throw createError(410, "Invitation already used");
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      throw createError(410, "Invitation expired");
    }

    if (invitation.inviterId === userId) {
      throw createError(400, "You cannot use your own invitation code");
    }

    const existing = await friendRepository.findExistingFriendship(
      invitation.inviterId,
      userId,
    );
    if (existing && existing.status === FriendshipStatus.ACCEPTED) {
      throw createError(409, "You are already friends");
    }

    if (existing) {
      await friendRepository.updateFriendshipStatus(
        existing.id,
        FriendshipStatus.ACCEPTED,
      );
    } else {
      await friendRepository.createFriendship({
        requesterId: invitation.inviterId,
        addresseeId: userId,
        status: FriendshipStatus.ACCEPTED,
      });
    }

    return invitationRepository.updateInvitationUsed(
      invitation.id,
      userId,
      new Date(),
    );
  },
});

export type InvitationService = ReturnType<typeof createInvitationService>;
