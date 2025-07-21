import mongoose from "mongoose";
import { model, models, Schema } from "mongoose";

 interface ICourse extends Document {
    subject: string
department:string
classId:string
courseId:string
addedBy:  Schema.Types.ObjectId
}

const courseSchema = new Schema<ICourse>(
    {
 subject: { type: String, required: true },
 department:{type:String, enum:['science', 'arts', null], 
    default:null},
 classId:{type:String, required:true},
 courseId:{type: String, unique:true},
 addedBy: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true}
},
{timestamps:true})

export default models.Course || model('Course', courseSchema)