import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "./ui/button";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	loading?: boolean;
	hideChildren?: boolean;
}

export const LoadingButton = ({
	children,
	className,
	loading,
	hideChildren = false,
	...props
}: LoadingButtonProps) => {
	return (
		<Button disabled={loading} className={cn(className)} {...props}>
			{loading ? (
				<>
					<Loader2 className="size-4 animate-spin" />
					{hideChildren && children}
				</>
			) : (
				children
			)}
		</Button>
	);
};
