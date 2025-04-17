import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import Link from "next/link";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function GetStartedPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/dashboard");
	}

	return (
		<section className="w-screen h-screen relative">
			<DotPattern
				className={cn(
					"[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] z-10",
				)}
			/>
			<div className="h-full w-full max-w-md mx-auto px-3 flex flex-col space-y-3 items-center justify-center z-20">
				<h1 className="text-2xl font-bold">
					Get Started with <span className="text-primary">Architek</span>
				</h1>
				<Tabs className="w-full z-20" defaultValue="login">
					<TabsList className="w-full justify-center ">
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<LoginForm />
					</TabsContent>
					<TabsContent value="register">
						<RegisterForm />
					</TabsContent>
				</Tabs>
				<p className="text-sm text-muted-foreground text-center leading-5 text-pretty">
					By signing in, you agree to our{" "}
					<Link href="/privacy-policy" className="underline text-primary">
						Privacy Policy
					</Link>
					. We securely protect your information and never share your login
					details with anyone.
				</p>
			</div>
		</section>
	);
}
