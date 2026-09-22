import mongoose from "mongoose";
import { model, models, Schema } from "mongoose";

 interface ICourse extends Document {
    subject: string
department:string
classId:string
courseId:string
addedBy:  Schema.Types.ObjectId
 expiresAt:Date
}

const courseSchema = new Schema<ICourse>(
    {
 subject: { type: String, required: true },
 department:{type:String, enum:['science', 'arts', null], 
    default:null},
 classId:{type:String, required:true},
 courseId:{type: String, unique:true},
 addedBy: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
 expiresAt: {
  type: Date,
  default: () => new Date(Date.now() + 96 * 24 * 60 * 60 * 1000),
}

},
{timestamps:true})

courseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export default models.Course || model('Course', courseSchema)
