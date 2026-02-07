import { Type } from "@sinclair/typebox";
import { AuthProvider } from "@/generated/prisma/client.js";

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  name: Type.Union([Type.String(), Type.Null()]),
  profileImage: Type.Union([Type.String(), Type.Null()]),
  isEmailAgreed: Type.Boolean(),
  isPushAgreed: Type.Boolean(),
  pushToken: Type.Union([Type.String(), Type.Null()]),
  provider: Type.Enum(AuthProvider),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const UpdateUserBodySchema = Type.Object({
  name: Type.Optional(Type.String()),
  profileImage: Type.Optional(Type.String()),
  isEmailAgreed: Type.Optional(Type.Boolean()),
  isPushAgreed: Type.Optional(Type.Boolean()),
  pushToken: Type.Optional(Type.String()),
});

export const GetMeSchema = {
  response: {
    200: UserSchema,
  },
};

export const UpdateMeSchema = {
  body: UpdateUserBodySchema,
  response: {
    200: UserSchema,
  },
};
