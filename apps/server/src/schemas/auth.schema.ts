import { Type } from "@sinclair/typebox";
import { AuthProvider } from "@/generated/prisma/client.js";
import { UserSchema } from "./user.schema.js";

export const LoginBodySchema = Type.Object({
  provider: Type.Enum(AuthProvider),
  idToken: Type.String(),
});

export const TokenResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  user: UserSchema,
});

export const RefreshBodySchema = Type.Object({
  refreshToken: Type.String(),
});

export const LoginSchema = {
  body: LoginBodySchema,
  response: {
    200: TokenResponseSchema,
  },
};

export const RefreshSchema = {
  body: RefreshBodySchema,
  response: {
    200: TokenResponseSchema,
  },
};

export const LogoutSchema = {
  response: {
    204: Type.Null(),
  },
};
