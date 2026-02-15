import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/generated/prisma/client.js";
import { createUserService } from "./user.service.js";

const now = new Date("2026-02-14T00:00:00.000Z");

const makeUser = (id: string) => ({
  id,
  email: `${id}@example.com`,
  name: id,
  profileImage: null,
  phoneNumber: null,
  isEmailAgreed: false,
  isPushAgreed: false,
  pushToken: null,
  provider: AuthProvider.GOOGLE,
  providerId: `${id}-provider`,
  createdAt: now,
  updatedAt: now,
});

describe("createUserService", () => {
  const build = () => {
    const userRepository = {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const service = createUserService(userRepository);
    return { service, userRepository };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUserById는 id로 조회한다", async () => {
    const { service, userRepository } = build();
    const user = makeUser("user-a");
    userRepository.findUnique.mockResolvedValue(user);

    const result = await service.getUserById("user-a");

    expect(userRepository.findUnique).toHaveBeenCalledWith({ id: "user-a" });
    expect(result).toEqual(user);
  });

  it("getUserByEmail은 email로 조회한다", async () => {
    const { service, userRepository } = build();
    const user = makeUser("user-a");
    userRepository.findUnique.mockResolvedValue(user);

    const result = await service.getUserByEmail("user-a@example.com");

    expect(userRepository.findUnique).toHaveBeenCalledWith({
      email: "user-a@example.com",
    });
    expect(result).toEqual(user);
  });

  describe("findOrCreateByProvider", () => {
    it("provider/providerId 사용자가 있으면 기존 유저를 반환한다", async () => {
      const { service, userRepository } = build();
      const existingUser = makeUser("user-a");
      userRepository.findUnique.mockResolvedValue(existingUser);

      const input = {
        provider: AuthProvider.GOOGLE,
        providerId: "google-sub",
        email: "new@example.com",
        name: "new",
      };

      const result = await service.findOrCreateByProvider(input);

      expect(userRepository.findUnique).toHaveBeenCalledWith({
        provider_providerId: {
          provider: AuthProvider.GOOGLE,
          providerId: "google-sub",
        },
      });
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it("사용자가 없으면 생성한다", async () => {
      const { service, userRepository } = build();
      const createdUser = makeUser("user-b");
      userRepository.findUnique.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(createdUser);

      const input = {
        provider: AuthProvider.APPLE,
        providerId: "apple-sub",
        email: "new@example.com",
        name: "new",
        profileImage: "https://example.com/profile.png",
      };

      const result = await service.findOrCreateByProvider(input);

      expect(userRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(createdUser);
    });

    it("사용자가 없고 email/phoneNumber 모두 없으면 에러를 던진다", async () => {
      const { service, userRepository } = build();
      userRepository.findUnique.mockResolvedValue(null);

      await expect(
        service.findOrCreateByProvider({
          provider: AuthProvider.APPLE,
          providerId: "apple-sub",
          name: "new",
        }),
      ).rejects.toThrow(
        "Email or phoneNumber is required when creating a new user",
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  it("updateUser는 id/data로 업데이트한다", async () => {
    const { service, userRepository } = build();
    const updatedUser = makeUser("user-a");
    userRepository.update.mockResolvedValue(updatedUser);

    const result = await service.updateUser("user-a", {
      phoneNumber: "01012345678",
    });

    expect(userRepository.update).toHaveBeenCalledWith("user-a", {
      phoneNumber: "01012345678",
    });
    expect(result).toEqual(updatedUser);
  });

  describe("updateProfile(handle)", () => {
    it("handle 형식이 잘못되면 거절한다", async () => {
      const { service } = build();
      const updateProfile = Reflect.get(service, "updateProfile");

      if (typeof updateProfile !== "function") {
        throw new Error("updateProfile is not implemented");
      }

      await expect(
        updateProfile("user-a", { handle: "Invalid Handle!" }),
      ).rejects.toThrow("Invalid handle format");
    });

    it("이미 사용 중인 handle이면 거절한다", async () => {
      const { service, userRepository } = build();
      const updateProfile = Reflect.get(service, "updateProfile");

      if (typeof updateProfile !== "function") {
        throw new Error("updateProfile is not implemented");
      }

      userRepository.findUnique.mockResolvedValue(makeUser("user-b"));

      await expect(
        updateProfile("user-a", { handle: "taken.handle" }),
      ).rejects.toThrow("Handle already taken");
    });

    it("유효한 handle이면 normalized 값과 함께 업데이트한다", async () => {
      const { service, userRepository } = build();
      const updateProfile = Reflect.get(service, "updateProfile");

      if (typeof updateProfile !== "function") {
        throw new Error("updateProfile is not implemented");
      }

      const updated = makeUser("user-a");
      userRepository.findUnique.mockResolvedValue(null);
      userRepository.update.mockResolvedValue(updated);

      const result = await updateProfile("user-a", {
        name: "Nila",
        handle: "Nila.Dev",
      });

      expect(userRepository.findUnique).toHaveBeenCalledWith({
        handleNormalized: "nila.dev",
      });
      expect(userRepository.update).toHaveBeenCalledWith("user-a", {
        name: "Nila",
        handle: "Nila.Dev",
        handleNormalized: "nila.dev",
      });
      expect(result).toEqual(updated);
    });
  });
});
