import type { PrismaClient, Prisma, Invitation } from "@/generated/prisma/client.js";

export type InvitationWithInviter = Prisma.InvitationGetPayload<{
  include: { inviter: true };
}>;

export const createInvitationRepository = (prisma: PrismaClient) => ({
  createInvitation: (
    data: Prisma.InvitationUncheckedCreateInput,
  ): Promise<Invitation> => {
    return prisma.invitation.create({ data });
  },

  findInvitationByCode: (
    code: string,
  ): Promise<InvitationWithInviter | null> => {
    return prisma.invitation.findUnique({
      where: { code },
      include: {
        inviter: true,
      },
    });
  },

  updateInvitationUsed: (
    id: string,
    usedById: string,
    usedAt: Date,
  ): Promise<Invitation> => {
    return prisma.invitation.update({
      where: { id },
      data: { usedById, usedAt },
    });
  },
});

export type InvitationRepository = ReturnType<
  typeof createInvitationRepository
>;
