
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(ok("Users fetched", users), { status: 200 });
  } catch (error) {
    console.error("GET users error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}
