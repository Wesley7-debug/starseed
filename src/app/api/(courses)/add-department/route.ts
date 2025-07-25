
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { NextResponse,NextRequest } from 'next/server';
import connectDb from '@/app/libs/ConnectDb';
import User from '@/app/models/User';


export async function PATCH(req:NextRequest ) {

  const session = await getServerSession( authOptions);

  if (!session) {
    return NextResponse.json ( { message: 'Unauthorized' } ,{status:401});
  }

const body = await req.json();
const department = body.department;


  if (!department || !['science', 'arts'].includes(department)) {
      return NextResponse.json ( { error: 'Invalid or missing department' } ,{status:400})
 
  }

  try {
    await connectDb();

    const user = await User.findOne({ RegNo: session.user.RegNo });

    if (!user || user.role !== 'student') {
      return NextResponse.json ( { message: 'Unauthorized' } ,{status:401});
    }

    // If user already has a department, do NOT allow change
    if (user.department) {
    return NextResponse.json ( {  error: 'Department already set and cannot be changed'  } ,{status:403});
      
    }

    user.department = department;
    await user.save();

    return   NextResponse.json ( { message: 'Department updated successfully' } ,{status:200});
   
  } catch (error: unknown) {
    console.log('error', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json ( { message: message } ,{status:500});
   
  }
}
