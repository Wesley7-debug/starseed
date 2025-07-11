import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import Material from "@/app/models/Material";
import User from "@/app/models/User";
import  { IUserWithRole } from "@/app/models/Material"; // import the type explicitly

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
         const { title, content, targetRoles = [], explicitUsers = [], expiresAt } = await req.json();
    if (!title || !content) {
        return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const userDoc = await User.findById(session.user.id);
    if (!userDoc) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const me = userDoc.toObject() as IUserWithRole & { classId?: string };

    let finalExplicitUsers = explicitUsers;

    if (me.role === 'teacher') {
        // Teachers cannot target roles, only students in their class
const students = await User.find({ role: 'student', classId: me.classId });
const studentIds = students.map(s => s._id.toString());


        finalExplicitUsers = finalExplicitUsers.filter(id => studentIds.includes(id));
        if (finalExplicitUsers.length === 0) {
            return NextResponse.json({ error: "No valid student recipients found" }, { status: 400 });
        }
    }

    const material = await Material.createAndFanOut({
        creator: me,
        title,
        content,
        targetRoles: me.role === "admin" ? targetRoles : [],
        explicitUsers: me.role === "admin" ? explicitUsers : finalExplicitUsers,
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    });

    return NextResponse.json(material, { status: 201 });
    }  catch (error: unknown) {
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
    const materials = await Material.find({ "creator._id": session.user.id })
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
