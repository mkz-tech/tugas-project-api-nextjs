import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ success:false, error:"Missing fields", code:400 }, { status:400 });
    }

    // mencegah klien menetapkan peran ke Admin
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ success:false, error:"Email already registered", code:409 }, { status:409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed } // role defaults to User
    });

    const userSafe = { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
    return NextResponse.json(ok("User registered", userSafe), { status:201 });
  } catch (error) {
    console.error("REGISTER ERROR", error);
    return NextResponse.json({ success:false, error:"Server Error", code:500 }, { status:500 });
  }
}