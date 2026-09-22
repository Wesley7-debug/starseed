import connectDb from "@/lib/ConnectDb";
import User from "@/models/User";

export async function PATCH(request: Request): Promise<Response> {
  const { name, RegNo, classId, role } = await request.json();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id || typeof id !== "string") {
    return new Response(JSON.stringify({ success: false, message: "Invalid ID" }), { status: 400 });
  }
  if (!name || !RegNo || !role) {
    return new Response(
      JSON.stringify({ success: false, message: "Name, RegNo, and role are required" }),
      { status: 400 }
    );
  }

  try {
    await connectDb();
    const user = await User.findByIdAndUpdate(id, { name, RegNo, classId, role }, { new: true });

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "User updated successfully", user }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id || typeof id !== "string") {
    return new Response(JSON.stringify({ success: false, message: "Invalid ID" }), { status: 400 });
  }

  try {
    await connectDb();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "User deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
  }
}
