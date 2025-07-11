import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/authOptions";

export async function GET() {

  // But for a quick fix, you can do something like this:

  const session = await getServerSession(authOptions); // (This might not work correctly without passing request details)

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify(session.user), { status: 200, headers: { "Content-Type": "application/json" } });
}
