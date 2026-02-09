import Fastify from "fastify";
import { env } from "./config/env.js";
import prismaPlugin from "./plugins/prisma/index.js";
import userPlugin from "./plugins/user/index.js";
import authPlugin from "./plugins/auth/index.js";
import notePlugin from "./plugins/note/index.js";
import friendPlugin from "./plugins/friend/index.js";
import invitationPlugin from "./plugins/invitation/index.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(prismaPlugin);
fastify.register(userPlugin);
fastify.register(authPlugin);
fastify.register(notePlugin);
fastify.register(friendPlugin);
fastify.register(invitationPlugin);

fastify.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    const port = env.PORT;
    await fastify.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
