import * as z from "zod";

import { UserRole } from "@prisma/client";

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

export const ResetSchema = z.object({
	email: z.string().email({
		message: "What is your email address?",
	}),
});

export const NewPasswordSchema = z.object({
	password: z.string().min(6, {
		message: "The password can't be less than 6 characters.",
	}),
});

export const SettingsSchema = z
	.object({
		name: z.optional(z.string()),
		isTwoFactorEnabled: z.optional(z.boolean()),
		role: z.enum([UserRole.ADMIN, UserRole.USER]),
		email: z.optional(z.string().email()),
		password: z.optional(z.string().min(6)),
		newPassword: z.optional(z.string().min(6)),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}

			return true;
		},
		{
			message: "A new password is required.",
			path: ["newPassword"],
		}
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false;
			}

			return true;
		},
		{
			message: "The password is required.",
			path: ["password"],
		}
	);
