import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { MoveRightIcon } from "lucide-react";
import { BookingForm } from "./booking-form";

export const BookingDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					Book a session <MoveRightIcon />
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
