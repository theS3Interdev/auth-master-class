import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/data/user";
import authConfig from "@/auth.config";

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: "/auth/sign-in",
		error: "/auth/error",
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			/* allow OAuth without email verification */
			if (account?.provider !== "credentials") return true;

			const existingUser = await getUserById(user.id);

			/* prevent sign in without email verification */
			if (!existingUser?.emailVerified) return false;

			// if (existingUser.isTwoFactorEnabled) {
			// 	const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
			// 		existingUser.id
			// 	);

			// 	if (!twoFactorConfirmation) return false;

			// 	/* delete two factor confirmation for next sign in */
			// 	await db.twoFactorConfirmation.delete({
			// 		where: { id: twoFactorConfirmation.id },
			// 	});
			// }

			return true;
		},

		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}

			return session;
		},

		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.role = existingUser.role;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	...authConfig,
});
