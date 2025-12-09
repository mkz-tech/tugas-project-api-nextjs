
import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  role: z.enum(["Admin", "User"]).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export const StudentCreateSchema = z.object({
  nim: z.string().min(5, { message: "NIM minimal 5 karakter" }),
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  program: z.string().min(2, { message: "Program minimal 2 karakter" }),
  semester: z.number().int().min(1).max(14),
  gpa: z.number().min(0).max(4),
});

export const StudentUpdateSchema = StudentCreateSchema.partial();
