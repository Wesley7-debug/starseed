import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import connectDb from "@/app/libs/ConnectDb";
import Course from "@/app/models/Course";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Define type for course query result
// interface CourseType {
//   subject: string;
//   classId: string;
//   department?: string;
// }

// interface StudentType {
//   name: string;
//   RegNo: string;
//   classId: string;
//   avatarUrl: string;
// }

// interface Params {
//   params: {
//     teacherId: string;
//   };
// }

export async function GET(req: NextRequest, { params }: { params: { teacherId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 402 });
  }

  const { teacherId } = params;
  const searchParams = req.nextUrl.searchParams;
  const courseQuery = searchParams.get("courses");

  try {
    await connectDb();

    if (!courseQuery) {
      const courses = await Course.find({ addedBy: teacherId }).lean();
      return NextResponse.json({ courses }, { status: 200 });
    }

    const requestedCourses = courseQuery
      .split(",")
      .map((c) => c.trim())
      .slice(0, 6);

  const courses = await Course.find({
  addedBy: teacherId,
  subject: { $in: requestedCourses },
})
  .lean()


    if (!courses.length) {
      return NextResponse.json({ error: "no matching courses" }, { status: 404 });
    }

    const allStudentResult = await Promise.all(
      courses.map(async (course) => {
        const isUniversal = ["french", "diction"].includes(course.subject.toLowerCase());

        const studentFilter:  Record<string, unknown> = {
          role: "student",
          courses: course.subject,
        };

        if (!isUniversal) {
          studentFilter.classId = { $regex: /^JSS|^SS/i };
        }

        if (course.department) {
          studentFilter.department = course.department;
        }

        const students = await User.find(studentFilter)
          .select("name RegNo classId avatarUrl")
          .lean();

        return {
          course: course.subject,
          classId: course.classId,
          department: course.department,
          students,
        };
      })
    );

    return NextResponse.json({ students: allStudentResult }, { status: 200 });
  } catch (e) {
    console.error("error in special courses GET", e);
    return new NextResponse("server error in special courses", { status: 500 });
  }
}
