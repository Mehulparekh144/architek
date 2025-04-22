import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookingDialog } from "./booking-dialog";
import { db } from "@/server/db";
import { Suspense } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const bookings = await db.booking.findMany({
		where: {
			userId: session?.user?.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		//TODO - Change and make it look better
		<div className="flex flex-col items-center space-y-3 justify-center h-screen">
			<Suspense fallback={<div>Loading...</div>}>
				<div className="max-w-2xl flex gap-3 items-center flex-wrap">
					{bookings.map((booking) => (
						<div key={booking.id} className="w-full h-full">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<p className="text-lg font-bold">{booking.topic}</p>
										<Link href={`/booking/${booking.id}`}>
											<ExternalLink className="w-4 h-4" />
										</Link>
									</CardTitle>
									<CardDescription>{booking.difficulty}</CardDescription>
								</CardHeader>
								<CardContent>
									<p>{booking.additionalInfo}</p>
									<p>{booking.createdAt.toLocaleString()}</p>
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			</Suspense>
			<p>Dashboard - {session?.user?.email}</p>
			<form
				action={async () => {
					"use server";
					await auth.api.signOut({
						headers: await headers(),
					});
					redirect("/");
				}}
			>
				<Button type="submit">Logout</Button>
			</form>
			<Button variant={"link"} asChild>
				<Link href="/draw">Draw</Link>
			</Button>
			<BookingDialog />
		</div>
	);
}
