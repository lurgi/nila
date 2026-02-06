import fp from "fastify-plugin";
import { PrismaClient } from "../../generated/prisma/client.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(
  async (fastify) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const prisma = new PrismaClient({} as any);

    await prisma.$connect();

    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async () => {
      await prisma.$disconnect();
    });
  },
  { name: "prismaPlugin" },
);
