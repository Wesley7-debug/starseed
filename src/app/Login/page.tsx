"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { redirect } from "next/navigation";
import { addUserToSaved } from "../libs/SavedUser";

export default function Login() {
  const [RegNo, setRegNo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      RegNo,
      redirect: false,
     
    });
        // Check if signIn was successful
    if (res?.ok) {
         const user = await fetch('/api/auth/me').then(data => data.json())
      if(user?.role === 'student'){

  //saves students to local storage
        addUserToSaved({
          RegNo: user.RegNo,
          name: user.name,
          avatarUrl: user.avatarUrl
        });
 // console.log(`Attempted to save student: ${user.RegNo}`);
      }
      setLoading(false);
      redirect('/Redirecting');
    }

if(res?.error) {
      setError("Invalid Registration Number ");
      setLoading(false);
}

  }

  return (
    <div className="h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl w-full">
        {/* Left */}
        <div className="space-y-6 max-w-md text-center md:text-left w-full">
          <img
            src="/images/logo.png"
            className="w-32 mx-auto md:mx-0"
            alt="starseed"
          />
          <h1 className="text-4xl font-bold text-gray-900">ISSA</h1>
          <p className="text-gray-600 text-sm">
            Login and use your student dashboard made for you
          </p>
        </div>

        {/* Right */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm border p-6 rounded-md shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2">Sign in to Star Seed</h2>
          <p className="text-sm text-gray-500 mb-6">
            Welcome back! Please sign in to continue
          </p>

          <Input className='text-gray-900 shadow-md'
            type="text"
            placeholder="Registration Number"
            value={RegNo}
            onChange={(e) => setRegNo(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-700 text-start mt-2 mb-4">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full flex gap-2 justify-center mb-4 mt-3"
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            Sign In
          </Button>

          <p className="text-sm text-center text-black">
            Don’t have an account?{" "}
            <Link href="/" className="text-red-500 underline">
              Click here
            </Link>
          </p>

          <div className="text-xs text-center text-gray-400 mt-4">
            <span className="font-semibold">All rights reserved</span>
          </div>
        </form>
      </div>
    </div>
  );
};


