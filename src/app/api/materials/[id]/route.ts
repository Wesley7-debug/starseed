import Material from "@/app/models/Material";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import User from "@/app/models/User";
import connectDb from "@/app/libs/ConnectDb";

export async function PUT (req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
try {
    await connectDb();
    if (!params.id) {
        return NextResponse.json({ error: "Material ID is required" }, { status: 400 });
    }
     const {body} = await req.json()
    if (!body) {
        return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }
    if (typeof params.id !== 'string') {
        return NextResponse.json({ error: "Invalid Material ID" }, { status: 400 });
    }
     const userDoc = await User.findById(session.user.id);
    if (!userDoc) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const material = await Material.findByIdAndUpdate(
        params.id,
        {...body, updatedBy: userDoc._id },
        { new: true }
    );

    if (!material) {
        return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    return NextResponse.json(material, { status: 200 });
}
 catch (err
 ) {
    return NextResponse.json({ error: "Invalid request", err }, { status: 400 });

}
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try{
        await connectDb();
        if (!params.id) {
            return NextResponse.json({ error: "Material ID is required" }, { status: 400 });
        };
        if (typeof params.id !== 'string') {
            return NextResponse.json({ error: "Invalid Material ID" }, { status: 400 });
        }
        const userDoc = await User.findById(session.user.id);
        if (!userDoc) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        } ;

        const deleteMaterial = Material.findByIdAndDelete(params.id);

    if(!deleteMaterial){
          return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({message :'materials deleted'}, { status: 200 });
}
 catch (err
 ) {
    return NextResponse.json({ error: "Invalid request", err }, { status: 400 });

}
    
}
   