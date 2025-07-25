'use client';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
export default function Commingsoon() {
      const router = useRouter();
    return(
        <div className='w-screen h-screen relative overflow-hidden'>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>
      <div className='text-8xl text-green-900 flex justify-center items-center'>
        THIS PAGE IS COMING SOON
      </div>
        </div>
    )
}
