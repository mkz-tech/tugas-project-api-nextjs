
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";
import { StudentCreateSchema, StudentUpdateSchema } from "@/utils/validators";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json(err("Bad Request", 400), { status: 400 });

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return NextResponse.json(err("Not Found", 404), { status: 404 });

    return NextResponse.json(ok("Item fetched", student), { status: 200 });
  } catch (error) {
    console.error("GET item error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json(err("Bad Request", 400), { status: 400 });

    const body = await request.json();
    const parsed = StudentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success:false, error: parsed.error.flatten().fieldErrors, code:400 }, { status: 400 });
    }
    const { nim, name, program, semester, gpa } = parsed.data;

    const updated = await prisma.student.update({
      where: { id },
      data: { nim, name, program, semester, gpa },
    });
    return NextResponse.json(ok("Item updated", updated), { status: 200 });
  } catch (error) {
    console.error("PUT item error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json(err("Bad Request", 400), { status: 400 });

    const data = await request.json();
    const parsed = StudentUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ success:false, error: parsed.error.flatten().fieldErrors, code:400 }, { status: 400 });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(ok("Item updated", updated), { status: 200 });
  } catch (error) {
    console.error("PATCH item error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json(err("Bad Request", 400), { status: 400 });

    const role = request.headers.get("x-user-role");
    if (role !== "Admin") {
      return NextResponse.json(err("Forbidden", 403), { status: 403 });
    }

    const deleted = await prisma.student.delete({ where: { id } });
    return NextResponse.json(ok("Item deleted", deleted), { status: 200 });
  } catch (error) {
    console.error("DELETE item error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}
