import type { Static } from "@sinclair/typebox";
import type { CreateFriendBodySchema } from "@/types/schemas/friend.schema.js";

export type CreateFriendRequest = Static<typeof CreateFriendBodySchema>;
