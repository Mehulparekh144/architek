"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type BookingSchema, bookingSchema } from "./validation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { bookSession } from "./actions";
import { useState } from "react";
import { LoadingButton } from "@/components/loading-button";
import { useRouter } from "next/navigation";
import { useUserSelection } from "@/hooks/use-changes";

export const BookingForm = () => {
	const router = useRouter();
	const { setUserSelection: setChanges } = useUserSelection();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<BookingSchema>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			topic: "",
			difficulty: "EASY",
			additionalInfo: "",
		},
	});

	const handleBooking = async (data: BookingSchema) => {
		try {
			setIsLoading(true);
			const booking = await bookSession(data);
			setChanges({
				content: `Please start the interview for the topic ${data.topic}. Start with the basic questions and then move on to the more complex ones.
						${data.additionalInfo ? `Here are some additional info user would like to get grilled: ${data.additionalInfo}` : ""}. 
						The interview should be conducted in ${data.difficulty} difficulty.`,
				needsAI: false,
			});
			toast.success("Session booked successfully");
			form.reset();
			router.push(`/booking/${booking.id}`);
		} catch (_error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(handleBooking)}>
				<FormField
					control={form.control}
					name="topic"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Topic</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Design URL Shortener" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="difficulty"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Difficulty</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<SelectTrigger className="w-full">
										{field.value.charAt(0).toUpperCase() + field.value.slice(1)}
									</SelectTrigger>
									<SelectContent className="w-full">
										<SelectItem value="EASY">Easy</SelectItem>
										<SelectItem value="MEDIUM">Medium</SelectItem>
										<SelectItem value="HARD">Hard</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="additionalInfo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Additional Info</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="I need to focus more on Load Balancing ..."
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<LoadingButton loading={isLoading} type="submit">
					Book
				</LoadingButton>
			</form>
		</Form>
	);
};
