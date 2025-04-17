import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }).refine((data) => passwordRegex.test(data), {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
	name: z.string().min(1, { message: "Name is required" }),
	confirmPassword: z
		.string()
		.min(1, { message: "Confirm Password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"], // Path to the field that caused the error
});

export type RegisterSchema = z.infer<typeof registerSchema>;
