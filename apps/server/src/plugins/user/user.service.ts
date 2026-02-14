import type { Prisma } from "@/generated/prisma/client.js";
import type { UserRepository } from "./user.repository.js";

type FindOrCreateByProviderInput = Pick<
  Prisma.UserCreateInput,
  "provider" | "providerId" | "email" | "phoneNumber" | "name" | "profileImage"
>;

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
});

export type UserService = ReturnType<typeof createUserService>;
