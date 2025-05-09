import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookingRouter = createTRPCRouter({
	getCurrentBookings: protectedProcedure.query(async ({ ctx }) => {
		const bookings = await ctx.db.booking.findMany({
			where: {
				userId: ctx.session.user.id,
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
});
