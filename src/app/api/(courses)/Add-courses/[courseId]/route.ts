import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import connectDb from "@/app/libs/ConnectDb";
import Course from "@/app/models/Course";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// PUT: Update a course
export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const teacher = await User.findOne({ RegNo: session.user.RegNo });
    if (!teacher || teacher.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { subject, department } = await req.json();
    const { courseId } = params;
console.log('courseid',courseId);
    const course = await Course.findOne({ courseId });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.classId !== teacher.classId) {
      return NextResponse.json({ error: "Not allowed to edit this course" }, { status: 403 });
    }

    if (subject) course.subject = subject;
    if (department !== undefined) course.department = department;

    await course.save();

    return NextResponse.json({ message: "Course updated", course }, { status: 200 });
  } catch (error: unknown) {
      let message = "Internal Server Error";
  
      if (error instanceof Error) {
        message = error.message;
      }
  
      return new NextResponse(JSON.stringify({ message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}

// DELETE: Remove a course
export async function DELETE(req: NextRequest,  context: { params: { courseId?: string } } ) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    const courseId = context.params?.courseId;
  if (!courseId) {
    return NextResponse.json({ error: "Course ID is missing" }, { status: 400 });
  }

  try {
    await connectDb();

    const teacher = await User.findOne({ RegNo: session.user.RegNo });
    if (!teacher || teacher.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

   

    const course = await Course.findOne({ courseId });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.classId !== teacher.classId) {
      return NextResponse.json({ error: "Not allowed to delete this course" }, { status: 403 });
    }

 await Course.findOneAndDelete({ courseId });


    return NextResponse.json({ message: "Course deleted" }, { status: 200 });
  } catch (error: unknown) {
    console.log('error',error)
      let message = "Internal Server Error";
  
      if (error instanceof Error) {
        message = error.message;
      }
  
      return new NextResponse(JSON.stringify({ message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}
