import type { FastifyRequest, FastifyReply } from "fastify";
import type { NoteService } from "./note.service.js";
import type {
  CreateNoteRequest,
  UpdateNoteRequest,
} from "@/schemas/note.schema.js";

export const createNoteController = (noteService: NoteService) => ({
  getNotes: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const notes = await noteService.getNotes(userId);
    return reply.send(notes);
  },

  getNote: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const { id } = request.params;
    const note = await noteService.getNote(userId, id);
    return reply.send(note);
  },

  createNote: async (
    request: FastifyRequest<{ Body: CreateNoteRequest }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const note = await noteService.createNote(userId, request.body);
    return reply.code(201).send(note);
  },

  updateNote: async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateNoteRequest;
    }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const { id } = request.params;
    const note = await noteService.updateNote(userId, id, request.body);
    return reply.send(note);
  },

  deleteNote: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const { id } = request.params;
    await noteService.deleteNote(userId, id);
    return reply.code(204).send();
  },
});
