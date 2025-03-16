"use client";

import { useState } from "react";
import { auth } from "../firebaseConfig"; // Adjust the path as needed
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (mode === "login") {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Logged in successfully!");
      } catch (err: any) {
        setError(err.message);
      }
    } else if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Account created successfully!");
      } catch (err: any) {
        setError(err.message);
      }
    } else if (mode === "forgot") {
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent!");
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-stone-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#D13523]">
          {mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Forgot Password"}
        </h2>
        {error && (
          <div className="mb-4 text-center text-red-500">{error}</div>
        )}
        {message && (
          <div className="mb-4 text-center text-green-500">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-stone-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-[#D13523]"
            />
          </div>
          {(mode === "login" || mode === "signup") && (
            <div>
              <label className="block text-stone-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-[#D13523]"
              />
            </div>
          )}
          {mode === "signup" && (
            <div>
              <label className="block text-stone-700">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-[#D13523]"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#D13523] text-white rounded-full font-medium hover:bg-[#FF8A7E] transition-all duration-300"
          >
            {mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Sign Up"
              : "Reset Password"}
          </button>
        </form>
        <div className="mt-6 flex justify-between">
          {mode !== "login" && (
            <button
              onClick={() => setMode("login")}
              className="text-sm text-[#D13523] hover:underline"
            >
              Back to Login
            </button>
          )}
          {mode === "login" && (
            <>
              <button
                onClick={() => setMode("forgot")}
                className="text-sm text-[#D13523] hover:underline"
              >
                Forgot Password?
              </button>
              <button
                onClick={() => setMode("signup")}
                className="text-sm text-[#D13523] hover:underline"
              >
                Create Account
              </button>
            </>
          )}
          {mode === "signup" && (
            <button
              onClick={() => setMode("login")}
              className="text-sm text-[#D13523] hover:underline"
            >
              Already have an account?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
