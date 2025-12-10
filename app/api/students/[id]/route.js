import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";
import { StudentUpdateSchema } from "@/utils/validators";

// =============================
// GET /api/students/:id
// =============================
export async function GET(request, context) {
  try {
    const { id } = await context.params; 
    const studentId = Number(id);

    if (isNaN(studentId)) {
      return NextResponse.json(err("Invalid student id", 400), { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(err("Student not found", 404), { status: 404 });
    }

    return NextResponse.json(ok("Student fetched", student), { status: 200 });
  } catch (error) {
    console.error("GET student/:id error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}


// =============================
// PATCH /api/students/:id
// =============================
export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const studentId = Number(id);

    if (isNaN(studentId)) {
      return NextResponse.json(err("Invalid student id", 400), { status: 400 });
    }

    const body = await request.json();
    const parsed = StudentUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: parsed.error.flatten().fieldErrors,
        code: 400,
      }, { status: 400 });
    }

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: parsed.data,
    });

    return NextResponse.json(ok("Student updated", updated), { status: 200 });
  } catch (error) {
    console.error("PATCH student error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}


// =============================
// PUT /api/students/:id
// =============================
export async function PUT(request, context) {
  return PATCH(request, context);
}


// =============================
// DELETE /api/students/:id
// Admin only (middleware sets x-user-role)
// =============================
export async function DELETE(request, context) {
  try {
    const role = request.headers.get("x-user-role");
    if (role !== "Admin") {
      return NextResponse.json({
        success: false,
        error: "Forbidden",
        code: 403,
      }, { status: 403 });
    }

    const { id } = await context.params;
    const studentId = Number(id);

    if (isNaN(studentId)) {
      return NextResponse.json(err("Invalid student id", 400), { status: 400 });
    }

    await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json(ok("Student deleted", {}), { status: 200 });
  } catch (error) {
    console.error("DELETE student error", error);
    return NextResponse.json(err("Server Error", 500), { status: 500 });
  }
}