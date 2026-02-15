import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createLetterRepository } from "./letter.repository.js";
import { createLetterService } from "./letter.service.js";
import { createLetterController } from "./letter.controller.js";
import { createFriendRepository } from "../friend/friend.repository.js";
import {
  CreateLetterSchema,
  GetInboxLettersSchema,
  GetLetterDetailSchema,
  GetSentLettersSchema,
  type CreateLetterRequest,
} from "@/schemas/letter.schema.js";

export default fp(
  async (fastify) => {
    const letterRepository = createLetterRepository(fastify.prisma);
    const friendRepository = createFriendRepository(fastify.prisma);
    const letterService = createLetterService(
      letterRepository,
      friendRepository,
    );
    const letterController = createLetterController(letterService);

    const authenticate = {
      onRequest: [
        async (req: FastifyRequest, reply: FastifyReply) =>
          await fastify.authenticate(req, reply),
      ],
    };

    fastify.post<{ Body: CreateLetterRequest }>(
      "/letters",
      { schema: CreateLetterSchema, ...authenticate },
      letterController.createLetter,
    );

    fastify.get(
      "/letters/inbox",
      { schema: GetInboxLettersSchema, ...authenticate },
      letterController.getInbox,
    );

    fastify.get(
      "/letters/sent",
      { schema: GetSentLettersSchema, ...authenticate },
      letterController.getSent,
    );

    fastify.get<{ Params: { id: string } }>(
      "/letters/:id",
      { schema: GetLetterDetailSchema, ...authenticate },
      letterController.getLetterDetail,
    );
  },
  {
    name: "letterPlugin",
    dependencies: ["prismaPlugin", "authPlugin"],
  },
);
