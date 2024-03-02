import { CardWrapper } from "@/components/auth/card-wrapper";

export const SignInForm = () => {
	return (
		<CardWrapper
			headerLabel="Welcome Back"
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/register"
			showSocial
		>
			Sign In Form
		</CardWrapper>
	);
};
