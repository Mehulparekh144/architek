"use client";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import { HeroPill } from "@/components/ui/hero-pill";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="w-screen min-h-screen">
			<section className="flex flex-col relative max-w-7xl mx-auto px-4 items-center justify-start pt-20 md:pt-44 min-h-screen">
				<InteractiveGridPattern
					className={cn(
						"[mask-image:radial-gradient(600px_circle_at_center,#a590ff,transparent)]",
						"border-primary",
					)}
					width={50}
					height={50}
				/>
				<div className="leading-relaxed space-y-4">
					<HeroPill
						href="" // TODO: add link
						label="Pro free for 1 month for new users"
						announcement="🎉 Offer"
						className="w-max"
					/>
					<h1 className="text-5xl md:text-7xl">
						Be the{" "}
						<LineShadowText shadowColor="#a590ff" className="italic">
							Architek
						</LineShadowText>{" "}
						. Let AI be the skeptic.
					</h1>
					<p className="text-xl md:text-2xl text-muted-foreground">
						Just you designing a system — and an AI that questions every
						assumption. Talk through your design like it's real, because the
						feedback will be.
					</p>
					<div className="relative w-max">
						<GlowEffect
							colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
							mode="colorShift"
							blur="soft"
							duration={3}
							scale={0.9}
						/>
						<Button className="relative" size={"lg"} asChild>
							<Link href={"/dashboard"}>
								Book a session <ArrowRight className="w-4 h-4" />
							</Link>
						</Button>
					</div>
				</div>

				<div className="max-w-7xl mx-auto w-full h-screen p-1.5 bg-muted-foreground/10 backdrop-blur-3xl mt-12 rounded-md ring-2 ring-primary shadow-2xl">
					<div className="w-full h-full bg-zinc-700 rounded-lg ring-1 ring-zinc-500">
						{/* Placeholder for video */}
					</div>
				</div>
			</section>
		</div>
	);
}
