import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply } from "fastify";
import { createNoteRepository } from "./note.repository.js";
import { createNoteService } from "./note.service.js";
import { createNoteController } from "./note.controller.js";
import {
  GetNotesSchema,
  GetNoteSchema,
  CreateNoteSchema,
  UpdateNoteSchema,
  DeleteNoteSchema,
  type CreateNoteRequest,
  type UpdateNoteRequest,
} from "@/schemas/note.schema.js";

export default fp(
  async (fastify) => {
    const noteRepository = createNoteRepository(fastify.prisma);
    const noteService = createNoteService(noteRepository);
    const noteController = createNoteController(noteService);

    const authenticate = {
      onRequest: [
        async (req: FastifyRequest, reply: FastifyReply) =>
          await fastify.authenticate(req, reply),
      ],
    };

    fastify.get(
      "/notes",
      { schema: GetNotesSchema, ...authenticate },
      noteController.getNotes,
    );
    fastify.get<{ Params: { id: string } }>(
      "/notes/:id",
      { schema: GetNoteSchema, ...authenticate },
      noteController.getNote,
    );
    fastify.post<{ Body: CreateNoteRequest }>(
      "/notes",
      { schema: CreateNoteSchema, ...authenticate },
      noteController.createNote,
    );
    fastify.patch<{ Params: { id: string }; Body: UpdateNoteRequest }>(
      "/notes/:id",
      { schema: UpdateNoteSchema, ...authenticate },
      noteController.updateNote,
    );
    fastify.delete<{ Params: { id: string } }>(
      "/notes/:id",
      { schema: DeleteNoteSchema, ...authenticate },
      noteController.deleteNote,
    );
  },
  {
    name: "notePlugin",
    dependencies: ["prismaPlugin", "authPlugin"],
  },
);
