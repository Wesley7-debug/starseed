import connectDb from "@/app/libs/ConnectDb";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";

//import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

interface RequestWithUrl extends Request {
  url: string; // for URL parsing in GET handler
}


export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);

  // If there's no session, return unauthorized
  if (!session) {
    return NextResponse.json(
      { message: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { name, RegNo, classId, role } = await req.json();

    // Check for required fields
    if (!name || !RegNo || !role) {
      return NextResponse.json(
        { message: "all fields must be available" },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if RegNo already exists
    const existing = await User.findOne({ RegNo });
    if (existing) {
      return NextResponse.json(
        { message: "RegNo already exists" },
        { status: 409 }
      );
    }

    // Teacher registering a student
    if (session.user.role === "teacher") {
      if (role !== "student") {
        return NextResponse.json(
          { message: "teachers can only register students" },
          { status: 403 }
        );
      }

      const student = await User.create({
        name,
        RegNo,
        role: "student",
        classId: session.user.classId, // force their own classId
      });

      return NextResponse.json(
        { message: "user created", student },
        { status: 201 }
      );
    }

    // Admin registering any role
    if (session.user.role === "admin") {
      if ((role === "teacher" || role === "student") && !classId) {
        return NextResponse.json(
          { message: "classId is required for students and teachers" },
          { status: 400 }
        );
      }

      const user = await User.create({
        name,
        RegNo,
        role,
        classId: role === "admin" ? undefined : classId,
      });

      return NextResponse.json(
        { message: "user created", user },
        { status: 201 }
      );
    }

    // If session user is neither teacher nor admin
    return NextResponse.json(
      { message: "unauthorized role" },
      { status: 403 }
    );
  }  catch (error: unknown) {
  console.error("Registration error:", error);
  return NextResponse.json(
    {
      message: "error occurred",
      error: error?.message || "Unknown error",
      details: error?.errors || null
    },
    { status: 500 }
  );
}
}


// GET handler - to fetch users with optional filtering
export async function GET(req: RequestWithUrl): Promise<Response> {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get("role") ?? undefined;
    const classId = url.searchParams.get("classId") ?? undefined;

    const filter: Record<string, string> = {};

    if (role) filter.role = role;
    if (classId) filter.classId = classId;

    await connectDb();

    const users = await User.find(filter);

    return NextResponse.json(
      { data: users, message: "found all" },
      { status: 200 }
    );
  } catch (error: unknown) {
  console.error("Registration error:", error);
  return NextResponse.json(
    {
      message: "error occurred",
      error: error?.message || "Unknown error",
      details: error?.errors || null
    },
    { status: 500 }
  );
}
}

