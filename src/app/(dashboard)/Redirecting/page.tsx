import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RedirectingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/Login");
  }

  const role = session.user?.role;

  if (role === "admin") redirect("/Admin");
  if (role === "teacher") redirect("/Teacher");
  if (role === "student") redirect("/Student");

  redirect("/Login");
}
