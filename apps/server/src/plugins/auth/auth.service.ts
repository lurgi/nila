import type { AuthRepository } from "./auth.repository.js";
import type { UserService } from "../user/user.service.js";
import type { LoginBodySchema } from "@/types/schemas/auth.schema.js";
import type { Static } from "@sinclair/typebox";
import type { User } from "@/generated/prisma/client.js";

type LoginInput = Static<typeof LoginBodySchema>;

export const createAuthService = (
  authRepository: AuthRepository,
  userService: UserService,
  jwt: {
    sign: (payload: object, options?: object) => string;
  },
) => {
  const issueTokens = async (user: User) => {
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign({ sub: user.id }, { expiresIn: "7d" });

    await authRepository.create({
      token: refreshToken,
      user: { connect: { id: user.id } },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user };
  };

  return {
    login: async (data: LoginInput) => {
      const user = await userService.findOrCreateByProvider(data);

      return issueTokens(user);
    },

    refresh: async (token: string) => {
      const savedToken = await authRepository.findUnique(token);

      if (!savedToken || savedToken.expiresAt < new Date()) {
        if (savedToken) {
          await authRepository.delete(token);
        }
        throw new Error("Invalid or expired refresh token");
      }

      const user = await userService.getUserById(savedToken.userId);
      if (!user) {
        throw new Error("User not found");
      }

      await authRepository.delete(token);

      return issueTokens(user);
    },

    logout: async (token: string) => {
      try {
        await authRepository.delete(token);
      } catch (e) {
        // 토큰이 이미 없는 경우 무시
      }
    },
  };
};

export type AuthService = ReturnType<typeof createAuthService>;
