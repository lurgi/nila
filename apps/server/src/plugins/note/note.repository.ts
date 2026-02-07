import type { PrismaClient, Prisma, Note } from "@/generated/prisma/client.js";

export const createNoteRepository = (prisma: PrismaClient) => ({
  create: (data: Prisma.NoteUncheckedCreateInput): Promise<Note> => {
    return prisma.note.create({ data });
  },

  findAllByUserId: (userId: string): Promise<Note[]> => {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: string): Promise<Note | null> => {
    return prisma.note.findUnique({
      where: { id },
    });
  },

  update: (id: string, data: Prisma.NoteUpdateInput): Promise<Note> => {
    return prisma.note.update({
      where: { id },
      data,
    });
  },

  delete: (id: string): Promise<Note> => {
    return prisma.note.delete({
      where: { id },
    });
  },
});

export type NoteRepository = ReturnType<typeof createNoteRepository>;
