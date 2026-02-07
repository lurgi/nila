import { Type } from "@sinclair/typebox";

export const NoteSchema = Type.Object({
  id: Type.String(),
  title: Type.Union([Type.String(), Type.Null()]),
  content: Type.String(),
  userId: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const CreateNoteBodySchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.String(),
});

export const UpdateNoteBodySchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
});

export const GetNotesSchema = {
  response: {
    200: Type.Array(NoteSchema),
  },
};

export const GetNoteSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: NoteSchema,
  },
};

export const CreateNoteSchema = {
  body: CreateNoteBodySchema,
  response: {
    201: NoteSchema,
  },
};

export const UpdateNoteSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  body: UpdateNoteBodySchema,
  response: {
    200: NoteSchema,
  },
};

export const DeleteNoteSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    204: Type.Null(),
  },
};
