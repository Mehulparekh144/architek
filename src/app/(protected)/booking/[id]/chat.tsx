"use client";
import {
	ChatBubble,
	ChatBubbleAvatar,
	ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { useEffect, useRef, useState } from "react";
import { redis, saveMessagesToRedis } from "@/lib/redis";
import type { Message } from "@/types/redisData";
import type { Booking } from "@prisma/client";
import { useUserSelection, type UserSelection } from "@/hooks/use-changes";
import { convertChangesToAIFriendly } from "@/lib/openai";
import { ShineBorder } from "@/components/magicui/shine-border";
import { WandSparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";

export const Chat = ({ booking }: { booking: Booking }) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const { userSelection: changes, setUserSelection: setChanges } =
		useUserSelection();
	const [isAIConvertingMessage, setIsAIConvertingMessage] =
		useState<boolean>(false);
	const [generatedMessage, setGeneratedMessage] = useState<string>("");
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

	useEffect(() => {
		if (changes.content) {
			handleSendMessage({ changes });
		}
	}, [changes]);

	const handleSendMessage = async ({ changes }: { changes: UserSelection }) => {
		if (!changes) return;

		let generatedMessage = changes.content;

		if (changes.needsAI) {
			const response = await convertChangesToAIFriendly(changes.content);
			generatedMessage = "";
			setIsAIConvertingMessage(true);
			for await (const chunk of response) {
				generatedMessage += chunk?.choices[0]?.delta.content;
			}
			setGeneratedMessage(generatedMessage);
			setIsAIConvertingMessage(false);
		}

		const userMessage: Message = {
			type: "sent",
			message: generatedMessage,
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
			const encodedMessage = encodeURIComponent(generatedMessage);
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

					saveMessagesToRedis({
						messages: updatedMessages,
						bookingId: booking.id,
					});
					return updatedMessages;
				});

				if (data.type === "done" || data.type === "error") {
					eventSource.close();
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

					saveMessagesToRedis({
						messages: updatedMessages,
						bookingId: booking.id,
					});
					return updatedMessages;
				});
			};

			setChanges({
				content: "",
				needsAI: false,
			});
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

				saveMessagesToRedis({
					messages: updatedMessages,
					bookingId: booking.id,
				});
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
							<div dangerouslySetInnerHTML={{ __html: marked(msg.message) }} />
						</ChatBubbleMessage>
					</ChatBubble>
				))}
			</div>
			<div className="flex relative overflow-hidden items-center bg-secondary rounded-md px-2 py-4 gap-2 mb-6">
				{isAIConvertingMessage && (
					<ShineBorder shineColor={"purple"} borderWidth={2} />
				)}
				<p className="text-sm text-muted-foreground flex items-center">
					<WandSparklesIcon
						className={cn(
							"w-4 h-4 mr-2",
							isAIConvertingMessage && "animate-pulse",
						)}
					/>
					{generatedMessage.length > 0
						? generatedMessage
						: "AI will be recording your changes and asking questions about it."}
				</p>
			</div>
		</div>
	);
};
