import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MissionSection = () => {
  const leftContentRef = useRef(null);
  const rightImageRef = useRef(null);

  useEffect(() => {
    // Left content animation (comes in from left)
    gsap.fromTo(
      leftContentRef.current,
      { 
        x: -100, 
      },
      {
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: leftContentRef.current,
          start: "top 80%",
          toggleActions: "restart none none none" // Plays animation every time it scrolls into view
        }
      }
    );

    // Right image animation (comes in from right)
    gsap.fromTo(
      rightImageRef.current,
      { 
        x: 100, 
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rightImageRef.current,
          start: "top 80%",
          toggleActions: "restart none none none" // Plays animation every time it scrolls into view
        }
      }
    );

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div id="mission" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-x-16 gap-y-16">
          <div ref={leftContentRef} className="flex flex-col space-y-8 md:w-1/2 order-2 md:order-1">
            <div>
              <span className="inline-block text-sm uppercase tracking-wider font-semibold text-[#D13523] mb-4">Our Purpose</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Preserving Cultures and Communitys Through Stories
              </h2>
            </div>

            <div className="h-1 w-24 bg-gradient-to-r from-[#D13523] to-[#FF8A7E] rounded-full"></div>

            <p className="text-lg md:text-xl text-stone-700 leading-relaxed">
              Every day, irreplaceable stories and cultural wisdom are lost when elders pass away. In immigrant communities like Chinatown, language barriers often prevent the younger generation from fully understanding their heritage.
            </p>

            <p className="text-lg md:text-xl text-stone-700 leading-relaxed">
              Story Vault bridges this gap with cutting-edge AI translation that preserves not just words, but emotional context and cultural nuance across languages. We're building a living archive of cultural memory that connects generations.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D13523]/10 text-[#D13523]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-stone-700">47 languages supported</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D13523]/10 text-[#D13523]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-stone-700">12,000+ stories preserved</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D13523]/10 text-[#D13523]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-stone-700">99.2% translation accuracy</span>
              </div>
            </div>

            <a
              href="#features"
              className="group relative flex items-center justify-center w-fit mt-4 px-8 py-4 bg-stone-100 rounded-full font-semibold text-stone-900 overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#D13523] to-[#FF8A7E] transition-all duration-300 ease-out group-hover:w-full"></div>
              <span className="relative group-hover:text-white transition-colors duration-300 flex items-center">
                See How It Works
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </a>
          </div>

          <div ref={rightImageRef} className="relative order-1 md:order-2 md:w-1/2">
            {/* Added image with styling */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/img1.png"
                alt="Preserving cultural stories"
                className="w-full h-full object-cover shadow-2xl shadow-black"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D13523]/20 to-transparent"></div>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 rounded-full bg-[#D13523]/10"></div>
            <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 rounded-full bg-[#D13523]/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;