
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { ok, err } from "@/utils/response";
import { LoginSchema } from "@/utils/validators";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success:false, error: parsed.error.flatten().fieldErrors, code:400 }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(err("Invalid credentials", 401), { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(err("Invalid credentials", 401), { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    return NextResponse.json(ok("Login Success", { token }), { status: 200 });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}
