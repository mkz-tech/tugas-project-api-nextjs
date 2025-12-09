
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ok, err } from "@/utils/response";
import { RegisterSchema } from "@/utils/validators";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success:false, error: parsed.error.flatten().fieldErrors, code:400 }, { status: 400 });
    }
    const { name, email, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(err("Email already registered", 409), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role === "Admin" ? "Admin" : "User" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(ok("User registered", user), { status: 201 });
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}
