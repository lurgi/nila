import type { Static } from "@sinclair/typebox";
import type { NoteSchema } from "@/types/schemas/note.schema.js";

export type NoteResponse = Static<typeof NoteSchema>;
