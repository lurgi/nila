import { beforeEach, describe, expect, it, vi } from "vitest";
import createError from "http-errors";
import { AuthProvider } from "@/generated/prisma/client.js";
import { createAuthService } from "./auth.service.js";
import { verifyAppleToken, verifyGoogleToken } from "./utils/token-verifier.js";

vi.mock("./utils/token-verifier.js", () => ({
  verifyAppleToken: vi.fn(),
  verifyGoogleToken: vi.fn(),
}));

const now = new Date("2026-02-14T00:00:00.000Z");

describe("createAuthService", () => {
  const user = {
    id: "user-1",
    email: "user@example.com",
    name: "User Name",
    profileImage: "https://example.com/profile.png",
    isEmailAgreed: false,
    isPushAgreed: false,
    pushToken: null,
    provider: AuthProvider.GOOGLE,
    providerId: "provider-1",
    createdAt: now,
    updatedAt: now,
  };

  const build = () => {
    const authRepository = {
      create: vi.fn().mockResolvedValue(undefined),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteByUserId: vi.fn(),
    };

    const userService = {
      getUserById: vi.fn(),
      getUserByEmail: vi.fn(),
      findOrCreateByProvider: vi.fn(),
      updateUser: vi.fn(),
    };

    const jwt = {
      sign: vi.fn().mockReturnValue("signed-token"),
    };

    const service = createAuthService(authRepository, userService, jwt);

    return { service, authRepository, userService, jwt };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  describe("login", () => {
    it("GOOGLE provider는 idToken 검증 결과로 로그인해야 한다", async () => {
      const { service, userService, authRepository, jwt } = build();
      vi.mocked(verifyGoogleToken).mockResolvedValue({
        providerId: "google-sub",
        email: "verified@example.com",
        name: "Verified User",
        profileImage: "https://example.com/verified.png",
      });
      userService.findOrCreateByProvider.mockResolvedValue(user);

      const result = await service.login({
        provider: AuthProvider.GOOGLE,
        idToken: "google-id-token",
      });

      expect(verifyGoogleToken).toHaveBeenCalledWith("google-id-token");
      expect(userService.findOrCreateByProvider).toHaveBeenCalledWith({
        provider: AuthProvider.GOOGLE,
        providerId: "google-sub",
        email: "verified@example.com",
        name: "Verified User",
        profileImage: "https://example.com/verified.png",
      });
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(authRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        accessToken: "signed-token",
        refreshToken: "signed-token",
        user,
      });
    });

    it("GOOGLE 이외 provider는 Apple verifier를 통해 로그인해야 한다", async () => {
      const { service, userService } = build();
      const nonGoogleProvider = Object.values(AuthProvider).find(
        (provider) => provider !== AuthProvider.GOOGLE,
      );

      if (!nonGoogleProvider) {
        throw new Error("A non-google provider is required for this test");
      }

      vi.mocked(verifyAppleToken).mockResolvedValue({
        providerId: "apple-sub",
        email: "apple@example.com",
      });
      userService.findOrCreateByProvider.mockResolvedValue(user);

      await service.login({
        provider: nonGoogleProvider,
        idToken: "apple-id-token",
      });

      expect(verifyAppleToken).toHaveBeenCalledWith("apple-id-token");
      expect(userService.findOrCreateByProvider).toHaveBeenCalledWith({
        provider: nonGoogleProvider,
        providerId: "apple-sub",
        email: "apple@example.com",
      });
    });

    it("토큰 검증 실패는 401 에러로 변환해야 한다", async () => {
      const { service } = build();
      const verificationError = new Error("invalid token");
      vi.mocked(verifyGoogleToken).mockRejectedValue(verificationError);

      await expect(
        service.login({
          provider: AuthProvider.GOOGLE,
          idToken: "bad-google-token",
        }),
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("refresh", () => {
    it("저장된 토큰이 없으면 401 에러를 반환한다", async () => {
      const { service, authRepository } = build();
      authRepository.findUnique.mockResolvedValue(null);

      await expect(service.refresh("missing-token")).rejects.toThrow(
        "Invalid or expired refresh token",
      );
      expect(authRepository.delete).not.toHaveBeenCalled();
    });

    it("만료 토큰이면 삭제 후 401 에러를 반환한다", async () => {
      const { service, authRepository } = build();
      authRepository.findUnique.mockResolvedValue({
        token: "expired-token",
        userId: "user-1",
        expiresAt: new Date("2026-02-13T23:59:59.999Z"),
      });
      authRepository.delete.mockResolvedValue(undefined);

      await expect(service.refresh("expired-token")).rejects.toThrow(
        "Invalid or expired refresh token",
      );
      expect(authRepository.delete).toHaveBeenCalledWith("expired-token");
    });

    it("유효 토큰 경곗값(현재 시각과 동일한 만료시간)은 재발급 가능하다", async () => {
      const { service, authRepository, userService, jwt } = build();
      authRepository.findUnique.mockResolvedValue({
        token: "valid-token",
        userId: "user-1",
        expiresAt: now,
      });
      userService.getUserById.mockResolvedValue(user);
      authRepository.delete.mockResolvedValue(undefined);
      authRepository.create.mockResolvedValue(undefined);
      const result = await service.refresh("valid-token");

      expect(authRepository.delete).toHaveBeenCalledWith("valid-token");
      expect(result).toEqual({
        accessToken: "signed-token",
        refreshToken: "signed-token",
        user,
      });
    });

    it("토큰은 유효하지만 user가 없으면 401 에러를 반환한다", async () => {
      const { service, authRepository, userService } = build();
      authRepository.findUnique.mockResolvedValue({
        token: "valid-token",
        userId: "missing-user-id",
        expiresAt: new Date("2026-02-14T00:00:00.001Z"),
      });
      userService.getUserById.mockResolvedValue(null);

      await expect(service.refresh("valid-token")).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("logout", () => {
    it("토큰이 없어도 에러를 던지지 않는다", async () => {
      const { service, authRepository } = build();
      authRepository.delete.mockRejectedValue(createError(404, "Not Found"));

      await expect(service.logout("unknown-token")).resolves.toBeUndefined();
    });
  });
});
