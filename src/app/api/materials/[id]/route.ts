import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import connectDb from "@/app/libs/ConnectDb";
import Material from "@/app/models/Material";
import User from "@/app/models/User";

// PATCH: Update a material
export async function PATCH(req: NextRequest,  context:{ params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

      const params = await context.params;  // Await params here
    const { id } = params;

    if (!id || typeof id !== "string") {
        return NextResponse.json({ error: "Invalid material ID" }, { status: 400 });
    }

    try {
        await connectDb();

        const body = await req.json();
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const userDoc = await User.findById(session.user.id);
        if (!userDoc) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedMaterial = await Material.findByIdAndUpdate(
            id,
            { ...body, updatedBy: userDoc._id },
            { new: true }
        );

        if (!updatedMaterial) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 });
        }

        return NextResponse.json(updatedMaterial, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Failed to update material", details: err }, { status: 500 });
    }
}

// DELETE: Delete a material
export async function DELETE(req: NextRequest,   context:{ params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

      const params = await context.params;  // Await params here
    const { id } = params;

    if (!id || typeof id !== "string") {
        return NextResponse.json({ error: "Invalid material ID" }, { status: 400 });
    }

    try {
        await connectDb();

        const userDoc = await User.findById(session.user.id);
        if (!userDoc) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const deletedMaterial = await Material.findByIdAndDelete(id);
        if (!deletedMaterial) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Material deleted successfully" }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Failed to delete material", details: err }, { status: 500 });
    }
}
