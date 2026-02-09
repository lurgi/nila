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

export const FriendResponseItemSchema = Type.Object({
  id: Type.String(),
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

export const FriendListResponseSchema = Type.Array(FriendResponseItemSchema);

export const SendFriendRequestSchema = {
  body: CreateFriendBodySchema,
  response: {
    201: FriendSchema,
  },
};

export const AcceptFriendRequestSchema = {
  params: FriendIdParamsSchema,
  response: {
    200: FriendSchema,
  },
};

export const GetFriendsSchema = {
  response: {
    200: FriendListResponseSchema,
  },
};

export const GetPendingRequestsSchema = {
  response: {
    200: FriendListResponseSchema,
  },
};

export const DeleteFriendshipSchema = {
  params: FriendIdParamsSchema,
  response: {
    204: Type.Null(),
  },
};
