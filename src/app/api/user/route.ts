import connectDb from "@/lib/ConnectDb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

interface RequestWithUrl extends Request {
  url: string;
}

export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, RegNo, classId, role } = await req.json();

    if (!name || !RegNo || !role) {
      return NextResponse.json(
        { success: false, message: "All fields must be provided" },
        { status: 400 }
      );
    }

    await connectDb();

    const existing = await User.findOne({ RegNo });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Registration number already exists" },
        { status: 409 }
      );
    }

    if (session.user.role === "teacher") {
      if (role !== "student") {
        return NextResponse.json(
          { success: false, message: "Teachers can only register students" },
          { status: 403 }
        );
      }

      const student = await User.create({
        name,
        RegNo,
        role: "student",
        classId: session.user.classId,
      });

      return NextResponse.json({ success: true, message: "User created", user: student }, { status: 201 });
    }

    if (session.user.role === "admin") {
      if ((role === "teacher" || role === "student") && !classId) {
        return NextResponse.json(
          { success: false, message: "Class ID is required for students and teachers" },
          { status: 400 }
        );
      }

      const user = await User.create({
        name,
        RegNo,
        role,
        classId: role === "admin" ? undefined : classId,
      });

      return NextResponse.json({ success: true, message: "User created", user }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: "Unauthorized role" }, { status: 403 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

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

    return NextResponse.json({ success: true, data: users, message: "Found users" }, { status: 200 });
  } catch (error) {
    console.error("Error getting users:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
