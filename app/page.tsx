import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/auth/sign-in-button";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

export default function Home() {
	return (
		<main className="flex h-full flex-col items-center justify-center bg-sky-800">
			<div className="space-y-5 text-center">
				<h1
					className={cn(
						"text-6xl font-semibold text-white drop-shadow-md",
						font.className
					)}
				>
					🔐 Authentication
				</h1>

				<p className="text-white text-lg">Simple Authentication Service</p>

				<div>
					<SignInButton>
						<Button
							variant="secondary"
							size="lg"
							className="uppercase font-semibold"
						>
							Sign In
						</Button>
					</SignInButton>
				</div>
			</div>
		</main>
	);
}
