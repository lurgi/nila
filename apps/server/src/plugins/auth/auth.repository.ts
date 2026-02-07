import type {
  PrismaClient,
  Prisma,
  RefreshToken,
} from "@/generated/prisma/client.js";

export const createAuthRepository = (prisma: PrismaClient) => ({
  create: (data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> => {
    return prisma.refreshToken.create({ data });
  },

  findUnique: (token: string): Promise<RefreshToken | null> => {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  delete: (token: string): Promise<RefreshToken> => {
    return prisma.refreshToken.delete({ where: { token } });
  },

  deleteByUserId: (userId: string): Promise<Prisma.BatchPayload> => {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  },
});

export type AuthRepository = ReturnType<typeof createAuthRepository>;
