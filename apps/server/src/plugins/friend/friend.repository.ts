import type {
  PrismaClient,
  Prisma,
  Friendship,
  FriendshipStatus,
} from "@/generated/prisma/client.js";

export type FriendshipWithUsers = Prisma.FriendshipGetPayload<{
  include: { requester: true; addressee: true };
}>;

export const createFriendRepository = (prisma: PrismaClient) => ({
  createFriendship: (
    data: Prisma.FriendshipUncheckedCreateInput,
  ): Promise<Friendship> => {
    return prisma.friendship.create({ data });
  },

  findFriendshipById: (id: string): Promise<Friendship | null> => {
    return prisma.friendship.findUnique({ where: { id } });
  },

  findExistingFriendship: (
    userId1: string,
    userId2: string,
  ): Promise<Friendship | null> => {
    return prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId1, addresseeId: userId2 },
          { requesterId: userId2, addresseeId: userId1 },
        ],
      },
    });
  },

  findManyFriendships: (
    userId: string,
    status?: FriendshipStatus,
  ): Promise<FriendshipWithUsers[]> => {
    return prisma.friendship.findMany({
      where: {
        status,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: true,
        addressee: true,
      },
    });
  },

  updateFriendshipStatus: (
    id: string,
    status: FriendshipStatus,
  ): Promise<Friendship> => {
    return prisma.friendship.update({
      where: { id },
      data: { status },
    });
  },

  deleteFriendship: (id: string): Promise<Friendship> => {
    return prisma.friendship.delete({ where: { id } });
  },
});

export type FriendRepository = ReturnType<typeof createFriendRepository>;
