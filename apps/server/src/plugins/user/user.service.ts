import type { Prisma } from "@/generated/prisma/client.js";
import type { UserRepository } from "./user.repository.js";

export const createUserService = (userRepository: UserRepository) => ({
  getUserById: (id: string) => {
    return userRepository.findUnique({ id });
  },

  getUserByEmail: (email: string) => {
    return userRepository.findUnique({ email });
  },

  findOrCreateByProvider: async (data: Prisma.UserCreateInput) => {
    const existingUser = await userRepository.findUnique({
      provider_providerId: {
        provider: data.provider,
        providerId: data.providerId,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    return userRepository.create(data);
  },

  updateUser: (id: string, data: Prisma.UserUpdateInput) => {
    return userRepository.update(id, data);
  },
});

export type UserService = ReturnType<typeof createUserService>;
