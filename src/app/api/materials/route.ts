import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import Material from "@/app/models/Material";
import User from "@/app/models/User";
import  { IUserWithRole } from "@/app/models/Material"; // import the type explicitly
import connectDb from "@/app/libs/ConnectDb";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  if (!session) {
    console.warn("Unauthorized request: No session found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const body = await req.json();
    console.log("Request body:", body);

    const { title, content, targetRoles = [], explicitUsers = [], expiresAt } = body;

    if (!title || !content) {
      console.warn("Validation error: Title or content missing");
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const userDoc = await User.findById(session.user.id);
    console.log("Fetched userDoc:", userDoc);

    if (!userDoc) {
      console.warn("User not found with ID:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const me = userDoc.toObject() as IUserWithRole & { classId?: string };
    console.log("Parsed user object:", me);

    let finalExplicitUsers = explicitUsers;

    if (me.role === 'teacher') {
      console.log("User is teacher. Fetching students in class:", me.classId);
      const students = await User.find({ role: 'student', classId: me.classId });
      const studentIds = students.map(s => s._id.toString());
      console.log("Found student IDs:", studentIds);

      finalExplicitUsers = finalExplicitUsers.filter(id => studentIds.includes(id));
      console.log("Filtered explicitUsers for teacher:", finalExplicitUsers);

      if (finalExplicitUsers.length === 0) {
        console.warn("No valid student recipients after filtering");
        return NextResponse.json({ error: "No valid student recipients found" }, { status: 400 });
      }
    }

    const materialPayload = {
      creator: me,
      title,
      content,
      targetRoles: me.role === "admin" ? targetRoles : [],
      explicitUsers: me.role === "admin" ? explicitUsers : finalExplicitUsers,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    };

    console.log("Creating material with payload:", materialPayload);

    const material = await Material.createAndFanOut(materialPayload);

    console.log("Material created successfully:", material);

    return NextResponse.json(material, { status: 201 });

  } catch (error: unknown) {
    console.error("Error in POST /api/materials:", error);

    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }

    return new NextResponse(
      JSON.stringify({ message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}






export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb()
const materials = await Material.find({ createdBy: session.user.id })
  .sort({ createdAt: -1 })
  .lean();

    return NextResponse.json(materials, { status: 200 });
  } catch (error: unknown) {
    let message = "Internal Server Error";
  
    if (error instanceof Error) {
      message = error.message;
    }
  
    return new NextResponse(
      JSON.stringify({ message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
