"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CalendarDays, Home, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
	{
		group: "Bookings",
		label: "Past Bookings",
		href: "/dashboard/bookings",
		icon: CalendarDays,
	},
	{
		group: "Bookings",
		label: "Feedback",
		href: "/dashboard/feedback",
		icon: MessageCircle,
	},
	{
		group: "User",
		label: "Profile",
		href: "/dashboard/profile",
		icon: User,
	},
];

export const AppSidebar = () => {
	const { open } = useSidebar();
	const pathname = usePathname();
	return (
		<Sidebar className="border-r" collapsible="offcanvas">
			<SidebarHeader
				className={cn(!open && "flex items-center justify-center")}
			>
				<h1 className="text-2xl font-bold">{open ? "Architek" : "A"}</h1>
			</SidebarHeader>
			<SidebarContent className="border-t">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									className={cn(pathname === "/dashboard" && "bg-muted")}
								>
									<Link
										className={cn("flex items-center gap-2")}
										href={"/dashboard"}
									>
										<Home className="w-4 h-4" />
										Dashboard
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Bookings</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{ITEMS.filter((item) => item.group === "Bookings").map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										className={cn(pathname === item.href && "bg-muted")}
									>
										<Link
											className={cn("flex items-center gap-2")}
											href={item.href}
										>
											<item.icon className="w-4 h-4" />
											{item.label}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>User</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{ITEMS.filter((item) => item.group === "User").map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										className={cn(pathname === item.href && "bg-muted")}
									>
										<Link
											className={cn("flex items-center gap-2")}
											href={item.href}
										>
											<item.icon className="w-4 h-4" />
											{item.label}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};
