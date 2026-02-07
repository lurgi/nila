import fp from "fastify-plugin";
import { PrismaClient } from "../../generated/prisma/client.js";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(
  async (fastify) => {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    await prisma.$connect();

    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async () => {
      await prisma.$disconnect();
    });
  },
  { name: "prismaPlugin" },
);
