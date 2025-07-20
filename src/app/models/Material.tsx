import mongoose, { Document, Schema, model, models, Types, Model } from "mongoose";
import User, { Role } from "./User";

const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000;

// Interface for MongoDB document
interface IMaterial extends Document {
  title: string;
  content: string;
  classId?: string;
  createdBy: Types.ObjectId;
  targetRoles?: Role[];
  targetUsers?: Types.ObjectId[];
  expiresAt?: Date;
}

// Interface for user creating material
export interface IUserWithRole {
  _id: Types.ObjectId;
  role: Role;
  classId?: string;
}

// Interface for material creation input
interface CreateFanOut {
  creator: IUserWithRole;
  title: string;
  content: string;
  targetRoles?: Role[];
  explicitUsers?: Types.ObjectId[];
  expiresAt?: Date;
}

// Define MaterialModel static methods
interface MaterialModel extends Model<IMaterial> {
  createAndFanOut(args: CreateFanOut): Promise<IMaterial>;
}

// Define schema
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



    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + SIXTY_DAYS),
    },
  },
  { timestamps: true }
);

// Static method: create material and fan out to target users
materialSchema.statics.createAndFanOut = async function ({
  creator,
  title,
  content,
  targetRoles = [],
  explicitUsers = [],
  expiresAt,
}: CreateFanOut) {
  const recipients = new Set<string>(explicitUsers.map(String));

  // Teacher: get students in the same class
  if (creator.role === "teacher") {
    const sameClassStudents = await User.find({
      role: "student",
      classId: creator.classId,
    }).select("_id");

    sameClassStudents.forEach((u) => recipients.add(String(u._id)));
  }

  // Admin: add users by targetRoles
  if (creator.role === "admin" && targetRoles.length > 0) {
    const byRole = await User.find({ role: { $in: targetRoles } }).select("_id");
    byRole.forEach((u) => recipients.add(String(u._id)));
  }

  // Remove self from recipients
  recipients.delete(String(creator._id));

  const resolvedExpiry = expiresAt ?? new Date(Date.now() + SIXTY_DAYS);

  return this.create({
    title,
    content,
    createdBy: creator._id,
    classId: creator.classId,
    targetRoles,
    targetUsers: Array.from(recipients).map((id) => new mongoose.Types.ObjectId(id)),
    expiresAt: resolvedExpiry,
  });
};

//
//  Safe Indexes (no parallel arrays)
//

materialSchema.index({ targetUsers: 1 });                      // Index by user
materialSchema.index({ createdAt: -1 });                       // For ordering              // Optional
materialSchema.index({ createdBy: 1, createdAt: -1 });         // Admin/teacher dashboards
materialSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL for expiry

// Export model
const Material =
  (models.Material as MaterialModel) ||
  model<IMaterial, MaterialModel>("Material", materialSchema);

export default Material;
export type { IMaterial, CreateFanOut };
