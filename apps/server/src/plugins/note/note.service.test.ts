import { beforeEach, describe, expect, it, vi } from "vitest";
import { Visibility } from "@/generated/prisma/client.js";
import { createNoteService } from "./note.service.js";

const now = new Date("2026-02-14T00:00:00.000Z");

const makeNote = (overrides?: Partial<Record<string, unknown>>) => ({
  id: "note-1",
  title: "title",
  content: "content",
  userId: "user-a",
  visibility: Visibility.FRIENDS,
  feelingId: null,
  createdAt: now,
  updatedAt: now,
  ...overrides,
});

describe("createNoteService", () => {
  const build = () => {
    const noteRepository = {
      create: vi.fn(),
      findAllByUserId: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const service = createNoteService(noteRepository);
    return { service, noteRepository };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createNote", () => {
    it("요청 데이터에 userId를 주입해 생성한다", async () => {
      const { service, noteRepository } = build();
      const created = makeNote();
      noteRepository.create.mockResolvedValue(created);

      const result = await service.createNote("user-a", {
        title: "title",
        content: "content",
      });

      expect(noteRepository.create).toHaveBeenCalledWith({
        title: "title",
        content: "content",
        userId: "user-a",
      });
      expect(result).toEqual(created);
    });
  });

  describe("getNotes", () => {
    it("유저별 노트 목록을 조회한다", async () => {
      const { service, noteRepository } = build();
      const notes = [makeNote(), makeNote({ id: "note-2" })];
      noteRepository.findAllByUserId.mockResolvedValue(notes);

      const result = await service.getNotes("user-a");

      expect(noteRepository.findAllByUserId).toHaveBeenCalledWith("user-a");
      expect(result).toEqual(notes);
    });
  });

  describe("getNote", () => {
    it("노트가 없으면 404", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(null);

      await expect(service.getNote("user-a", "note-1")).rejects.toThrow(
        "Note not found",
      );
    });

    it("소유자가 아니면 403", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(makeNote({ userId: "user-b" }));

      await expect(service.getNote("user-a", "note-1")).rejects.toThrow(
        "Access denied",
      );
    });

    it("소유자면 노트를 반환한다", async () => {
      const { service, noteRepository } = build();
      const note = makeNote({ userId: "user-a" });
      noteRepository.findById.mockResolvedValue(note);

      const result = await service.getNote("user-a", "note-1");

      expect(result).toEqual(note);
    });
  });

  describe("updateNote", () => {
    it("노트가 없으면 404", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateNote("user-a", "note-1", { title: "updated" }),
      ).rejects.toThrow("Note not found");
      expect(noteRepository.update).not.toHaveBeenCalled();
    });

    it("소유자가 아니면 403", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(makeNote({ userId: "user-b" }));

      await expect(
        service.updateNote("user-a", "note-1", { title: "updated" }),
      ).rejects.toThrow("Access denied");
      expect(noteRepository.update).not.toHaveBeenCalled();
    });

    it("소유자면 업데이트한다", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(makeNote({ userId: "user-a" }));
      const updated = makeNote({ title: "updated" });
      noteRepository.update.mockResolvedValue(updated);

      const result = await service.updateNote("user-a", "note-1", {
        title: "updated",
      });

      expect(noteRepository.update).toHaveBeenCalledWith("note-1", {
        title: "updated",
      });
      expect(result).toEqual(updated);
    });
  });

  describe("deleteNote", () => {
    it("노트가 없으면 404", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(null);

      await expect(service.deleteNote("user-a", "note-1")).rejects.toThrow(
        "Note not found",
      );
      expect(noteRepository.delete).not.toHaveBeenCalled();
    });

    it("소유자가 아니면 403", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(makeNote({ userId: "user-b" }));

      await expect(service.deleteNote("user-a", "note-1")).rejects.toThrow(
        "Access denied",
      );
      expect(noteRepository.delete).not.toHaveBeenCalled();
    });

    it("소유자면 삭제한다", async () => {
      const { service, noteRepository } = build();
      noteRepository.findById.mockResolvedValue(makeNote({ userId: "user-a" }));
      const deleted = makeNote({ id: "note-1" });
      noteRepository.delete.mockResolvedValue(deleted);

      const result = await service.deleteNote("user-a", "note-1");

      expect(noteRepository.delete).toHaveBeenCalledWith("note-1");
      expect(result).toEqual(deleted);
    });
  });
});
