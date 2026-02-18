import createError from "http-errors";
import type { Prisma } from "@/generated/prisma/client.js";
import type { UserRepository } from "./user.repository.js";
import {
  HANDLE_MAX_LENGTH,
  HANDLE_MIN_LENGTH,
  HANDLE_PATTERN,
  type UpdateProfileRequest,
} from "@nila/types/schemas/user.schema";

type FindOrCreateByProviderInput = Pick<
  Prisma.UserCreateInput,
  "provider" | "providerId" | "email" | "phoneNumber" | "name" | "profileImage"
>;

const HANDLE_REGEX = new RegExp(HANDLE_PATTERN);

export const createUserService = (userRepository: UserRepository) => ({
  getUserById: (id: string) => {
    return userRepository.findUnique({ id });
  },

  getUserByEmail: (email: string) => {
    return userRepository.findUnique({ email });
  },

  findOrCreateByProvider: async (data: FindOrCreateByProviderInput) => {
    const existingUser = await userRepository.findUnique({
      provider_providerId: {
        provider: data.provider,
        providerId: data.providerId,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    if (!data.email && !data.phoneNumber) {
      throw new Error(
        "Email or phoneNumber is required when creating a new user",
      );
    }

    return userRepository.create({
      provider: data.provider,
      providerId: data.providerId,
      email: data.email,
      phoneNumber: data.phoneNumber,
      name: data.name,
      profileImage: data.profileImage,
    });
  },

  updateUser: (id: string, data: Prisma.UserUpdateInput) => {
    return userRepository.update(id, data);
  },

  updateProfile: async (id: string, data: UpdateProfileRequest) => {
    const updateData: Prisma.UserUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.phoneNumber !== undefined) {
      updateData.phoneNumber = data.phoneNumber;
    }

    if (data.handle !== undefined) {
      const handleNormalized = data.handle.trim().toLowerCase();

      if (
        handleNormalized.length < HANDLE_MIN_LENGTH ||
        handleNormalized.length > HANDLE_MAX_LENGTH ||
        !HANDLE_REGEX.test(handleNormalized)
      ) {
        throw createError(400, "Invalid handle format");
      }

      const existingUser = await userRepository.findUnique({
        handleNormalized,
      });

      if (existingUser && existingUser.id !== id) {
        throw createError(409, "Handle already taken");
      }

      updateData.handle = data.handle;
      updateData.handleNormalized = handleNormalized;
    }

    return userRepository.update(id, updateData);
  },
});

export type UserService = ReturnType<typeof createUserService>;
