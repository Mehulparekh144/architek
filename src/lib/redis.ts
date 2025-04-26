import { env } from '@/env'
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: env.NEXT_PUBLIC_REDIS_URL,
  token: env.NEXT_PUBLIC_REDIS_TOKEN,
});
