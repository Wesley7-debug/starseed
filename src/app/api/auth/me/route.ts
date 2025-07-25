import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/authOptions';
import connectDb from '@/app/libs/ConnectDb';
import User from '@/app/models/User';
import Course from '@/app/models/Course';


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await connectDb()
    const userId = session.user.id;

    // Find user by ID and populate course IDs (optional)
    const user = await User.findById(userId).lean();

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch full course details if the user has course IDs
    const courses =
      user.courses?.length > 0
        ? await Course.find({ _id: { $in: user.courses } }).lean()
        : [];

    return new Response(
      JSON.stringify({ user, courses }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
