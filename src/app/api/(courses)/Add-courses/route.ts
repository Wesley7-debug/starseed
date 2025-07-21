import connectDb from "@/app/libs/ConnectDb";
import Course from "@/app/models/Course";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const { courses } = await req.json();

    if (!Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { error: "Courses array is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ RegNo: session.user.RegNo });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

if (!user.classId) {
  if (user.role === "student") {
    return NextResponse.json({ error: "Teacher must have a class assigned" }, { status: 400 });
  }
}


    // Validate input format
    for (const course of courses) {
      if (!course.subject || !course.courseId) {
        return NextResponse.json(
          {
            error: "Each course must have a subject and courseId",
          },
          { status: 400 }
        );
      }
    }

    // Check for duplicates in DB
    const courseIds = courses.map((c) => c.courseId);
    const existing = await Course.find({ courseId: { $in: courseIds } });

    if (existing.length > 0) {
      const existingIds = existing.map((c) => c.courseId);
      return NextResponse.json(
        {
          error: `Courses with the following IDs already exist: ${existingIds.join(
            ", "
          )}`,
        },
        { status: 409 }
      );
    }

    // Create new courses
    const newCourses = await Course.insertMany(
      courses.map((c) => ({
        subject: c.subject.trim(),
        courseId: c.courseId.trim(),
        department: c.department || null,
         classId: user.classId,
        addedBy: user._id, 
      }))
    );

    return NextResponse.json(
      { message: "Courses created", newCourses },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log('error:',error)
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



export async function GET() {
  const session = await getServerSession(authOptions);

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
