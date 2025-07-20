import connectDb from "@/app/libs/ConnectDb";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const isAdmin = session.user?.role === "admin";
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDb();

    const { updates } = await req.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ message: "Invalid updates payload" }, { status: 400 });
    }

    const bulkOps = updates.map(({ id, newClassId }: { id: string; newClassId: string }) => ({
      updateOne: {
        filter: { _id: id, role: "student" },
        update: { $set: { classId: newClassId } },
      },
    }));

    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: "Demotion successful" });
  } catch (error) {
    console.error("Demotion error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
