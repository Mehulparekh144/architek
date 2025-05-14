import { getFeedback } from "@/lib/openai";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Message } from "@/types/redisData";
import { z } from "zod";

export const bookingRouter = createTRPCRouter({
	getCurrentBookings: protectedProcedure.query(async ({ ctx }) => {
		const bookings = await ctx.db.booking.findMany({
			where: {
				userId: ctx.session.user.id,
				inProgress: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 5,
		});

		const totalBookings = await ctx.db.booking.count({
			where: {
				userId: ctx.session.user.id,
			},
		});

		return {
			bookings,
			totalBookings,
		};
	}),

	endSession: protectedProcedure
		.input(
			z.object({
				bookingId: z.string(),
				whiteboardKey: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const messages: Message[] | null = await ctx.redis.get(
				`whiteboard-messages-${input.bookingId}`,
			);

			if (messages) {
				await ctx.db.message.createMany({
					data: messages.map((message) => ({
						bookingId: input.bookingId,
						type: message.type === "sent" ? "SENT" : "RECEIVED",
						message: message.message,
						thinking: message.thinking,
					})),
				});

				await ctx.redis.del(`whiteboard-messages-${input.bookingId}`);
			}

			let feedback = null;
			if (messages) {
				feedback = await getFeedback(messages);
				await ctx.db.feedback.create({
					data: {
						bookingId: input.bookingId,
						learningTopics: feedback?.learning_topics,
						strengths: feedback?.strengths,
						improvements: feedback?.improvements,
						explanationOpportunities: feedback?.explanation_opportunities,
						scoring: feedback?.scoring,
					},
				});
			}

			await ctx.db.booking.update({
				where: {
					id: input.bookingId,
				},
				data: {
					inProgress: false,
					whiteboardKey: input.whiteboardKey,
				},
			});

			await ctx.redis.del(`whiteboard-messages-${input.bookingId}`);
		}),
});
