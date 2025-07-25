import connectDb from "@/app/libs/ConnectDb";
import User from "@/app/models/User";
import Course from "@/app/models/Course";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";


 // Allows students to select and register courses

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  //  Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    //  Get the logged-in user from the DB
    const user = await User.findOne({ RegNo: session.user.RegNo });

    //  Ensure the user is a student
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  Get department and courses from request body
    const { department, courses } = await req.json();

    //  Determine if user is in a senior class
    const isSenior = ["ss1", "ss2", "ss3", "SS1", "SS2", "SS3"].includes(user.classId ?? "");

    // //  Require department if student is in senior secondary
    // if (isSenior && !department) {
    //   return NextResponse.json(
    //     { error: "Department is required for senior secondary students" },
    //     { status: 400 }
    //   );
    // }

    //  Courses array must be provided
    if (!Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json({ error: "Courses array is required" }, { status: 400 });
    }

    // Validate selected courses exist in the DB for the user's class and (if senior) department
    const validCourses = await Course.find({
      courseId: { $in: courses },
      classId: user.classId,
      ...(isSenior ? { department } : { department: null }),
    });

    //  Return error if any selected course is invalid
    if (validCourses.length !== courses.length) {
      return NextResponse.json(
        {
          error: "One or more selected courses are invalid or do not match your class/department",
        },
        { status: 400 }
      );
    }

    //  Save selected courses and department to user's record
    if (isSenior) user.department = department;
    user.courses = courses;

    await user.save();

    return NextResponse.json({ message: "Courses selected successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}







 // Returns list of available courses based on student's class and department
 
export async function GET() {
  const session = await getServerSession(authOptions);

  //  Ensure user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    //  Get current user
    const user = await User.findOne({ RegNo: session.user.RegNo });

    //  Ensure user is a student
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  Check if user is a senior student
    const isSenior = ["ss1", "ss2", "ss3", "Ss-1", "Ss-2", "Ss-3"].includes(user.classId ?? "");

    //  Find courses for user's class and department (null for junior)
    const courses = await Course.find({
      classId: user.classId,
      ...(isSenior ? { department: user.department } : { department: null }),
    }).select("-_id subject courseId classId department");

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(JSON.stringify({ message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
