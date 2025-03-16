"use client";

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const Navbar = () => {
  const path = usePathname();

  useEffect(() => {
    // Run this only on the client after mount.
    const removeAbs = document.querySelector(".removeAbsolute");
    if (path?.startsWith('/explore')) {
      removeAbs?.classList.remove("fixed");
      removeAbs?.classList.add("relative");
    }
  }, [path]);

  return (
    <div className="w-full fixed top-0 z-50 removeAbsolute">
      <div className="sticky top-0">
        <ul className="flex flex-row items-center justify-between px-6 py-2 bg-[#D13523]">
          <div className="flex flex-row items-center gap-x-6 text-lg text-white">
            <a href="/">
              <img src="/postcss.config.png" alt="home logo" className="w-20 h-auto" />
            </a>
            <li className="text-lg text-white">
              <a href="/create">CREATE</a>
            </li>
            <li className="text-lg text-white">
              <a href="/explore">EXPLORE</a>
            </li>
          </div>

          <div className="flex flex-row items-center gap-x-4 text-lg text-white">
            <a href="">
              <li className="text-lg uppercase text-white px-4 py-1 border border-white rounded-lg hover:bg-[#FF5A41]">
                Login
              </li>
            </a>
            <a href="">
              <li className="text-lg text-white px-4 py-1 border border-white rounded-lg hover:bg-[#FF5A41] uppercase">
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
