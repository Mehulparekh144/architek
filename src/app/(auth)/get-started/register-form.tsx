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
import { registerSchema, type RegisterSchema } from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { useState } from "react";
import type { ErrorContext } from "better-auth/react";
import { LoadingButton } from "@/components/loading-button";
export const RegisterForm = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleRegister = async (data: RegisterSchema) => {
		const { email, password, name } = data;
		await signUp.email(
			{
				email,
				password,
				name,
				callbackURL: "/dashboard",
			},
			{
				onRequest: () => setLoading(true),
				onSuccess: () => {
					toast.success("Register successful");
				},
				onError: (error: ErrorContext) => {
					console.log(error);
					toast.error("Register Failed", {
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
				<CardTitle>Register</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-4"
						onSubmit={form.handleSubmit(handleRegister)}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<LoadingButton type="submit" loading={loading}>
							Register
						</LoadingButton>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
