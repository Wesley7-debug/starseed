
import mongoose, { Schema, Document, model, Types, models } from 'mongoose'


export type Role = 'student' | 'teacher' | 'admin'
export interface IUser extends Document {
  name: string
  role: Role
  RegNo: string
  classId?: string
  teacher: Types.ObjectId;
  students: Types.ObjectId[];
  department:string
  courses:string[]
  avatarUrl:string

}


const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  
  RegNo: {
    type: String,
    required: true,
    unique: true,
  },
  avatarUrl: { type: String},
  classId: {
    type: String,
    required: function () {
      return this.role === 'student' || this.role === 'teacher'
    },
  },
   department:{type:String,
     enum:['science', 'art', null], 
    default:null, 
   },

courses: {
  type: [String],
  default: [],
},


},
{timestamps: true}
);



const User = (models.User as mongoose.Model<IUser>) || model<IUser>('User', UserSchema);

export default User;
