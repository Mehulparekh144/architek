import "tldraw/tldraw.css";
import { Whiteboard } from "./whiteboard";
import { Chat } from "./chat";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DrawPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/get-started");
	}

	const booking = await db.booking.findUnique({
		where: {
			id,
		},
	});

	if (!booking) {
		redirect("/404");
	}

	return (
		<section className="h-screen w-screen flex">
			<Whiteboard bookingId={id} userId={session.user.id} />
			<Chat booking={booking} />
		</section>
	);
}
