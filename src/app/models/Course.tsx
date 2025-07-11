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
 department:{type:String, enum:['science', 'art', null], 
    default:null,
validate:{
    validator: function(value) {
        //required department for ss1-3
        const ssClasses =['ss1', 'ss2', 'ss3', 'SS1', 'SS2', 'SS3'];
        if(ssClasses.includes(this.classId)){
            return value === 'science' || value === 'art'
        }
        return value === null || value === undefined ;
    },
    message: function(){
  return 'department is required for only(ss1-3) students'
}
},
},
 classId:{type:String, required:true},
 courseId:{type: String, unique:true},
 addedBy: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true}
},
{timestamps:true})

export default models.Course || model('Course', courseSchema)