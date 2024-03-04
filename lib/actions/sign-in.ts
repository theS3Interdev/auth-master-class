"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import { SignInSchema } from "@/lib/schemas";
import { signIn } from "@/auth";
import { DEFAULT_SIGNIN_REDIRECT } from "@/routes";

import { getUserByEmail } from "@/lib/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const signin = async (values: z.infer<typeof SignInSchema>) => {
	const validatedFields = SignInSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Some or all of the fields are not valid!" };
	}

	const { email, password } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: "The email does not exist." };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return { success: "Confirmation email sent." };
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_SIGNIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Your credentials are invalid!" };
				default:
					return { error: "An unexpected error occurred!" };
			}
		}

		throw error;
	}
};
