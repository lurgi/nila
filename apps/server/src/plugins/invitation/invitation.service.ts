import createError from "http-errors";
import crypto from "node:crypto";
import { FriendshipStatus } from "@/generated/prisma/client.js";
import type { InvitationRepository } from "./invitation.repository.js";
import type { FriendRepository } from "../friend/friend.repository.js";

const isUniqueConstraintError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const code = "code" in error ? error.code : undefined;
  return code === "P2002";
};

const createInvitationCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

export const createInvitationService = (
  invitationRepository: InvitationRepository,
  friendRepository: FriendRepository,
) => ({
  createInvitation: async (inviterId: string) => {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const code = createInvitationCode();

      try {
        return await invitationRepository.createInvitation({
          inviterId,
          code,
          expiresAt,
        });
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          continue;
        }
        throw error;
      }
    }

    throw createError(503, "Unable to issue invitation code. Please try again.");
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

    const consumedInvitation = await invitationRepository.consumeInvitationIfAvailable(
      invitation.id,
      userId,
      new Date(),
    );

    if (!consumedInvitation) {
      throw createError(410, "Invitation already used");
    }

    return consumedInvitation;
  },
});

export type InvitationService = ReturnType<typeof createInvitationService>;
