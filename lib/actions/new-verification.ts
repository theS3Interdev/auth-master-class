"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/data/user";
import { getVerificationTokenByToken } from "@/lib/data/verification-token";

export const newVerification = async (token: string) => {
	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) {
		return { error: "The token does not exist." };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: "The token has expired." };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: "The email address does not exist." };
	}

	await db.user.update({
		where: { id: existingUser.id },
		data: {
			emailVerified: new Date(),
			email: existingToken.email,
		},
	});

	await db.verificationToken.delete({
		where: { id: existingToken.id },
	});

	return { success: "The email has been verified." };
};
