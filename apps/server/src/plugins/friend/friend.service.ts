import createError from "http-errors";
import { FriendshipStatus } from "@/generated/prisma/client.js";
import type { FriendRepository } from "./friend.repository.js";
import type { UserRepository } from "../user/user.repository.js";

const isUniqueConstraintError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const code = "code" in error ? error.code : undefined;
  return code === "P2002";
};

export const createFriendService = (
  friendRepository: FriendRepository,
  userRepository: UserRepository,
) => ({
  sendFriendRequest: async (requesterId: string, addresseeId: string) => {
    if (requesterId === addresseeId) {
      throw createError(400, "You cannot send a friend request to yourself");
    }

    const targetUser = await userRepository.findUnique({ id: addresseeId });
    if (!targetUser) {
      throw createError(404, "Target user not found");
    }

    const existing = await friendRepository.findExistingFriendship(
      requesterId,
      addresseeId,
    );
    if (existing) {
      if (existing.status === FriendshipStatus.ACCEPTED) {
        throw createError(409, "You are already friends");
      }
      throw createError(409, "Friend request already exists or pending");
    }

    try {
      return await friendRepository.createFriendship({
        requesterId,
        addresseeId,
        status: FriendshipStatus.PENDING,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw createError(409, "Friend request already exists or pending");
      }
      throw error;
    }
  },

  acceptFriendRequest: async (userId: string, friendshipId: string) => {
    const friendship = await friendRepository.findFriendshipById(friendshipId);
    if (!friendship) {
      throw createError(404, "Friend request not found");
    }

    if (friendship.addresseeId !== userId) {
      throw createError(403, "You can only accept requests sent to you");
    }

    if (friendship.status === FriendshipStatus.ACCEPTED) {
      throw createError(400, "Friend request already accepted");
    }

    return friendRepository.updateFriendshipStatus(
      friendshipId,
      FriendshipStatus.ACCEPTED,
    );
  },

  getFriends: async (userId: string) => {
    const friendships = await friendRepository.findManyFriendships(
      userId,
      FriendshipStatus.ACCEPTED,
    );

    return friendships.map((f) => {
      const friend = f.requesterId === userId ? f.addressee : f.requester;
      return {
        id: f.id,
        status: f.status,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        friend,
      };
    });
  },

  getPendingRequests: async (userId: string) => {
    const friendships = await friendRepository.findManyFriendships(
      userId,
      FriendshipStatus.PENDING,
    );

    return friendships
      .filter((f) => f.addresseeId === userId)
      .map((f) => ({
        id: f.id,
        status: f.status,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        friend: f.requester,
      }));
  },

  removeFriendship: async (userId: string, friendshipId: string) => {
    const friendship = await friendRepository.findFriendshipById(friendshipId);
    if (!friendship) {
      throw createError(404, "Friendship not found");
    }

    if (
      friendship.requesterId !== userId &&
      friendship.addresseeId !== userId
    ) {
      throw createError(403, "You are not part of this friendship");
    }

    return friendRepository.deleteFriendship(friendshipId);
  },
});

export type FriendService = ReturnType<typeof createFriendService>;
