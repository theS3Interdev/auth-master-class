"use server";

import { UserRole } from "@prisma/client";

import { currentRole } from "@/lib/auth";

export const admin = async () => {
	const role = await currentRole();

	if (role === UserRole.ADMIN) {
		return { success: "Server Action is allowed." };
	}

	return { error: "Server Action is forbidden." };
};
