import { Type } from "@sinclair/typebox";
import { UserSchema } from "./user.schema.js";
import { FriendshipStatus } from "@/generated/prisma/client.js";

export const FriendSchema = Type.Object({
  id: Type.String(),
  requesterId: Type.String(),
  addresseeId: Type.String(),
  status: Type.Enum(FriendshipStatus),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
  friend: Type.Optional(UserSchema),
});

export const CreateFriendBodySchema = Type.Object({
  userId: Type.String(),
});

export const FriendIdParamsSchema = Type.Object({
  id: Type.String(),
});

export const FriendListResponseSchema = Type.Array(FriendSchema);

export const InvitationSchema = Type.Object({
  id: Type.String(),
  inviterId: Type.String(),
  code: Type.String(),
  usedById: Type.Union([Type.String(), Type.Null()]),
  usedAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  expiresAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
  inviter: Type.Optional(UserSchema),
  usedBy: Type.Optional(UserSchema),
});

export const CreateInvitationResponseSchema = Type.Object({
  code: Type.String(),
  expiresAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
});

export const ProcessInvitationParamsSchema = Type.Object({
  code: Type.String(),
});

export const InvitationResponseSchema = InvitationSchema;
