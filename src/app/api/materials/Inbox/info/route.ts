// GET /api/inbox
import { getServerSession } from "next-auth";
import {  NextRequest, NextResponse } from "next/server";
import Material from "@/app/models/Material";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";



    //mark as read
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
try {
  const { materialId } = await req.json();

  await Material.updateOne(
    { _id: materialId },
    { $addToSet: { readBy: session.user.id } }
  );

  return NextResponse.json({ success: true });
}

 catch (error: unknown) {
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
 

//GET unread count of messages

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await Material.countDocuments({
    explicitUsers: session.user.id,
    readBy: { $ne: session.user.id },
    expiresAt: { $gt: new Date() },
  });

  return NextResponse.json({ count });
}