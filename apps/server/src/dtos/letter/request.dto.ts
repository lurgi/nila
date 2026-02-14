import type { Static } from "@sinclair/typebox";
import type { CreateLetterBodySchema } from "@/types/schemas/letter.schema.js";

export type CreateLetterRequest = Static<typeof CreateLetterBodySchema>;
