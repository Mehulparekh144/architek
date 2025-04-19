import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return (
		<div className="flex flex-col items-center space-y-3 justify-center h-screen">
			<p>Dashboard - {session?.user?.email}</p>
			<form
				action={async () => {
					"use server";
					await auth.api.signOut({
						headers: await headers(),
					});
					redirect("/");
				}}
			>
				<Button type="submit">Logout</Button>
			</form>
			<Button variant={"link"} asChild>
				<Link href="/draw">Draw</Link>
			</Button>
		</div>
	);
}
