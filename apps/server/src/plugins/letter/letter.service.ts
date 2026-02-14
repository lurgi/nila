import createError from "http-errors";
import type { FriendshipStatus } from "@/generated/prisma/client.js";

export type LetterRepository = {
  create: (data: {
    senderId: string;
    recipientId: string;
    content: string;
    deliverAt: Date;
  }) => Promise<unknown>;
  findInbox: (recipientId: string, now: Date) => Promise<unknown[]>;
  findSent: (senderId: string) => Promise<unknown[]>;
  findById: (id: string) => Promise<Record<string, unknown> | null>;
};

export type FriendRepository = {
  findExistingFriendship: (
    userId1: string,
    userId2: string,
  ) => Promise<{ status: FriendshipStatus } | null>;
};

export const createLetterService = (
  letterRepository: LetterRepository,
  friendRepository: FriendRepository,
) => ({
  sendLetter: async (
    _senderId: string,
    _input: { recipientId: string; content: string; deliverAt: Date },
  ) => {
    throw createError(501, "Not implemented");
  },

  getInbox: async (_userId: string, _now: Date) => {
    throw createError(501, "Not implemented");
  },

  getSent: async (_userId: string) => {
    throw createError(501, "Not implemented");
  },

  getLetterDetail: async (_userId: string, _letterId: string, _now: Date) => {
    throw createError(501, "Not implemented");
  },
});

export type LetterService = ReturnType<typeof createLetterService>;
