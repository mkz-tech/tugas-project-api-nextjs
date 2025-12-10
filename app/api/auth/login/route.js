import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { ok } from "@/utils/response";

const JWT_ALG = "HS256";
const TOKEN_EXP = 60 * 60 * 24 * 2; // 2 hari

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ success:false, error:"Missing fields", code:400 }, { status:400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success:false, error:"Invalid credentials", code:401 }, { status:401 });
    }

    const okPass = await bcrypt.compare(password, user.password);
    if (!okPass) {
      return NextResponse.json({ success:false, error:"Invalid credentials", code:401 }, { status:401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: JWT_ALG })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_EXP)
      .sign(secret);

    return NextResponse.json(ok("Login successful", { token }), { status:200 });
  } catch (error) {
    console.error("LOGIN ERROR", error);
    return NextResponse.json({ success:false, error:"Server Error", code:500 }, { status:500 });
  }
}