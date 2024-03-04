"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegistrationSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/lib/data/user";

export const registration = async (
	values: z.infer<typeof RegistrationSchema>
) => {
	const validatedFields = RegistrationSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Some or all of the fields are not valid!" };
	}

	const { email, password, name } = validatedFields.data;

	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: "A user with the same email already exists." };
	}

	await db.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// TODO: Send verification token email

	return { success: "The confirmation email has been sent." };
};
