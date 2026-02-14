import createError from "http-errors";
import { FriendshipStatus } from "@/generated/prisma/client.js";

type Letter = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  deliverAt: Date;
  createdAt: Date;
  readAt?: Date | null;
};

type SentLetterMeta = Omit<Letter, "content">;

export type LetterRepository = {
  create: (data: {
    senderId: string;
    recipientId: string;
    content: string;
    deliverAt: Date;
  }) => Promise<Letter>;
  findInbox: (recipientId: string, now: Date) => Promise<Letter[]>;
  findSent: (senderId: string) => Promise<Letter[]>;
  findById: (id: string) => Promise<Letter | null>;
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
    senderId: string,
    input: { recipientId: string; content: string; deliverAt: Date },
  ) => {
    const friendship = await friendRepository.findExistingFriendship(
      senderId,
      input.recipientId,
    );

    if (!friendship || friendship.status !== FriendshipStatus.ACCEPTED) {
      throw createError(403, "You can only send letters to accepted friends");
    }

    if (input.deliverAt.getTime() <= Date.now()) {
      throw createError(400, "deliverAt must be in the future");
    }

    return letterRepository.create({
      senderId,
      recipientId: input.recipientId,
      content: input.content,
      deliverAt: input.deliverAt,
    });
  },

  getInbox: async (userId: string, now: Date) => {
    return letterRepository.findInbox(userId, now);
  },

  getSent: async (userId: string): Promise<SentLetterMeta[]> => {
    const letters = await letterRepository.findSent(userId);

    return letters.map(({ content, ...rest }) => rest);
  },

  getLetterDetail: async (userId: string, letterId: string, now: Date) => {
    const letter = await letterRepository.findById(letterId);

    if (!letter) {
      throw createError(404, "Letter not found");
    }

    if (letter.recipientId !== userId) {
      throw createError(403, "Only recipient can access letter content");
    }

    if (letter.deliverAt.getTime() > now.getTime()) {
      throw createError(403, "Letter is not delivered yet");
    }

    return letter;
  },
});

export type LetterService = ReturnType<typeof createLetterService>;
