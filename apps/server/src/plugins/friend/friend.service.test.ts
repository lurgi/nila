import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, FriendshipStatus } from "@/generated/prisma/client.js";
import { createFriendService } from "./friend.service.js";

const now = new Date("2026-02-14T00:00:00.000Z");

const makeUser = (id: string) => ({
  id,
  email: `${id}@example.com`,
  name: id,
  profileImage: null,
  phoneNumber: null,
  isEmailAgreed: false,
  isPushAgreed: false,
  pushToken: null,
  provider: AuthProvider.GOOGLE,
  providerId: `${id}-provider`,
  createdAt: now,
  updatedAt: now,
});

describe("createFriendService", () => {
  const build = () => {
    const friendRepository = {
      createFriendship: vi.fn(),
      findFriendshipById: vi.fn(),
      findExistingFriendship: vi.fn(),
      findManyFriendships: vi.fn(),
      updateFriendshipStatus: vi.fn(),
      deleteFriendship: vi.fn(),
    };

    const userRepository = {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const service = createFriendService(friendRepository, userRepository);

    return { service, friendRepository, userRepository };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendFriendRequest", () => {
    it("자기 자신에게 친구 요청을 보낼 수 없다", async () => {
      const { service } = build();

      await expect(
        service.sendFriendRequest("user-a", "user-a"),
      ).rejects.toThrow("You cannot send a friend request to yourself");
    });

    it("상대 유저가 없으면 404를 반환한다", async () => {
      const { service, userRepository } = build();
      userRepository.findUnique.mockResolvedValue(null);

      await expect(
        service.sendFriendRequest("user-a", "user-b"),
      ).rejects.toThrow("Target user not found");
    });

    it("이미 ACCEPTED 상태면 중복 요청을 막는다", async () => {
      const { service, userRepository, friendRepository } = build();
      userRepository.findUnique.mockResolvedValue(makeUser("user-b"));
      friendRepository.findExistingFriendship.mockResolvedValue({
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.ACCEPTED,
        createdAt: now,
        updatedAt: now,
      });

      await expect(
        service.sendFriendRequest("user-a", "user-b"),
      ).rejects.toThrow("You are already friends");
    });

    it("이미 PENDING 상태면 중복 요청을 막는다", async () => {
      const { service, userRepository, friendRepository } = build();
      userRepository.findUnique.mockResolvedValue(makeUser("user-b"));
      friendRepository.findExistingFriendship.mockResolvedValue({
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      });

      await expect(
        service.sendFriendRequest("user-a", "user-b"),
      ).rejects.toThrow("Friend request already exists or pending");
    });

    it("유효한 요청은 PENDING 상태로 생성한다", async () => {
      const { service, userRepository, friendRepository } = build();
      const created = {
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      };
      userRepository.findUnique.mockResolvedValue(makeUser("user-b"));
      friendRepository.findExistingFriendship.mockResolvedValue(null);
      friendRepository.createFriendship.mockResolvedValue(created);

      const result = await service.sendFriendRequest("user-a", "user-b");

      expect(friendRepository.createFriendship).toHaveBeenCalledWith({
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.PENDING,
      });
      expect(result).toEqual(created);
    });

    it("동시 요청으로 unique 충돌이 나면 409로 변환한다", async () => {
      const { service, userRepository, friendRepository } = build();
      userRepository.findUnique.mockResolvedValue(makeUser("user-b"));
      friendRepository.findExistingFriendship.mockResolvedValue(null);
      friendRepository.createFriendship.mockRejectedValue(
        Object.assign(new Error("Unique constraint failed"), { code: "P2002" }),
      );

      await expect(
        service.sendFriendRequest("user-a", "user-b"),
      ).rejects.toThrow("Friend request already exists or pending");
    });

    it("P2002가 아닌 생성 에러는 그대로 전달한다", async () => {
      const { service, userRepository, friendRepository } = build();
      userRepository.findUnique.mockResolvedValue(makeUser("user-b"));
      friendRepository.findExistingFriendship.mockResolvedValue(null);
      friendRepository.createFriendship.mockRejectedValue("db-temporary-error");

      await expect(service.sendFriendRequest("user-a", "user-b")).rejects.toBe(
        "db-temporary-error",
      );
    });

    it("code 속성이 없는 객체 에러는 그대로 전달한다", async () => {
      const { service, userRepository, friendRepository } = build();
      userRepository.findUnique.mockResolvedValue(makeUser("user-b"));
      friendRepository.findExistingFriendship.mockResolvedValue(null);
      friendRepository.createFriendship.mockRejectedValue(
        new Error("unexpected-db-error"),
      );

      await expect(
        service.sendFriendRequest("user-a", "user-b"),
      ).rejects.toThrow("unexpected-db-error");
    });
  });

  describe("acceptFriendRequest", () => {
    it("요청이 없으면 404를 반환한다", async () => {
      const { service, friendRepository } = build();
      friendRepository.findFriendshipById.mockResolvedValue(null);

      await expect(
        service.acceptFriendRequest("user-b", "friendship-1"),
      ).rejects.toThrow("Friend request not found");
    });

    it("요청 수신자가 아니면 수락할 수 없다", async () => {
      const { service, friendRepository } = build();
      friendRepository.findFriendshipById.mockResolvedValue({
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-c",
        status: FriendshipStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      });

      await expect(
        service.acceptFriendRequest("user-b", "friendship-1"),
      ).rejects.toThrow("You can only accept requests sent to you");
    });

    it("이미 수락된 요청은 다시 수락할 수 없다", async () => {
      const { service, friendRepository } = build();
      friendRepository.findFriendshipById.mockResolvedValue({
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.ACCEPTED,
        createdAt: now,
        updatedAt: now,
      });

      await expect(
        service.acceptFriendRequest("user-b", "friendship-1"),
      ).rejects.toThrow("Friend request already accepted");
    });

    it("유효한 요청은 ACCEPTED로 변경한다", async () => {
      const { service, friendRepository } = build();
      const accepted = {
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.ACCEPTED,
        createdAt: now,
        updatedAt: now,
      };
      friendRepository.findFriendshipById.mockResolvedValue({
        ...accepted,
        status: FriendshipStatus.PENDING,
      });
      friendRepository.updateFriendshipStatus.mockResolvedValue(accepted);

      const result = await service.acceptFriendRequest(
        "user-b",
        "friendship-1",
      );

      expect(friendRepository.updateFriendshipStatus).toHaveBeenCalledWith(
        "friendship-1",
        FriendshipStatus.ACCEPTED,
      );
      expect(result).toEqual(accepted);
    });
  });

  describe("getFriends", () => {
    it("양방향 관계에서 상대 유저를 friend 필드로 매핑한다", async () => {
      const { service, friendRepository } = build();
      const userA = makeUser("user-a");
      const userB = makeUser("user-b");
      const userC = makeUser("user-c");
      friendRepository.findManyFriendships.mockResolvedValue([
        {
          id: "friendship-1",
          requesterId: "user-a",
          addresseeId: "user-b",
          status: FriendshipStatus.ACCEPTED,
          createdAt: now,
          updatedAt: now,
          requester: userA,
          addressee: userB,
        },
        {
          id: "friendship-2",
          requesterId: "user-c",
          addresseeId: "user-a",
          status: FriendshipStatus.ACCEPTED,
          createdAt: now,
          updatedAt: now,
          requester: userC,
          addressee: userA,
        },
      ]);

      const result = await service.getFriends("user-a");

      expect(friendRepository.findManyFriendships).toHaveBeenCalledWith(
        "user-a",
        FriendshipStatus.ACCEPTED,
      );
      expect(result).toEqual([
        {
          id: "friendship-1",
          status: FriendshipStatus.ACCEPTED,
          createdAt: now,
          updatedAt: now,
          friend: userB,
        },
        {
          id: "friendship-2",
          status: FriendshipStatus.ACCEPTED,
          createdAt: now,
          updatedAt: now,
          friend: userC,
        },
      ]);
    });
  });

  describe("getPendingRequests", () => {
    it("내가 받은 PENDING 요청만 반환한다", async () => {
      const { service, friendRepository } = build();
      const userA = makeUser("user-a");
      const userB = makeUser("user-b");
      const userC = makeUser("user-c");
      friendRepository.findManyFriendships.mockResolvedValue([
        {
          id: "pending-1",
          requesterId: "user-a",
          addresseeId: "user-b",
          status: FriendshipStatus.PENDING,
          createdAt: now,
          updatedAt: now,
          requester: userA,
          addressee: userB,
        },
        {
          id: "pending-2",
          requesterId: "user-b",
          addresseeId: "user-c",
          status: FriendshipStatus.PENDING,
          createdAt: now,
          updatedAt: now,
          requester: userB,
          addressee: userC,
        },
      ]);

      const result = await service.getPendingRequests("user-b");

      expect(friendRepository.findManyFriendships).toHaveBeenCalledWith(
        "user-b",
        FriendshipStatus.PENDING,
      );
      expect(result).toEqual([
        {
          id: "pending-1",
          status: FriendshipStatus.PENDING,
          createdAt: now,
          updatedAt: now,
          friend: userA,
        },
      ]);
    });
  });

  describe("removeFriendship", () => {
    it("친구 관계가 없으면 404를 반환한다", async () => {
      const { service, friendRepository } = build();
      friendRepository.findFriendshipById.mockResolvedValue(null);

      await expect(
        service.removeFriendship("user-a", "friendship-1"),
      ).rejects.toThrow("Friendship not found");
    });

    it("관계 당사자가 아니면 삭제할 수 없다", async () => {
      const { service, friendRepository } = build();
      friendRepository.findFriendshipById.mockResolvedValue({
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.ACCEPTED,
        createdAt: now,
        updatedAt: now,
      });

      await expect(
        service.removeFriendship("user-c", "friendship-1"),
      ).rejects.toThrow("You are not part of this friendship");
    });

    it("관계 당사자는 친구 관계를 삭제할 수 있다", async () => {
      const { service, friendRepository } = build();
      const deleted = {
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.ACCEPTED,
        createdAt: now,
        updatedAt: now,
      };
      friendRepository.findFriendshipById.mockResolvedValue(deleted);
      friendRepository.deleteFriendship.mockResolvedValue(deleted);

      const result = await service.removeFriendship("user-a", "friendship-1");

      expect(friendRepository.deleteFriendship).toHaveBeenCalledWith(
        "friendship-1",
      );
      expect(result).toEqual(deleted);
    });
  });
});
