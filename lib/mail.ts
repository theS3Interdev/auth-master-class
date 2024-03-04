import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: "Mailer @ S3 <mailer@s3.co.ke>",
		to: email,
		subject: "2FA Code",
		html: `<p>Your Two Factor Authentication code is: ${token}</p>`,
	});
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${domain}/auth/new-password?token=${token}`;

	await resend.emails.send({
		from: "Mailer @ S3 <mailer@s3.co.ke>",
		to: email,
		subject: "Reset your password",
		html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;

	await resend.emails.send({
		from: "Mailer @ S3 <mailer@s3.co.ke>",
		to: email,
		subject: "Confirm your email",
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
	});
};
