import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import connectDb from "@/app/libs/ConnectDb";
import User from "@/app/models/User"; // Make sure your User model path is correct

export async function PUT(req: NextRequest) {
  // Get session from request (await needed)
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const data = await req.json();

    // Validate data is an object and not empty
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to DB
    await connectDb();

    const userId = session.user.id;
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "User ID not found in session" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update user document and return new one
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User updated successfully", user: updatedUser }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
