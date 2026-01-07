import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, "Full name is required").trim(),
  username: z.string().min(3, "Username must be at least 3 characters").trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain one special character")
    .trim(),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const FarmSetupSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15),
  farmName: z
    .string()
    .min(3, "Farm name must be at least 3 characters")
    .max(50),
  farmTypes: z
    .array(z.string())
    .min(1, "Select at least one farm type")
    .max(5, "Maximum 5 types"),
  locations: z
    .array(z.string())
    .min(1, "Select at least one location")
    .max(5, "Maximum 5 locations"),
  startTime: z.string(),
  endTime: z.string(),
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
});

export type FarmSetupInput = z.infer<typeof FarmSetupSchema>;

export const ResetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Must contain at least one letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Must contain one special character")
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This puts the error under the second input
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
