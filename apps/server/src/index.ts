import Fastify from "fastify";
import dotenv from "dotenv";
import prismaPlugin from "./plugins/prisma/index.js";
import userPlugin from "./plugins/user/index.js";
import authPlugin from "./plugins/auth/index.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(prismaPlugin);
fastify.register(userPlugin);
fastify.register(authPlugin);

fastify.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
