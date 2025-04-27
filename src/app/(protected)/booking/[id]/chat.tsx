"use client";
import { SendHorizonal } from "lucide-react";
import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@/components/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { redis } from "@/lib/redis";
import type { Message } from "@/types/redisData";
import type { Booking } from "@prisma/client";

export const Chat = ({ booking }: { booking: Booking }) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState<string>(
		`Hi, You are here to interview me for this question : ${booking.topic}. Please keep in mind these additional areas where I want to focus on : ${booking.additionalInfo}`,
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, []);

	useEffect(() => {
		if (scrollRef.current && messages.length > 0) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const data = (await redis.get(
					`whiteboard-messages-${booking.id}`,
				)) as Message[];
				if (data) {
					setMessages(data);
				}
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		};

		fetchMessages();
	}, [booking.id]);

	const saveMessagesToRedis = async (updatedMessages: Message[]) => {
		try {
			await redis.set(`whiteboard-messages-${booking.id}`, updatedMessages);
		} catch (error) {
			console.error("Error saving messages to Redis:", error);
		}
	};

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

		const updatedMessages = [...messages, userMessage, assistantMessage];
		setMessages(updatedMessages);

		try {
			const encodedMessage = encodeURIComponent(message);
			const eventSource = new EventSource(
				`/api/stream?userMessage=${encodedMessage}&bookingId=${booking.id}`,
			);

			eventSource.onmessage = (event) => {
				const data = JSON.parse(event.data);

				setMessages((prev) => {
					const updatedMessages = prev.map((msg) => {
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
					});

					saveMessagesToRedis(updatedMessages);
					setIsLoading(false);
					return updatedMessages;
				});

				if (data.type === "done" || data.type === "error") {
					eventSource.close();
					setIsLoading(false);
				}
			};

			eventSource.onerror = (error) => {
				console.error("EventSource failed:", error);
				eventSource.close();
				setMessages((prev) => {
					const updatedMessages = prev.map((msg) => {
						if (msg.id === assistantId) {
							return {
								...msg,
								message: "Error connecting to stream",
								thinking: false,
							};
						}
						return msg;
					});

					saveMessagesToRedis(updatedMessages);
					setIsLoading(false);
					return updatedMessages;
				});
			};

			setMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages((prev) => {
				const updatedMessages = prev.map((msg) => {
					if (msg.id === assistantId) {
						return {
							...msg,
							message: "Failed to generate response",
							thinking: false,
						};
					}
					return msg;
				});

				saveMessagesToRedis(updatedMessages);
				setIsLoading(false);
				return updatedMessages;
			});
		}
	};

	return (
		<div className="w-1/3 border-l border-l-sidebar-border bg-sidebar shadow-sidebar shadow-lg flex flex-col px-3 py-1">
			<div
				className="flex-1 flex flex-col gap-2 p-3 max-h-[calc(100vh-2rem)] overflow-y-auto"
				ref={scrollRef}
			>
				{messages.map((msg) => (
					<ChatBubble key={msg.id} variant={msg.type}>
						<ChatBubbleAvatar
							src={
								msg.type === "sent"
									? "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
									: "https://github.com/shadcn.png"
							}
						/>
						<ChatBubbleMessage isLoading={msg.thinking} variant={msg.type}>
							{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
							<div dangerouslySetInnerHTML={{ __html: msg.message }} />
						</ChatBubbleMessage>
					</ChatBubble>
				))}
			</div>
			<div className="flex items-center gap-2 mb-3">
				<Textarea
					rows={3}
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
					disabled={message.trim() === "" || isLoading}
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
