import { env } from '@/env'
import type { Message } from '@/types/redisData';
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: env.NEXT_PUBLIC_REDIS_URL,
  token: env.NEXT_PUBLIC_REDIS_TOKEN,
});

export const saveMessagesToRedis = async ({
	messages,
	bookingId,
}: {
	messages: Message[];
	bookingId: string;
}) => {
	try {
		await redis.set(`whiteboard-messages-${bookingId}`, messages);
	} catch (error) {
		console.error("Error saving messages to Redis:", error);
	}
};