import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import { AuthProvider } from "@/generated/prisma/client.js";

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.Union([Type.String({ format: "email" }), Type.Null()]),
  name: Type.Union([Type.String(), Type.Null()]),
  handle: Type.Union([Type.String(), Type.Null()]),
  profileImage: Type.Union([Type.String(), Type.Null()]),
  phoneNumber: Type.Union([Type.String(), Type.Null()]),
  isEmailAgreed: Type.Boolean(),
  isPushAgreed: Type.Boolean(),
  pushToken: Type.Union([Type.String(), Type.Null()]),
  provider: Type.Enum(AuthProvider),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const UserResponseSchema = UserSchema;

export const BaseUserUpdateBodySchema = Type.Object({
  name: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
});

export const HANDLE_PATTERN = "^[a-z0-9._]{3,30}$";

export const UpdateUserBodySchema = Type.Composite([
  BaseUserUpdateBodySchema,
  Type.Object({
    profileImage: Type.Optional(Type.String()),
    isEmailAgreed: Type.Optional(Type.Boolean()),
    isPushAgreed: Type.Optional(Type.Boolean()),
    pushToken: Type.Optional(Type.String()),
  }),
]);

export const UpdateProfileBodySchema = Type.Composite([
  BaseUserUpdateBodySchema,
  Type.Object({
    handle: Type.Optional(Type.String({ pattern: HANDLE_PATTERN })),
  }),
]);

export const GetMeSchema = {
  response: {
    200: UserResponseSchema,
  },
};

export const UpdateMeSchema = {
  body: UpdateUserBodySchema,
  response: {
    200: UserResponseSchema,
  },
};

export const UpdateProfileSchema = {
  body: UpdateProfileBodySchema,
  response: {
    200: UserResponseSchema,
  },
};

export type UpdateUserRequest = Static<typeof UpdateUserBodySchema>;
export type UpdateProfileRequest = Static<typeof UpdateProfileBodySchema>;
