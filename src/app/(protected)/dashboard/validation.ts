import { Difficulty } from "@prisma/client";
import { z } from "zod";

export const bookingSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.nativeEnum(Difficulty),
  additionalInfo: z.string().optional(),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
