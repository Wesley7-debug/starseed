import connectDb from "@/app/libs/ConnectDb";
import Course from "@/app/models/Course";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const { subject, department, courseId } = await req.json();

    if (!subject || !courseId) {
      return NextResponse.json({ error: "Subject and courseId are required" }, { status: 400 });
    }

    const teacher = await User.findOne({ RegNo: session.user.RegNo });

    if (!teacher || teacher.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!teacher.classId) {
      return NextResponse.json({ error: "Teacher must have a class assigned" }, { status: 400 });
    }

    const exists = await Course.findOne({ courseId });
    if (exists) {
      return NextResponse.json({ error: "Course already exists" }, { status: 409 });
    }

    const newCourse = await Course.create({
      subject,
      courseId,
      department: department || null,
      classId: teacher.classId,
      addedBy: teacher
    });

    return NextResponse.json({ message: "Course created", newCourse }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const user = await User.findOne({ RegNo: session.user.RegNo });

    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const allCourses = await Course.find({ classId: user.classId });

    return NextResponse.json({ allCourses }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
