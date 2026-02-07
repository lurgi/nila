import type { Static } from "@sinclair/typebox";
import type { UpdateUserBodySchema } from "@/types/schemas/user.schema.js";

export type UpdateUserRequest = Static<typeof UpdateUserBodySchema>;
