"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { auth } from "../firebaseConfig"; // Adjust the path as needed
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const path = usePathname();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Adjust absolute positioning for explore pages
    const removeAbs = document.querySelector(".removeAbsolute");
    if (path?.startsWith("/explore")) {
      removeAbs?.classList.remove("fixed");
      removeAbs?.classList.add("relative");
    }
  }, [path]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-full fixed top-0 z-50 removeAbsolute">
      <div className="sticky top-0">
        <ul className="flex flex-row items-center justify-between px-6 bg-[#D13523]">
          <div className="flex flex-row items-center gap-x-6 text-lg text-white">
            <a href="/">
              <img src="/postcss.config.png" alt="home logo" className="w-16 h-auto" />
            </a>
            <li className="text-lg text-white">
              <a href="/create">CREATE</a>
            </li>
            <li className="text-lg text-white">
              <a href="/explore">EXPLORE</a>
            </li>
          </div>

          <div className="flex flex-row items-center gap-x-4 text-lg text-white">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#D13523] hover:bg-[#FF8A7E] transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-stone-200 z-50">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/auth?mode=login">
                  <li className="text-lg uppercase text-white px-4 py-1 border border-white rounded-lg hover:bg-[#FF5A7E]">
                    Login
                  </li>
                </a>
                <a href="/auth?mode=signup">
                  <li className="text-lg uppercase text-white px-4 py-1 border border-white rounded-lg hover:bg-[#FF5A7E]">
                    Sign Up
                  </li>
                </a>
              </>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
