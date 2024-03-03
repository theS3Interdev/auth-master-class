import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
	apiAuthPrefix,
	authRoutes,
	DEFAULT_SIGNIN_REDIRECT,
	publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;

	const isSignedIn = !!req.auth;

	const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isAPIAuthRoute) {
		return null;
	}

	if (isAuthRoute) {
		if (isSignedIn) {
			return Response.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
		}

		return null;
	}

	if (!isSignedIn && !isPublicRoute) {
		let callbackUrl = nextUrl.pathname;

		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return Response.redirect(
			new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
		);
	}

	return null;
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)"],
};
