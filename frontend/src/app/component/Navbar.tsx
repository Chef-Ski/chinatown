"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar = () => {
  const path = usePathname();

  // Hide the navbar for any route that starts with "/explore"
  if (path?.startsWith('/explore')) {
    return null;
  }

  return (
    <div className="w-full absolute">
      <div className="sticky top-0">
        <ul className="flex flex-row items-center justify-between px-12">
          <div className="flex flex-row items-center gap-x-12 text-xl">
            <a href="/">
              <img src="/postcss.config.png" alt="home logo" className="w-36 h-auto" />
            </a>
            <li>CREATE</li>
            <li>EXPLORE</li>
          </div>

          <div className="flex flex-row items-center gap-x-6 text-xl text-black">
            <a href="">
              <li className="border-2 border-black rounded-2xl px-8 py-2 backdrop-blur-lg hover:bg-gray-300">
                Login
              </li>
            </a>
            <a href="">
              <li className="border-2 border-black rounded-2xl px-8 py-2 hover:bg-gray-300 backdrop-blur-lg">
                Sign Up
              </li>
            </a>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
