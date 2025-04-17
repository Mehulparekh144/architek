import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export default function GetStartedPage() {
	return (
		<section className="w-screen h-screen flex items-center justify-center">
			<Tabs className="w-full max-w-md" defaultValue="login">
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
		</section>
	);
}
