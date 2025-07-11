
import { useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function useClientAuth() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/Login";
    },
  });

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) router.push("/Login");
  }, [session, status, router]);

  return { session, status };
}
