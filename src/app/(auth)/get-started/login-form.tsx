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
						<LoadingButton type="submit" loading={loading}>
							Login
						</LoadingButton>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
