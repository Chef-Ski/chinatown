import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-y-20">
        <h2 className="mt-36  text-9xl font-extrabold uppercase">Story Vault</h2>
        <h1 className="text-[#D13523] text-center max-w-5xl  uppercase text-6xl font-bold px-8">Preserving stories, bridging generations</h1>
      </div>
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
  );
}
