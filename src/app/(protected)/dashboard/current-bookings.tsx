"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import Link from "next/link";

export const CurrentBookings = () => {
	const { data, isLoading } = api.booking.getCurrentBookings.useQuery();

	return (
		<Card className="py-2">
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Topic</TableHead>
							<TableHead>Difficulty</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="space-y-2">
						{isLoading &&
							Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell className="w-[40%] h-12">
										<Skeleton className="h-4 w-3/4" />
									</TableCell>
									<TableCell className="w-[20%] h-12">
										<Skeleton className="h-4 w-1/4" />
									</TableCell>
									<TableCell className="w-[20%] h-12">
										<Skeleton className="h-4 w-1/3" />
									</TableCell>
									<TableCell className="w-[20%] h-12">
										<Skeleton className="h-4 w-1/3" />
									</TableCell>
									<TableCell className="w-[20%] h-12">
										<Skeleton className="h-8 w-3/5" />
									</TableCell>
								</TableRow>
							))}
						{data?.bookings.map((booking) => (
							<TableRow key={booking.id}>
								<TableCell className="w-[40%] h-12">{booking.topic}</TableCell>
								<TableCell className="w-[20%] h-12">
									<Badge
										variant={
											booking.difficulty === "EASY"
												? "easy"
												: booking.difficulty === "MEDIUM"
													? "medium"
													: "hard"
										}
									>
										{booking.difficulty}
									</Badge>
								</TableCell>
								<TableCell className="w-[20%] h-12">
									<Badge
										variant={booking.inProgress ? "secondary" : "secondary"}
										className="text-xs"
									>
										{booking.inProgress ? "In Progress" : "Completed"}
									</Badge>
								</TableCell>
								<TableCell className="w-[20%] h-12">
									{format(booking.createdAt, "d MMM yyyy")}
								</TableCell>
								<TableCell className="w-[20%] h-12">
									<Button variant="outline">
										<Link href={`/booking/${booking.id}`}>View</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
						{data?.bookings.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} className="h-12 text-center text-muted-foreground italic">
									No bookings found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
