import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return <div>Dashboard - {session?.user?.email}</div>;
}
