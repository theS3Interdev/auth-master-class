"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignInSchema } from "@/lib/schemas";

import { signin } from "@/lib/actions/sign-in";

import { CardWrapper } from "@/components/auth/card-wrapper";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const SignInForm = () => {
	const searchParams = useSearchParams();

	const urlError =
		searchParams.get("error") === "OAuthAccountNotLinked"
			? "The email is already in use with another provider."
			: "";

	const callbackUrl = searchParams.get("callbackUrl");

	const [isPending, startTransition] = useTransition();

	const [error, setError] = useState<string | undefined>("");

	const [success, setSuccess] = useState<string | undefined>("");

	const [showTwoFactor, setShowTwoFactor] = useState(false);

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof SignInSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			signin(values, callbackUrl)
				.then((data) => {
					if (data?.error) {
						form.reset();
						setError(data.error);
					}

					if (data?.success) {
						form.reset();
						setSuccess(data.success);
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true);
					}
				})
				.catch(() => setError("An unknown error occurred."));
		});
	};

	return (
		<CardWrapper
			headerLabel="Welcome back."
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/register"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{showTwoFactor && (
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor Code</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="123456"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{!showTwoFactor && (
							<>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													disabled={isPending}
													placeholder="john.doe@example.com"
													type="email"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													disabled={isPending}
													placeholder="********"
													type="password"
												/>
											</FormControl>

											<Button
												size="sm"
												variant="link"
												asChild
												className="px-0 font-normal pt-3"
											>
												<Link href="/auth/reset">Forgot your password?</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>

					<FormError message={error || urlError} />

					<FormSuccess message={success} />

					<Button
						disabled={isPending}
						type="submit"
						className="w-full uppercase font-semibold"
					>
						{showTwoFactor ? "Confirm" : "Sign In"}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
