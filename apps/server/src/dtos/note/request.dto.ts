import type { Static } from "@sinclair/typebox";
import type {
  CreateNoteBodySchema,
  UpdateNoteBodySchema,
} from "@/types/schemas/note.schema.js";

export type CreateNoteRequest = Static<typeof CreateNoteBodySchema>;
export type UpdateNoteRequest = Static<typeof UpdateNoteBodySchema>;
