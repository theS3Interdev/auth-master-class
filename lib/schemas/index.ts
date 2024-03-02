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

export const RegistrationSchema = z.object({
	email: z.string().email({
		message: "What is your email address?",
	}),
	password: z.string().min(6, {
		message: "The password can't be less than 6 characters.",
	}),
	name: z.string().min(1, {
		message: "What is your name?",
	}),
});
