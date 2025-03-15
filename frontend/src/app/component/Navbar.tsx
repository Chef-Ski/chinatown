"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar = () => {
<<<<<<< HEAD
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
=======
    return (
        <div className='w-full absolute top-4  flex justify-center'>
            <ul className='flex flex-row sticky items-center px-12 justify-between border backdrop-blur-lg w-[1200px] border-black rounded-2xl'>
                <div className='flex flex-row items-center gap-x-12 text-xl'>
                    <a href="/"><img src="/postcss.config.png" alt="home logo" className='w-24 h-auto' /></a>
                    <a href="/create"><li className='hover:text-[#D13523]'>CREATE</li></a>
                    <a href="/explore"><li className='hover:text-[#D13523]'>EXPLORE</li></a>
                </div>

                <div className='flex flex-row items-center gap-x-6 text-xl text-black'>
                    <a href=""><li className='border border-black rounded-2xl px-8 py-2  hover:bg-gray-300'>Login</li></a>
                    <a href=""><li className='border border-black rounded-2xl px-8 py-2 hover:bg-gray-300 '>Sign Up</li></a>
                </div>

            </ul>
>>>>>>> c0a17ca7cc1f1a5b55186abb61831284ab9b21a7

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
