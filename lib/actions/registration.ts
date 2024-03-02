"use server";

import * as z from "zod";

import { RegistrationSchema } from "@/lib/schemas";

export const registration = async (
	values: z.infer<typeof RegistrationSchema>
) => {
	const validatedFields = RegistrationSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Some or all of the fields are not valid!" };
	}

	return { success: "Email sent" };
};
