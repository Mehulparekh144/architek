"use client";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { useState } from "react";
import { MessageLoading } from "@/components/ui/message-loading";
import { LoadingButton } from "@/components/loading-button";

interface Message {
	type: "sent" | "received";
	message: string;
	thinking: boolean;
	id: string;
}

export const Chat = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSendMessage = async () => {
		if (!message) return;

		setIsLoading(true);

		const userMessage: Message = {
			type: "sent",
			message,
			thinking: false,
			id: crypto.randomUUID(),
		};

		const assistantId = crypto.randomUUID();

		const assistantMessage: Message = {
			type: "received",
			message: "",
			thinking: true,
			id: assistantId,
		};

		setMessages((prev) => [...prev, userMessage, assistantMessage]);

		try {
			const encodedMessage = encodeURIComponent(message);
			const eventSource = new EventSource(
				`/api/stream?userMessage=${encodedMessage}`,
			);

			eventSource.onmessage = (event) => {
				const data = JSON.parse(event.data);

				setMessages((prev) =>
					prev.map((msg) => {
						if (msg.id === assistantId) {
							if (data.type === "thinking") {
								return {
									...msg,
									message: data.message,
									thinking: true,
								};
							}

							if (data.type === "chunk" || data.type === "done") {
								return {
									...msg,
									message: data.message,
									thinking: false,
								};
							}
						}
						return msg;
					}),
				);

				if (data.type === "done" || data.type === "error") {
					eventSource.close();
					setIsLoading(false);
				}
			};

			eventSource.onerror = (error) => {
				console.error("EventSource failed:", error);
				eventSource.close();
				setMessages((prev) =>
					prev.map((msg) => {
						if (msg.id === assistantId) {
							return {
								...msg,
								message: "Error connecting to stream",
								thinking: false,
							};
						}
						return msg;
					}),
				);
			};

			setMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages((prev) =>
				prev.map((msg) => {
					if (msg.id === assistantId) {
						return {
							...msg,
							message: "Failed to generate response",
							thinking: false,
						};
					}
					return msg;
				}),
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="w-1/3 border-l border-l-sidebar-border bg-sidebar shadow-sidebar shadow-lg flex flex-col px-3 py-1">
			<div className="flex-1 flex flex-col gap-2 p-3">
				{messages.map((msg) => (
					<ChatBubble key={msg.id} variant={msg.type}>
						<ChatBubbleAvatar
							src={
								msg.type === "sent"
									? "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
									: "https://github.com/shadcn.png"
							}
						/>
						{msg.thinking ? (
							<MessageLoading />
						) : (
							<ChatBubbleMessage variant={msg.type}>
								{msg.message}
							</ChatBubbleMessage>
						)}
					</ChatBubble>
				))}
			</div>
			<div className="flex items-center gap-2 mb-3">
				<Input
					placeholder="Type your message here..."
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSendMessage();
						}
					}}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<LoadingButton
					loading={isLoading}
					size={"icon"}
					onClick={handleSendMessage}
				>
					<SendHorizonal />
				</LoadingButton>
			</div>
		</div>
	);
};
