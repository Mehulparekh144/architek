import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "./booking-form";
import { cn } from "@/lib/utils";

export const BookingDialog = ({ className }: { className?: string }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={cn(className, "text-base")} size={"lg"}>
					Book a session
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Book a session</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Please select a date and time for your session.
				</DialogDescription>
				<BookingForm />
			</DialogContent>
		</Dialog>
	);
};
