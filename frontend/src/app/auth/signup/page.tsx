"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/explore");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-stone-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#D13523]">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#D13523]"
            required
          />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#D13523]"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full py-3 bg-[#D13523] text-white rounded-full font-medium hover:bg-[#FF8A7E] transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 flex justify-center">
          <span className="text-sm text-stone-700 mr-2">Already have an account?</span>
          <a href="/auth/login" className="text-sm text-[#D13523] hover:underline">Log In</a>
        </div>
      </div>
    </div>
  );
}
