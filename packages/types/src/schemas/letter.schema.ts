import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";

export const LetterSchema = Type.Object({
  id: Type.String(),
  senderId: Type.String(),
  recipientId: Type.String(),
  content: Type.String(),
  deliverAt: Type.String({ format: "date-time" }),
  readAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  createdAt: Type.String({ format: "date-time" }),
});

export const SentLetterSchema = Type.Object({
  id: Type.String(),
  senderId: Type.String(),
  recipientId: Type.String(),
  deliverAt: Type.String({ format: "date-time" }),
  readAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  createdAt: Type.String({ format: "date-time" }),
});

export const CreateLetterBodySchema = Type.Object({
  recipientId: Type.String(),
  content: Type.String(),
  deliverAt: Type.String({ format: "date-time" }),
});

export const GetLetterParamsSchema = Type.Object({
  id: Type.String(),
});

export const CreateLetterSchema = {
  body: CreateLetterBodySchema,
  response: {
    201: SentLetterSchema,
  },
};

export const GetInboxLettersSchema = {
  response: {
    200: Type.Array(LetterSchema),
  },
};

export const GetSentLettersSchema = {
  response: {
    200: Type.Array(SentLetterSchema),
  },
};

export const GetLetterDetailSchema = {
  params: GetLetterParamsSchema,
  response: {
    200: LetterSchema,
  },
};

export type CreateLetterRequest = Static<typeof CreateLetterBodySchema>;
