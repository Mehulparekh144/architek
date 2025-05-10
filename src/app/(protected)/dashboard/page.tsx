import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { CurrentBookings } from "./current-bookings";
import { BookingDialog } from "./booking-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, HomeIcon, LayoutDashboardIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { UserDropdown } from "./user-dropdown";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="container mx-auto py-6 max-w-7xl">
			<div className="flex items-center justify-between pb-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back, {session?.user?.name || "User"} 👋
					</p>
				</div>
				<div className="flex items-center gap-4">
					<UserDropdown user={session?.user} />
					<BookingDialog />
				</div>
			</div>

			<Separator className="my-4" />

			{/* TODO : Make it dynamic */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Total Bookings
						</CardTitle>
						<LayoutDashboardIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<p className="text-xs text-muted-foreground">+2 from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Upcoming Sessions
						</CardTitle>
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">4</div>
						<p className="text-xs text-muted-foreground">Next on Friday, 2pm</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Completed Sessions
						</CardTitle>
						<HomeIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">8</div>
						<p className="text-xs text-muted-foreground">Last on Monday</p>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Your Bookings</h2>
				</div>
				<CurrentBookings />
			</div>
		</div>
	);
}
