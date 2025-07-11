
// This file defines the User model for a MongoDB database using Mongoose.
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
  // switchProfile: (profileIndex: number) => Promise<IUser> 
}


// const profileSchema = new Schema<Profile>({
//   profile: { type: String, required: true },
//   avatarUrl: { type: String, default: '' }
// }, { _id: false // Disable automatic _id generation for subdocuments
// })

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
  
  classId: {
    type: String,
    required: function (this: IUser) {
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

  // teacher: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  // students: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  //   }],


},
{timestamps: true}
);



const User = (models.User as mongoose.Model<IUser>) || model<IUser>('User', UserSchema);

export default User;
