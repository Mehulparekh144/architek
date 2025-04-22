"use server";

import { auth } from "@/lib/auth";
import type { BookingSchema } from "./validation";
import { headers } from "next/headers";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";


export const bookSession = async (data: BookingSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      topic: data.topic,
      additionalInfo: data.additionalInfo,
      difficulty: data.difficulty
    }
  })

  revalidatePath("/dashboard");
  return booking;
}