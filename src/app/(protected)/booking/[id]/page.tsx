import "tldraw/tldraw.css";
import { Whiteboard } from "./whiteboard";
import { Chat } from "./chat";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { ChangesProvider } from "@/hooks/use-changes";

export default async function DrawPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const booking = await db.booking.findUnique({
		where: {
			id,
		},
	});

	if (!booking) {
		redirect("/404");
	}

	return (
		<ChangesProvider>
			<section className="h-screen w-screen flex">
				<Whiteboard bookingId={id} />
				<Chat booking={booking} />
			</section>
		</ChangesProvider>
	);
}
