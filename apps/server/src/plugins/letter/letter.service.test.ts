import { beforeEach, describe, expect, it, vi } from "vitest";
import { FriendshipStatus } from "@/generated/prisma/client.js";
import { createLetterService } from "./letter.service.js";

describe("createLetterService", () => {
  const now = new Date("2026-02-14T12:00:00.000Z");

  const build = () => {
    const letterRepository = {
      create: vi.fn(),
      findInbox: vi.fn(),
      findSent: vi.fn(),
      findById: vi.fn(),
    };

    const friendRepository = {
      findExistingFriendship: vi.fn(),
    };

    const service = createLetterService(letterRepository, friendRepository);

    return { service, letterRepository, friendRepository };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  describe("sendLetter", () => {
    it("친구가 아니면 편지를 보낼 수 없다", async () => {
      const { service, friendRepository } = build();
      friendRepository.findExistingFriendship.mockResolvedValue(null);

      await expect(
        service.sendLetter("user-a", {
          recipientId: "user-b",
          content: "hello",
          deliverAt: new Date("2026-02-15T00:00:00.000Z"),
        }),
      ).rejects.toThrow("You can only send letters to accepted friends");
    });

    it("PENDING 친구 요청 상태면 편지를 보낼 수 없다", async () => {
      const { service, friendRepository } = build();
      friendRepository.findExistingFriendship.mockResolvedValue({
        status: FriendshipStatus.PENDING,
      });

      await expect(
        service.sendLetter("user-a", {
          recipientId: "user-b",
          content: "hello",
          deliverAt: new Date("2026-02-15T00:00:00.000Z"),
        }),
      ).rejects.toThrow("You can only send letters to accepted friends");
    });

    it("deliverAt이 현재 시각과 같으면 보낼 수 없다(경곗값)", async () => {
      const { service, friendRepository } = build();
      friendRepository.findExistingFriendship.mockResolvedValue({
        status: FriendshipStatus.ACCEPTED,
      });

      await expect(
        service.sendLetter("user-a", {
          recipientId: "user-b",
          content: "hello",
          deliverAt: now,
        }),
      ).rejects.toThrow("deliverAt must be in the future");
    });

    it("ACCEPTED 친구이고 deliverAt이 미래면 전송할 수 있다", async () => {
      const { service, friendRepository, letterRepository } = build();
      const deliverAt = new Date("2026-02-15T00:00:00.000Z");
      const saved = {
        id: "letter-1",
        senderId: "user-a",
        recipientId: "user-b",
        content: "hello",
        deliverAt,
        createdAt: now,
      };
      friendRepository.findExistingFriendship.mockResolvedValue({
        status: FriendshipStatus.ACCEPTED,
      });
      letterRepository.create.mockResolvedValue(saved);

      const result = await service.sendLetter("user-a", {
        recipientId: "user-b",
        content: "hello",
        deliverAt,
      });

      expect(letterRepository.create).toHaveBeenCalledWith({
        senderId: "user-a",
        recipientId: "user-b",
        content: "hello",
        deliverAt,
      });
      expect(result).toEqual(saved);
    });
  });

  describe("getInbox", () => {
    it("수신함은 deliverAt <= now 편지만 반환한다", async () => {
      const { service, letterRepository } = build();
      const inbox = [{ id: "letter-1" }, { id: "letter-2" }];
      letterRepository.findInbox.mockResolvedValue(inbox);

      const result = await service.getInbox("user-b", now);

      expect(letterRepository.findInbox).toHaveBeenCalledWith("user-b", now);
      expect(result).toEqual(inbox);
    });
  });

  describe("getSent", () => {
    it("발신함은 메타데이터만 반환하고 본문(content)은 숨긴다", async () => {
      const { service, letterRepository } = build();
      letterRepository.findSent.mockResolvedValue([
        {
          id: "letter-1",
          senderId: "user-a",
          recipientId: "user-b",
          content: "secret content",
          deliverAt: new Date("2026-02-15T00:00:00.000Z"),
          createdAt: now,
        },
      ]);

      const result = await service.getSent("user-a");

      expect(result).toEqual([
        {
          id: "letter-1",
          senderId: "user-a",
          recipientId: "user-b",
          deliverAt: new Date("2026-02-15T00:00:00.000Z"),
          createdAt: now,
        },
      ]);
    });
  });

  describe("getLetterDetail", () => {
    it("편지가 없으면 404를 반환한다", async () => {
      const { service, letterRepository } = build();
      letterRepository.findById.mockResolvedValue(null);

      await expect(
        service.getLetterDetail("user-b", "missing-letter", now),
      ).rejects.toThrow("Letter not found");
    });

    it("수신자가 아니면 본문을 볼 수 없다", async () => {
      const { service, letterRepository } = build();
      letterRepository.findById.mockResolvedValue({
        id: "letter-1",
        senderId: "user-a",
        recipientId: "user-b",
        content: "secret",
        deliverAt: new Date("2026-02-15T00:00:00.000Z"),
        createdAt: now,
      });

      await expect(
        service.getLetterDetail("user-a", "letter-1", now),
      ).rejects.toThrow("Only recipient can access letter content");
    });

    it("수신자라도 deliverAt 이전에는 본문을 볼 수 없다", async () => {
      const { service, letterRepository } = build();
      letterRepository.findById.mockResolvedValue({
        id: "letter-1",
        senderId: "user-a",
        recipientId: "user-b",
        content: "secret",
        deliverAt: new Date("2026-02-15T00:00:00.000Z"),
        createdAt: now,
      });

      await expect(
        service.getLetterDetail("user-b", "letter-1", now),
      ).rejects.toThrow("Letter is not delivered yet");
    });

    it("수신자이고 deliverAt 이후면 본문을 볼 수 있다", async () => {
      const { service, letterRepository } = build();
      const letter = {
        id: "letter-1",
        senderId: "user-a",
        recipientId: "user-b",
        content: "secret",
        deliverAt: new Date("2026-02-14T11:59:59.999Z"),
        createdAt: now,
      };
      letterRepository.findById.mockResolvedValue(letter);

      const result = await service.getLetterDetail("user-b", "letter-1", now);

      expect(result).toEqual(letter);
    });
  });
});
