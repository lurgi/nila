import type {
  PrismaClient,
  Prisma,
  AuthProvider,
  User,
} from "@/generated/prisma/client.js";

export const createUserRepository = (prisma: PrismaClient) => ({
  findUnique: (where: Prisma.UserWhereUniqueInput): Promise<User | null> => {
    return prisma.user.findUnique({ where });
  },

  create: (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({ data });
  },

  update: (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
    return prisma.user.update({ where: { id }, data });
  },
});

export type UserRepository = ReturnType<typeof createUserRepository>;
