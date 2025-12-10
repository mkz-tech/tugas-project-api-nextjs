import { z } from "zod";

export const StudentCreateSchema = z.object({
  nim: z.string().min(1, { message: "NIM minimal 1 karakter" }),
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  program: z.string().min(1, { message: "Program minimal 1 karakter" }),
  semester: z.number().int().min(1, { message: "Semester minimal 1 karakter" }),
  gpa: z.number().min(0).max(4),
});

export const StudentUpdateSchema = z.object({
  nim: z.string().optional(),
  name: z.string().optional(),
  program: z.string().optional(),
  semester: z.number().int().min(1).optional(),
  gpa: z.number().min(0).max(4).optional(),
});