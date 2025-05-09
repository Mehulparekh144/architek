"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import Link from "next/link";

export const CurrentBookings = () => {
	const { data, isLoading } = api.booking.getCurrentBookings.useQuery();

	return (
		<Card className="w-full h-full max-w-4xl bg-background">
			<CardHeader>
				<CardTitle className="text-lg font-bold">Current Bookings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 max-h-[700px] overflow-y-auto">
				{isLoading &&
					Array.from({ length: 5 }).map((_, index) => (
						<Card key={index}>
							<CardHeader className="flex justify-between items-start">
								<div className="w-1/2 flex flex-col gap-2">
									<Skeleton className="w-full h-4" />
									<Skeleton className="w-full h-4" />
								</div>
								<Skeleton className="w-16 h-4" />
							</CardHeader>
						</Card>
					))}

				{data?.bookings?.map((booking) => (
					<Card key={booking.id}>
						<CardHeader className="flex justify-between items-start">
							<Link href={`/booking/${booking.id}`}>
								<CardTitle className="hover:underline transition-all">
									{booking.topic}
								</CardTitle>
								<CardDescription>{booking.additionalInfo}</CardDescription>
							</Link>
							<div>
								<p className="text-sm text-muted-foreground">
									{format(booking.createdAt, "MMM d, yyyy")}
								</p>
							</div>
						</CardHeader>
					</Card>
				))}
			</CardContent>
			<CardFooter>
				{data?.totalBookings && data?.totalBookings > 5 && (
					<Button variant="outline">View All</Button>
				)}
			</CardFooter>
		</Card>
	);
};
