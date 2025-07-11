// routes/api/selectCourses.ts or appropriate route file
import connectDb from "@/app/libs/ConnectDb";
import User from "@/app/models/User";
import Course from "@/app/models/Course";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const user = await User.findOne({ RegNo: session.user.RegNo });

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { department, courses } = await req.json();

  const isSenior = ["ss1", "ss2", "ss3", "SS1", "SS2", "SS3"].includes(user.classId ?? "");


    if (isSenior && !department) {
      return NextResponse.json(
        { error: "Department is required for senior secondary students" }, { status: 400 });
    }

    if (!Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json({ error: "Courses array is required" }, { status: 400 });
    }

    // Validate courseIds against Course model
    const validCourses = await Course.find({
      courseId: { $in: courses },
      classId: user.classId,
      ...(isSenior ? { department } : { department: null }),
    });

    if (validCourses.length !== courses.length) {
      return NextResponse.json(
        { error: "One or more selected courses are invalid or do not match your class/department" },
        { status: 400 }
      );
    }

    // Save to user
    if (isSenior) user.department = department;
    user.courses = courses;

    await user.save();

    return NextResponse.json({ message: "Courses selected successfully" }, { status: 200 });
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


// routes/api/selectCourses.ts or same file

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const user = await User.findOne({ RegNo: session.user.RegNo });

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const isSenior = ["ss1", "ss2", "ss3", "SS1", "SS2", "SS3"].includes(user.classId ?? "");


    const courses = await Course.find({
      classId: user.classId,
      ...(isSenior ? { department: user.department } : { department: null }),
    }).select("-_id subject courseId classId department");

    return NextResponse.json({ courses }, { status: 200 });
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
