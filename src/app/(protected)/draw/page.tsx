import "tldraw/tldraw.css";
import { Whiteboard } from "./whiteboard";
import { Chat } from "./chat";

export default function DrawPage() {
	return (
		<section className="h-screen w-screen flex">
			<Whiteboard />
			<Chat />
		</section>
	);
}
