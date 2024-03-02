import * as z from "zod";

export const SignInSchema = z.object({
	email: z.string().email({
		message: "What is your email address?",
	}),
	password: z.string().min(1, {
		message: "Please enter your password.",
	}),
	code: z.optional(z.string()),
});
