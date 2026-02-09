import type { Static } from "@sinclair/typebox";
import type { ProcessInvitationParamsSchema } from "@/types/schemas/invitation.schema.ts";

export type ConsumeInvitationRequest = Static<
  typeof ProcessInvitationParamsSchema
>;
