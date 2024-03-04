"use client";

import { signout } from "@/lib/actions/sign-out";

export const SignOutButton = ({ children }: { children: React.ReactNode }) => {
	const onClick = () => {
		signout();
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{children}
		</span>
	);
};
