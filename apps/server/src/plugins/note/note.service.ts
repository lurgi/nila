import createError from "http-errors";
import type {
  CreateNoteRequest,
  UpdateNoteRequest,
} from "@nila/types/schemas/note.schema";
import type { NoteRepository } from "./note.repository.js";

export const createNoteService = (noteRepository: NoteRepository) => {
  const checkOwnership = async (userId: string, id: string) => {
    const note = await noteRepository.findById(id);
    if (!note) {
      throw createError(404, "Note not found");
    }
    if (note.userId !== userId) {
      throw createError(403, "Access denied");
    }
    return note;
  };

  return {
    createNote: (userId: string, data: CreateNoteRequest) => {
      return noteRepository.create({
        ...data,
        userId,
      });
    },

    getNotes: (userId: string) => {
      return noteRepository.findAllByUserId(userId);
    },

    getNote: (userId: string, id: string) => {
      return checkOwnership(userId, id);
    },

    updateNote: async (userId: string, id: string, data: UpdateNoteRequest) => {
      await checkOwnership(userId, id);
      return noteRepository.update(id, data);
    },

    deleteNote: async (userId: string, id: string) => {
      await checkOwnership(userId, id);
      return noteRepository.delete(id);
    },
  };
};

export type NoteService = ReturnType<typeof createNoteService>;
