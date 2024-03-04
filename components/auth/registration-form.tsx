"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegistrationSchema } from "@/lib/schemas";

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
import { registration } from "@/lib/actions/registration";

export const RegistrationForm = () => {
	const [isPending, startTransition] = useTransition();

	const [error, setError] = useState<string | undefined>("");

	const [success, setSuccess] = useState<string | undefined>("");

	const form = useForm<z.infer<typeof RegistrationSchema>>({
		resolver: zodResolver(RegistrationSchema),
		defaultValues: { email: "", password: "", name: "" },
	});

	const onSubmit = (values: z.infer<typeof RegistrationSchema>) => {
		setError("");

		setSuccess("");

		startTransition(() => {
			registration(values).then((data) => {
				setError(data.error);
				setSuccess(data.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel="Create an account."
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/sign-in"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder="John Doe"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormError message={error} />

					<FormSuccess message={success} />

					<Button
						disabled={isPending}
						type="submit"
						className="w-full uppercase font-semibold"
					>
						Create an Account
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
