import { env } from '@/env'
import { createAuthClient } from 'better-auth/react'

const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const { useSession, signIn, signOut, signUp } = authClient