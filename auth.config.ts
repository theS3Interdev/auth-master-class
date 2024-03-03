import bcrypt from "bcrypt";

import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";

import { SignInSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/lib/data/user";

export default {
	providers: [
		Credentials({
			async authorize(credentials) {
				const validatedFields = SignInSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);

					if (!user || !user.password) return null;

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (passwordsMatch) return user;
				}

				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
