"use client"; // Needed for animations in Next.js app/router

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {


  return (


    <div>
      <div className="initialbg h-screen">
        <div className="flex flex-col items-center justify-center h-screen gap-y-20 ">
          <h2 className="mt-36  text-9xl font-extrabold uppercase">Story Vault</h2>
          <h1 className="text-[#D13523] text-center max-w-5xl  uppercase text-6xl font-bold px-8">Preserving stories, bridging generations</h1>
          <div className="w-full flex justify-center items-center mt-36">

          <div className="relative inline-flex  group">
            <div
              className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-black  to-black rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
            </div>
            <a href="#" title="Get quote now"
              className="relative inline-flex items-center justify-center px-12
             py-6 font-bold text-white text-2xl transition-all duration-200 bg-[#D13523] font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              role="button">Start Now
            </a>
          </div>
        </div>
        </div>
        
      </div>

      <div className="flex flex-row items-center justify-center gap-x-8 mt-96 px-12">
        <div className="flex flex-col items-start text-5xl font-bold max-w-2xl">
          <h2 className="">Who We Are</h2>
          <hr className="text-black border-4 border-black w-full" />
          <p className="text-2xl font-normal pt-8">We are a team dedicated to preserving the rich cultural heritage of Chinatown by leveraging technology to bridge language barriers and connect generations. Our app helps families save and share stories across language divides, offering a platform where spoken memories can be translated and heard aloud in a different voice. Through this innovative tool, we aim to ensure that the wisdom and traditions of Chinatown are passed down, creating a lasting legacy for future generations.</p>
          <a href="#_" className="relative inline-flex mt-8 items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-2xl text-black transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-200 group">
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#D13523] group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Try it out</span>
          </a>

        </div>
        <div>
          <img src="/img1.png" alt="" />
        </div>
      </div>

      <div className="flex flex-row-reverse items-center justify-center gap-x-8 mt-96 px-12">
        <div className="flex flex-col text-right items-end text-5xl font-bold max-w-2xl">
          <h2 className="">Who We Are</h2>
          <hr className="text-black border-4 border-black w-full" />
          <p className="text-2xl font-normal pt-8 ">We are a team dedicated to preserving the rich cultural heritage of Chinatown by leveraging technology to bridge language barriers and connect generations. Our app helps families save and share stories across language divides, offering a platform where spoken memories can be translated and heard aloud in a different voice. Through this innovative tool, we aim to ensure that the wisdom and traditions of Chinatown are passed down, creating a lasting legacy for future generations.</p>
          <a href="#_" className="relative inline-flex mt-8 items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-2xl text-black transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-200 group">
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#D13523] group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Try it out</span>
          </a>

        </div>
        <div>
          <img src="/img1.png" alt="" />
        </div>
      </div>
    </div>
  );
}
