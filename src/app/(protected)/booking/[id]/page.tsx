import "tldraw/tldraw.css";
import { Whiteboard } from "./whiteboard";
import { Chat } from "./chat";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { useWhiteboard } from "@/hooks/use-whiteboard";

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

	if (useWhiteboard.persist.getOptions().name !== `whiteboard-${id}`) {
		useWhiteboard.persist.setOptions({
			name: `whiteboard-${id}`,
		});
		useWhiteboard.persist.rehydrate();
	}

	return (
		<section className="h-screen w-screen flex">
			<Whiteboard />
			<Chat />
		</section>
	);
}
