import { beforeEach, describe, expect, it, vi } from "vitest";
import { FriendshipStatus } from "@/generated/prisma/client.js";
import { createInvitationService } from "./invitation.service.js";

const now = new Date("2026-02-14T00:00:00.000Z");

describe("createInvitationService", () => {
  const build = () => {
    const invitationRepository = {
      createInvitation: vi.fn(),
      findInvitationByCode: vi.fn(),
      updateInvitationUsed: vi.fn(),
      consumeInvitationIfAvailable: vi.fn(),
    };

    const friendRepository = {
      createFriendship: vi.fn(),
      findFriendshipById: vi.fn(),
      findExistingFriendship: vi.fn(),
      findManyFriendships: vi.fn(),
      updateFriendshipStatus: vi.fn(),
      deleteFriendship: vi.fn(),
    };

    const service = createInvitationService(
      invitationRepository,
      friendRepository,
    );

    return { service, invitationRepository, friendRepository };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  describe("createInvitation", () => {
    it("7일 만료 초대코드를 생성한다", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.createInvitation.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEF12",
        usedById: null,
        usedAt: null,
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
      });

      await service.createInvitation("user-a");

      expect(invitationRepository.createInvitation).toHaveBeenCalledTimes(1);
      const input = invitationRepository.createInvitation.mock.calls[0]?.[0];
      expect(input.inviterId).toBe("user-a");
      expect(input.code).toMatch(/^[0-9A-F]{8}$/);
      expect(input.expiresAt.toISOString()).toBe("2026-02-21T00:00:00.000Z");
    });

    it("코드 충돌(P2002) 시 재시도 후 생성한다", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.createInvitation
        .mockRejectedValueOnce(
          Object.assign(new Error("Unique constraint failed"), {
            code: "P2002",
          }),
        )
        .mockResolvedValueOnce({
          id: "inv-1",
          inviterId: "user-a",
          code: "A1B2C3D4",
          usedById: null,
          usedAt: null,
          expiresAt: new Date("2026-02-21T00:00:00.000Z"),
          createdAt: now,
          updatedAt: now,
        });

      const result = await service.createInvitation("user-a");

      expect(invitationRepository.createInvitation).toHaveBeenCalledTimes(2);
      expect(result.id).toBe("inv-1");
    });

    it("P2002가 아닌 create 오류는 그대로 던진다", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.createInvitation.mockRejectedValue("db-temp-error");

      await expect(service.createInvitation("user-a")).rejects.toBe(
        "db-temp-error",
      );
    });

    it("code 속성이 없는 Error는 그대로 던진다", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.createInvitation.mockRejectedValue(
        new Error("unexpected-db-error"),
      );

      await expect(service.createInvitation("user-a")).rejects.toThrow(
        "unexpected-db-error",
      );
    });

    it("3회 연속 코드 충돌이면 503을 반환한다", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.createInvitation.mockRejectedValue(
        Object.assign(new Error("Unique constraint failed"), { code: "P2002" }),
      );

      await expect(service.createInvitation("user-a")).rejects.toThrow(
        "Unable to issue invitation code. Please try again.",
      );
      expect(invitationRepository.createInvitation).toHaveBeenCalledTimes(3);
    });
  });

  describe("consumeInvitation", () => {
    it("유효하지 않은 코드는 404", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue(null);

      await expect(
        service.consumeInvitation("user-b", "INVALID"),
      ).rejects.toThrow("Invalid invitation code");
    });

    it("이미 사용된 코드는 410", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: "user-c",
        usedAt: new Date("2026-02-13T00:00:00.000Z"),
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
        inviter: { id: "user-a" },
      });

      await expect(
        service.consumeInvitation("user-b", "ABCDEFGH"),
      ).rejects.toThrow("Invitation already used");
    });

    it("만료된 코드는 410", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: null,
        usedAt: null,
        expiresAt: new Date("2026-02-13T23:59:59.999Z"),
        createdAt: now,
        updatedAt: now,
        inviter: { id: "user-a" },
      });

      await expect(
        service.consumeInvitation("user-b", "ABCDEFGH"),
      ).rejects.toThrow("Invitation expired");
    });

    it("자신의 코드는 사용할 수 없다", async () => {
      const { service, invitationRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: null,
        usedAt: null,
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
        inviter: { id: "user-a" },
      });

      await expect(
        service.consumeInvitation("user-a", "ABCDEFGH"),
      ).rejects.toThrow("You cannot use your own invitation code");
    });

    it("이미 친구면 소비할 수 없다", async () => {
      const { service, invitationRepository, friendRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: null,
        usedAt: null,
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
        inviter: { id: "user-a" },
      });
      friendRepository.findExistingFriendship.mockResolvedValue({
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.ACCEPTED,
        createdAt: now,
        updatedAt: now,
      });

      await expect(
        service.consumeInvitation("user-b", "ABCDEFGH"),
      ).rejects.toThrow("You are already friends");
    });

    it("PENDING 친구요청이 있으면 ACCEPTED로 전환한다", async () => {
      const { service, invitationRepository, friendRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: null,
        usedAt: null,
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
        inviter: { id: "user-a" },
      });
      friendRepository.findExistingFriendship.mockResolvedValue({
        id: "friendship-1",
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      });
      friendRepository.updateFriendshipStatus.mockResolvedValue({
        id: "friendship-1",
      });
      invitationRepository.consumeInvitationIfAvailable.mockResolvedValue({
        id: "inv-1",
      });

      await service.consumeInvitation("user-b", "ABCDEFGH");

      expect(friendRepository.updateFriendshipStatus).toHaveBeenCalledWith(
        "friendship-1",
        FriendshipStatus.ACCEPTED,
      );
      expect(friendRepository.createFriendship).not.toHaveBeenCalled();
      expect(
        invitationRepository.consumeInvitationIfAvailable,
      ).toHaveBeenCalledWith("inv-1", "user-b", now);
    });

    it("친구요청이 없으면 ACCEPTED 친구관계를 생성한다", async () => {
      const { service, invitationRepository, friendRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: null,
        usedAt: null,
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
        inviter: { id: "user-a" },
      });
      friendRepository.findExistingFriendship.mockResolvedValue(null);
      friendRepository.createFriendship.mockResolvedValue({
        id: "friendship-1",
      });
      const updatedInvitation = {
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: "user-b",
        usedAt: now,
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
      };
      invitationRepository.consumeInvitationIfAvailable.mockResolvedValue(
        updatedInvitation,
      );

      const result = await service.consumeInvitation("user-b", "ABCDEFGH");

      expect(friendRepository.createFriendship).toHaveBeenCalledWith({
        requesterId: "user-a",
        addresseeId: "user-b",
        status: FriendshipStatus.ACCEPTED,
      });
      expect(
        invitationRepository.consumeInvitationIfAvailable,
      ).toHaveBeenCalledWith("inv-1", "user-b", now);
      expect(result).toEqual(updatedInvitation);
    });

    it("동시 소비로 이미 사용 처리되었으면 410", async () => {
      const { service, invitationRepository, friendRepository } = build();
      invitationRepository.findInvitationByCode.mockResolvedValue({
        id: "inv-1",
        inviterId: "user-a",
        code: "ABCDEFGH",
        usedById: null,
        usedAt: null,
        expiresAt: new Date("2026-02-21T00:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
        inviter: { id: "user-a" },
      });
      friendRepository.findExistingFriendship.mockResolvedValue(null);
      friendRepository.createFriendship.mockResolvedValue({
        id: "friendship-1",
      });
      invitationRepository.consumeInvitationIfAvailable.mockResolvedValue(null);

      await expect(
        service.consumeInvitation("user-b", "ABCDEFGH"),
      ).rejects.toThrow("Invitation already used");
    });
  });
});
