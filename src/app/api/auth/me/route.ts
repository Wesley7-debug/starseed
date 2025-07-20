import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/authOptions";

export async function GET() {


  const session = await getServerSession(authOptions); 
  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
const user = session.user
  return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
}
