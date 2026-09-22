import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import Material from "@/models/Material";
import User from "@/models/User";
import { IUserWithRole } from "@/models/Material";
import connectDb from "@/lib/ConnectDb";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const body = await req.json();

    const { title, content, targetRoles = [], expiresAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const userDoc = await User.findById(session.user.id).lean();
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const me = userDoc as unknown as IUserWithRole & { classId?: string };

    const material = await Material.createAndFanOut({
      creator: me,
      title,
      content,
      targetRoles: me.role === "admin" ? targetRoles : [],
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();

    const materials = await Material.find({ createdBy: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(materials, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
