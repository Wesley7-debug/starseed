import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"
import {  Role } from "../models/User"


declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string
      classId?: string
      role: Role
      RegNo: string
    
    
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    name?: string
    classId?: string
    role: Role
    RegNo: string

  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
   role: Role
    classId?: string
    RegNo?: string

  }
}
