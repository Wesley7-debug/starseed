import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import Material, { IMaterial } from "@/app/models/Material";
import User from "@/app/models/User";
import { Types, FilterQuery } from "mongoose";

//gets all materials
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch full user document with lean()
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { role, classId } = user;

    // ⚠ Convert user._id to ObjectId explicitly
    const userObjectId = new Types.ObjectId(user._id as unknown as string);

    //  Properly typed filter using FilterQuery<IMaterial>
    const filter: FilterQuery<IMaterial> = {
      expiresAt: { $gt: new Date() },
      $or: [
        { targetUsers: userObjectId },
        ...(role === "student" && classId
          ? [{ targetRoles: "student", classId }]
          : role === "teacher"
          ? [{ targetRoles: "teacher" }]
          : []),
      ],
    };

    const materials = await Material.find(filter)
      .sort({ createdAt: -1 })
      .lean() || [];

    const formatted = materials.map((m) => ({
      ...m,
      read: m.readBy?.map((id) => String(id)).includes(String(user._id)) ?? false,
    }));

    return NextResponse.json(formatted);
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
