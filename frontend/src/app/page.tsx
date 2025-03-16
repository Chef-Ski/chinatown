"use client"; // Needed for animations in Next.js app/router

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Navbar from "./component/Navbar"; // Adjust the import path as needed
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import MissionSection from "./component/Mission";

export default function Home() {
  const bgRef = useRef(null);

  useEffect(() => {
    // Hero section animations only
    gsap.fromTo(
      ".hero-title",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.3 }
    );
    gsap.fromTo(
      ".hero-subtitle",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.8 }
    );
    gsap.fromTo(
      ".hero-cta",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 1.3 }
    );
  }, []);

  // Smooth scroll handler for the arrow
  const handleScrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Testimonial state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      quote:
        "Story Vault helped me preserve my grandmother's stories about her journey from China to America in the 1950s. The voice translation feature means my children can hear her stories in English while I can listen in Cantonese.",
      author: "Emily Chen",
      role: "Community Member",
      image: "/testimonial-1.jpg",
    },
    {
      quote:
        "The translation technology bridged a gap I thought would always exist. For the first time, I truly understand my grandfather's war experiences in his native tongue, yet hear them in mine. This isn't just an app—it's preserving our family's soul.",
      author: "Michael Wong",
      role: "Family Historian",
      image: "/testimonial-2.jpg",
    },
    {
      quote:
        "We implemented Story Vault across five Chinatown community centers. In just months, we've archived over 300 stories that would have been lost forever. The multilingual access has reconnected families separated by language barriers for generations.",
      author: "Dr. Sarah Lin",
      role: "Cultural Preservation Director",
      image: "/testimonial-3.jpg",
    },
  ];

  // FAQ accordion state
  const [activeFAQ, setActiveFAQ] = useState(null);
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the voice translation technology work?",
      answer:
        "Our AI-powered system captures spoken stories in any language, transcribes them with 98% accuracy, and translates while preserving emotional tone and cultural context. The story can then be played back in any of our 47 supported languages, maintaining the original speaker's vocal character and emotional nuances.",
    },
    {
      question: "Can I control who has access to my family's stories?",
      answer:
        "Absolutely. Story Vault offers three privacy tiers: Private (accessible only to invited family members), Community (shared with specific cultural groups you select), and Heritage Archive (contributed to our public cultural preservation library). You maintain complete control and can adjust sharing settings for each story individually.",
    },
    {
      question: "Is my cultural heritage data secure?",
      answer:
        "Security is our priority. We use end-to-end encryption for all stored content and personal information. Your stories are backed up across multiple secure locations, and we never analyze, sell, or share your data with third parties. We exceed industry standards for personal data protection.",
    },
    {
      question: "Do I need technical expertise to use Story Vault?",
      answer:
        "Not at all. Story Vault was designed with elders in mind—featuring large text, intuitive controls, and voice-guided assistance. Our one-touch recording system works on any device, and family members can assist remotely through our companion app. We also offer free community workshops and personalized setup assistance.",
    },
  ];

  // Features data
  const features = [
    {
      icon: (
        <svg
          className="w-16 h-16 text-[#D13523]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          ></path>
        </svg>
      ),
      title: "Crystal-Clear Voice Recording",
      description:
        "Capture stories with studio-quality audio featuring advanced noise reduction and voice enhancement specifically optimized for elderly speakers.",
      image: "/feature-recording.jpg",
    },
    {
      icon: (
        <svg
          className="w-16 h-16 text-[#D13523]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          ></path>
        </svg>
      ),
      title: "Emotion-Preserving Translation",
      description:
        "Our proprietary AI preserves tone, emotion, and cultural context across 47 languages, maintaining the authenticity of each storyteller's voice.",
      image: "/feature-translation.jpg",
    },
    {
      icon: (
        <svg
          className="w-16 h-16 text-[#D13523]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      ),
      title: "Multi-Generation Sharing",
      description:
        "Create private family archives that connect grandparents, parents, and grandchildren through interactive storytelling experiences across different languages.",
      image: "/feature-family.jpg",
    },
    {
      icon: (
        <svg
          className="w-16 h-16 text-[#D13523]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      ),
      title: "Cultural Context Preservation",
      description:
        "Our AI recognizes cultural references, idioms, and historical context to ensure stories maintain their full meaning and significance across languages.",
      image: "/feature-context.jpg",
    },
  ];

  return (
    <div className="overflow-x-hidden bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden initialbg">
        {/* Background Elements */}
        

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <motion.div
            className="mb-8 p-2 px-6 bg-white/80 backdrop-blur-sm rounded-full shadow-sm inline-block"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm md:text-base font-medium text-[#D13523]">   Preserving Cultures and Communitys Through Stories</span>
          </motion.div>

          <motion.h1
            className="hero-title text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-bold tracking-tight"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-[#D13523] via-[#E05042] to-[#FF8A7E] bg-clip-text text-transparent">
              Story Vault
            </span>
          </motion.h1>

          <motion.h2
            className="hero-subtitle mt-8 text-white font-bold text-center max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl  leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Breaking language barriers to preserve family stories across generations. Capture, translate, and share your cultural heritage like never before.
          </motion.h2>


          {/* CTA Buttons */}
          <motion.div
            className="hero-cta w-full flex flex-col sm:flex-row gap-4 justify-center mt-4 md:mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <a
              href="#"
              className="px-8 py-4 text-lg md:text-xl font-bold text-white bg-[#D13523] rounded-full shadow-lg hover:bg-[#FF8A7E] transition-all duration-300 flex items-center justify-center"
            >
              Start Preserving Stories
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
            <a
              href="#"
              className="px-8 py-4 text-lg md:text-xl font-bold text-[#D13523] bg-white border-2 border-[#D13523] rounded-full shadow-md hover:bg-stone-50 transition-all duration-300"
            >
              Watch Demo
            </a>
          </motion.div>

          
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={() => handleScrollToSection("#mission")}
        className="block mx-auto text-stone-700 focus:outline-none mt-[-80px] mb-16 relative z-20"
        aria-label="Scroll to mission section"
      >
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest mb-2 opacity-70"></span>
          <svg
            className="w-8 h-8 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </button>

      {/* Mission Section */}
      <MissionSection/>

      {/* Features Section */}
      <div id="features" className="py-24 md:py-32 bg-stone-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <span className="inline-block text-sm uppercase tracking-wider font-semibold text-[#D13523] mb-4">Our Technology</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              How Story Vault Works
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#D13523] to-[#FF8A7E] rounded-full mx-auto mt-6"></div>
            <p className="text-lg md:text-xl text-stone-700 max-w-3xl mx-auto mt-8">
              Our innovative platform makes preserving family stories across language barriers simple and meaningful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <div className="text-[#D13523]">{feature.icon}</div>
                  </div>
                  <p className="text-stone-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="inline-block text-sm uppercase tracking-wider font-semibold text-[#D13523] mb-4">Community Voices</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Stories That Connect Generations
            </h2>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-stone-50 rounded-xl p-8 transition-all duration-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D13523]">
                      <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <blockquote className="text-lg text-stone-700 mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t border-stone-200 pt-6">
                    <h3 className="font-bold text-stone-900">{testimonial.author}</h3>
                    <p className="text-sm text-stone-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 md:py-32 bg-stone-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-sm uppercase tracking-wider font-semibold text-[#D13523] mb-4">Support</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-8 py-6 flex justify-between items-center"
                  >
                    <h3 className="text-lg font-semibold text-stone-900">{faq.question}</h3>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-300 ${activeFAQ === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeFAQ === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-8 py-6 border-t border-stone-100">
                      <p className="text-stone-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-200">
        <div className="container mx-auto px-6 md:px-12 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Story Vault</h3>
              <p className="text-stone-400">
                Preserving cultural heritage through innovative technology. Bridging generations, one story at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF8A7E] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#FF8A7E] transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-[#FF8A7E] transition-colors">Cultural Partners</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF8A7E] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#FF8A7E] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#FF8A7E] transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-center text-stone-500">
            <p>&copy; {new Date().getFullYear()} Story Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}