"use client";
import type { User } from "better-auth";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Loader2, LogOutIcon } from "lucide-react";
import { useState } from "react";

export const UserDropdown = ({ user }: { user: User }) => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar>
						{isLoading ? (
							<AvatarFallback>
								<Loader2 className="h-4 w-4 animate-spin" />
							</AvatarFallback>
						) : (
							<>
								<AvatarImage src={user.image ?? ""} />
								<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
							</>
						)}
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem disabled className="flex flex-col gap-2 items-start">
					<p>{user.name}</p>
					<p className="text-xs text-muted-foreground">{user.email}</p>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						signOut({
							fetchOptions: {
								onRequest: () => {
									setIsLoading(true);
								},
								onSuccess: () => {
									toast.success("Logged out successfully");
									setIsLoading(false);
									redirect("/get-started");
								},
								onError: () => {
									toast.error("Failed to log out");
								},
							},
						})
					}
				>
					<LogOutIcon className="h-4 w-4 mr-2" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
