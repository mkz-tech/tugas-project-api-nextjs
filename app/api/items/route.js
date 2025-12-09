
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";
import { StudentCreateSchema } from "@/utils/validators";

export async function GET() {
  try {
    const students = await prisma.student.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(ok("Items fetched", students), { status: 200 });
  } catch (error) {
    console.error("GET items error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = StudentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success:false, error: parsed.error.flatten().fieldErrors, code:400 }, { status: 400 });
    }
    const { nim, name, program, semester, gpa } = parsed.data;

    const exists = await prisma.student.findUnique({ where: { nim } });
    if (exists) {
      return NextResponse.json(err("NIM already exists", 409), { status: 409 });
    }

    const student = await prisma.student.create({ data: { nim, name, program, semester, gpa } });
    return NextResponse.json(ok("Item created", student), { status: 201 });
  } catch (error) {
    console.error("POST item error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}
