"use server";

import * as z from "zod";

import { SignInSchema } from "@/lib/schemas";

export const signin = async (values: z.infer<typeof SignInSchema>) => {
	const validatedFields = SignInSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Some or all of the fields are not valid!" };
	}

	return { success: "Email sent" };
};
