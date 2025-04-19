import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold">Hello World</h1>
			<Button asChild variant={"link"}>
				<Link href="/get-started">Get Started</Link>
			</Button>
		</section>
	);
}
