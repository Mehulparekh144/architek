import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { Whiteboard } from "./whiteboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from "@/components/ui/chat-bubble";

export default function DrawPage() {
	return (
		<section className="h-screen w-screen flex">
			<Whiteboard />
			<div className="w-1/3 border-l border-l-sidebar-border shadow-lg flex flex-col px-3 py-1">
				<div className="flex-1 flex flex-col gap-2 p-3">
					<ChatBubble variant="sent">
						<ChatBubbleAvatar src="https://github.com/shadcn.png" />
						<ChatBubbleMessage variant="sent">Hello</ChatBubbleMessage>
					</ChatBubble>
					<ChatBubble variant="received">
						<ChatBubbleAvatar src="https://github.com/shadcn.png" />
						<ChatBubbleMessage variant="received">Hello</ChatBubbleMessage>
					</ChatBubble>
				</div>
				<div className="flex items-center gap-2 mb-3">
					<Input placeholder="Type your message here..." />
					<Button size={"icon"}>
						<SendHorizonal />
					</Button>
				</div>
			</div>
		</section>
	);
}
