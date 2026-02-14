import type { PrismaClient } from "@/generated/prisma/client.js";

export const createLetterRepository = (prisma: PrismaClient) => ({
  create: (data: {
    senderId: string;
    recipientId: string;
    content: string;
    deliverAt: Date;
  }) => {
    return prisma.letter.create({
      data: {
        senderId: data.senderId,
        recipientId: data.recipientId,
        content: data.content,
        deliverAt: data.deliverAt,
      },
    });
  },

  findInbox: (recipientId: string, now: Date) => {
    return prisma.letter.findMany({
      where: {
        recipientId,
        deliverAt: {
          lte: now,
        },
      },
      orderBy: {
        deliverAt: "desc",
      },
    });
  },

  findSent: (senderId: string) => {
    return prisma.letter.findMany({
      where: {
        senderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: (id: string) => {
    return prisma.letter.findUnique({
      where: {
        id,
      },
    });
  },
});

export type LetterRepository = ReturnType<typeof createLetterRepository>;
