import mongoose, { Document, Types, Schema, Model, models, model } from "mongoose";
import User, { Role } from "./User";


const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000;
// Interface for the MongoDB document
 interface IMaterial extends Document {
    title: string;
    content: string;
    classId?: string; 
    createdBy?: Types.ObjectId;
    targetRoles?: Role[];
    targetUsers?: Types.ObjectId[];
    readBy?: Types.ObjectId[];
    expiresAt?: Date;
}

// For functions that deal with material creation
export interface IUserWithRole {
    _id: Types.ObjectId;
    role: Role;
    classId?: string;
    // add other User fields as needed
}

interface CreateFanOut {
    creator: IUserWithRole;
    title: string;
    content: string;
    targetRoles?: Role[];
    explicitUsers?: Types.ObjectId[];
    expiresAt?: Date;
}

// Define the MaterialModel type
interface MaterialModel extends Model<IMaterial> {
    createAndFanOut(args: CreateFanOut): Promise<IMaterial>;
}

// Define the schema
const materialSchema = new Schema<IMaterial>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        classId: { type: String },
        targetRoles: {
            type: [String],
            enum: ["student", "teacher"],
            default: ["student"],
        },
        targetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
        expiresAt: { type: Date, default: Date.now() + SIXTY_DAYS },
    },
    {
        timestamps: true,
    }
);

//creates and calc reciepient

materialSchema.statics.createAndFanOut = async function ({
    creator,
    title,
    content,
    targetRoles = [],
    explicitUsers = [],
    expiresAt
}: CreateFanOut) {
    const reciepients = new Set<string>(explicitUsers.map(String));


    //1. teacher and student in same class
    if(creator?.role === 'teacher'){
        const sameClassStudents = await User.find({
            role: 'student',
            classId: creator.classId
        }).select('_id');
        sameClassStudents.forEach(u => reciepients.add(String(u._id)))}

        if(creator?.role ==='admin' && targetRoles.length){
            const byRole = await User.find({role : {$in: targetRoles}}).select('_id');
            byRole.forEach(u => reciepients.add(String(u._id)));
        }





        //clean

        reciepients.delete(String(creator?._id));

        const resolvedExpiry  = expiresAt ?? (expiresAt ? new Date(Date.now() + SIXTY_DAYS) : undefined);

        return this.create({
            title,
            content,
            createdBy: creator!._id,
            classId: creator?.classId,
            targetRoles,
            targetUsers: [...reciepients].map(id => new mongoose.Types.ObjectId(id)) as Types.ObjectId[],
            ...(resolvedExpiry && { expiresAt: resolvedExpiry }),
        })

    };

    materialSchema.index({targetUsers:1, createdAt: -1});
    materialSchema.index({targetUsers:1, readBy: 1});

// Export the model (avoid re-defining if it already exists)
const Material = (models.Material as MaterialModel) || model<IMaterial, MaterialModel>("Material", materialSchema);

export default Material;
export type { IMaterial, CreateFanOut };
 