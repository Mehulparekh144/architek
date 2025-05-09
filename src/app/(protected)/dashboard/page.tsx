import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { CurrentBookings } from "./current-bookings";
import { BookingDialog } from "./booking-dialog";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="w-screen h-screen">
			<div className="px-3 py-5 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Welcome {session?.user?.name} 👋</h1>
				<BookingDialog />
			</div>
			<Separator />
			<div className="px-3 py-5 space-y-3">
				<CurrentBookings />
			</div>
		</div>
	);
}
