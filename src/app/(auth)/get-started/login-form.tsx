"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import type { ErrorContext } from "better-auth/react";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import type { SVGProps } from "react";

export const LoginForm = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleLogin = async (data: LoginSchema) => {
		const { email, password } = data;
		await signIn.email(
			{
				email,
				password,
				callbackURL: "/dashboard",
			},
			{
				onRequest: () => setLoading(true),
				onSuccess: () => {
					toast.success("Login successful");
				},
				onError: (error: ErrorContext) => {
					toast.error("Login Failed", {
						description: error.error.message,
					});
				},
				onResponse: () => setLoading(false),
			},
		);
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Login</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(handleLogin)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<LoadingButton className="w-full" type="submit" loading={loading}>
							Login
						</LoadingButton>
					</form>
				</Form>
				<div className="relative my-4 border-t border-border">
					<p className="absolute top-0 left-1/2 -translate-1/2 bg-card px-2 text-sm text-muted-foreground ">
						OR
					</p>
				</div>
				<Button
					variant={"secondary"}
					onClick={() =>
						signIn.social({
							provider: "google",
							callbackURL: "/dashboard",
						})
					}
					className="w-full flex items-center gap-2"
				>
					<Google />
					Google
				</Button>
			</CardContent>
		</Card>
	);
};

const Google = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width="1em"
		height="1em"
		viewBox="0 0 256 262"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="xMidYMid"
		{...props}
	>
		<title>Google</title>
		<path
			d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
			fill="#4285F4"
		/>
		<path
			d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
			fill="#34A853"
		/>
		<path
			d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
			fill="#FBBC05"
		/>
		<path
			d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
			fill="#EB4335"
		/>
	</svg>
);
export default Google;
