"use client"; // Needed for animations in Next.js app/router

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Navbar from "./component/Navbar"; // Adjust the import path as needed
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

export default function Home() {
  const bgRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animations
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

    // Scroll animations for sections
    const sections = document.querySelectorAll(".reveal-section");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
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
        "Story Vault helped me preserve my grandmother's stories about coming to America in the 1950s. Now my children can hear them in their own language.",
      author: "Emily Chen",
      role: "Community Member",
    },
    {
      quote:
        "The translation feature made it possible for me to finally understand my grandfather's war stories. This is more than an app - it's a bridge between generations.",
      author: "Michael Wong",
      role: "User",
    },
    {
      quote:
        "We've implemented Story Vault as part of our community heritage project. The response has been overwhelming.",
      author: "Dr. Sarah Lin",
      role: "Cultural Preservation Director",
    },
  ];

  // FAQ accordion state
  const [activeFAQ, setActiveFAQ] = useState(null);
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the translation feature work?",
      answer:
        "Our translation system uses advanced AI to convert spoken stories in one language to text, then translates and converts it back to speech in the target language, preserving tone and emotion.",
    },
    {
      question: "Can I share stories privately with just my family?",
      answer:
        "Yes, Story Vault gives you complete control over who can access your stories. You can keep them private, share with specific family members, or contribute to our public archive.",
    },
    {
      question: "Is my data safe and private?",
      answer:
        "Absolutely. We implement bank-level encryption for all stored stories and personal information. Your cultural heritage remains secure and only accessible to those you choose to share it with.",
    },
    {
      question: "Do I need technical skills to use Story Vault?",
      answer:
        "Not at all. Story Vault is designed to be accessible for users of all ages and technical abilities, with a simple, intuitive interface that makes recording and sharing stories straightforward.",
    },
  ];

  // Features data
  const features = [
    {
      icon: (
        <svg
          className="w-12 h-12 text-[#D13523]"
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
      title: "Voice Recording",
      description:
        "High-quality audio capture with noise reduction to preserve every detail of spoken stories.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-[#D13523]"
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
      title: "AI Translation",
      description:
        "Cross-language understanding with our advanced translation system that preserves meaning and nuance.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-[#D13523]"
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
      title: "Family Sharing",
      description:
        "Create private family archives where multiple generations can access and contribute stories.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-[#D13523]"
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
      title: "Story Transcription",
      description:
        "Automatic text conversion of oral histories, making stories searchable and accessible.",
    },
  ];

  return (
    <div className="overflow-x-hidden bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <DotPattern className="absolute w-full h-full [mask-image:radial-gradient(circle_at_center,white,transparent)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h2
            className="hero-title text-7xl md:text-9xl font-extrabold uppercase tracking-tight bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Story Vault
          </motion.h2>

          <motion.h1
            className="hero-subtitle mt-6 text-black text-center max-w-5xl uppercase text-2xl md:text-3xl font-semibold tracking-normal"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Preserving stories, bridging generations
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            className="hero-cta w-full flex justify-center mt-12 md:mt-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <a
              href="#"
              className="relative px-8 py-4 text-xl md:text-2xl font-bold text-white bg-[#D13523] rounded-full shadow-lg hover:bg-[#FF8A7E] transition-all duration-300"
            >
              Start Preserving Now
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator with Handle */}
      <button
  onClick={() => handleScrollToSection("#mission")}
  className="block mx-auto text-black focus:outline-none mt-[-50px]"
>
  <svg
    className="w-8 h-8 animate-bounce"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {/* Vertical line */}
    <line x1="12" y1="2" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" />
    {/* Arrowhead */}
    <polyline
      points="8,12 12,16 16,12"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>





      {/* Mission Section */}
      <div id="mission" className="reveal-section py-24 bg-stone-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-x-12 gap-y-16">
            <div className="flex flex-col items-start text-3xl md:text-5xl font-bold max-w-2xl order-2 md:order-1">
              <h2 className="relative">
                Our Mission
                <span className="absolute -bottom-3 left-0 w-24 h-2 bg-[#D13523]"></span>
              </h2>
              <p className="text-lg md:text-2xl font-normal pt-12 text-neutral-700 leading-relaxed">
                We are dedicated to preserving the rich cultural heritage of Chinatown by leveraging technology to bridge language barriers and connect generations. Through innovative translation and storytelling tools, we ensure that wisdom, traditions, and personal histories are never lost to time or language differences.
              </p>
              <p className="text-lg md:text-2xl font-normal pt-6 text-neutral-700 leading-relaxed">
                Every family has stories worth preserving. Our platform makes it possible to capture, translate, and share these invaluable narratives across languages and generations.
              </p>
              <a
                href="#features"
                className="relative inline-flex mt-8 items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-xl text-black transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-200 group"
              >
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#D13523] group-hover:h-full"></span>
                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                  Discover Features
                </span>
              </a>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D13523] to-[#FF8A7E] opacity-40 blur-lg rounded-lg"></div>
              <img
                src="/img1.png"
                alt="Elderly person sharing stories"
                className="relative w-full max-w-md xl:max-w-lg h-auto shadow-xl rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="reveal-section py-24 bg-neutral-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold">How It Works</h2>
            <div className="w-24 h-2 bg-[#D13523] mx-auto mt-4"></div>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mt-6">
              Our innovative platform makes it easy to preserve family stories across language barriers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Helps Section */}
      <div className="reveal-section py-24 bg-stone-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-x-12 gap-y-16">
            <div className="flex flex-col text-left md:text-right items-start md:items-end text-3xl md:text-5xl font-bold max-w-2xl">
              <h2 className="relative">
                Bridging Divides
                <span className="absolute -bottom-3 right-0 w-24 h-2 bg-[#D13523]"></span>
              </h2>
              <p className="text-lg md:text-2xl font-normal pt-12 text-neutral-700 leading-relaxed">
                Language barriers shouldn't prevent stories from being shared. Our translation technology allows grandchildren to hear their grandparents' stories in their own language, preserving the emotional connection even when they don't share a common tongue.
              </p>
              <p className="text-lg md:text-2xl font-normal pt-6 text-neutral-700 leading-relaxed">
                With Story Vault, cultural wisdom and family histories can be preserved authentically and accessed by future generations, regardless of language differences.
              </p>
              <a
                href="#testimonials"
                className="relative inline-flex mt-8 items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-xl text-black transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-200 group"
              >
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#D13523] group-hover:h-full"></span>
                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                  See Success Stories
                </span>
              </a>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF8A7E] to-[#D13523] opacity-40 blur-lg rounded-lg"></div>
              <img src="/img4.png" alt="Family connecting across generations" className="relative w-full max-w-md xl:max-w-lg h-auto shadow-xl rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="reveal-section py-24 bg-neutral-800 text-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold">Success Stories</h2>
            <div className="w-24 h-2 bg-[#D13523] mx-auto mt-4"></div>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mt-6">
              Hear from families who have preserved their heritage with Story Vault.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-neutral-700 p-8 md:p-12 rounded-xl shadow-2xl">
              <svg
                className="absolute top-0 left-0 transform -translate-x-6 -translate-y-6 h-16 w-16 text-[#D13523] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-xl md:text-2xl mb-8 relative z-10">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xl">{testimonials[currentTestimonial].author}</p>
                  <p className="text-neutral-400">{testimonials[currentTestimonial].role}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
                    }
                    className="p-2 rounded-full bg-neutral-600 hover:bg-[#D13523] transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
                    }
                    className="p-2 rounded-full bg-neutral-600 hover:bg-[#D13523] transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentTestimonial === index ? "bg-[#D13523]" : "bg-neutral-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="reveal-section py-24 bg-stone-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold">Common Questions</h2>
            <div className="w-24 h-2 bg-[#D13523] mx-auto mt-4"></div>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mt-6">
              Everything you need to know about Story Vault.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-6">
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`flex justify-between items-center w-full p-6 text-left rounded-lg ${
                    activeFAQ === index ? "bg-neutral-200" : "bg-white"
                  } shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  <span className="text-xl font-semibold">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ${activeFAQ === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 bg-white rounded-b-lg shadow-md">
                    <p className="text-lg text-neutral-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="reveal-section py-16 md:py-24 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Preserve Your Family's Legacy?
          </h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-12">
            Don't let valuable stories and cultural wisdom be lost to time. Start documenting your family's unique heritage today.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#"
              className="px-8 py-4 bg-[#D13523] hover:bg-[#FF5A41] rounded-lg text-xl font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              Start Free Trial
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
            <a
              href="#"
              className="px-8 py-4 bg-transparent border-2 border-white hover:border-[#D13523] hover:text-[#D13523] rounded-lg text-xl font-semibold transition-colors duration-200"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Story Vault</h3>
              <p className="text-neutral-400 mb-6">
                Preserving stories, bridging generations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-[#D13523]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495V14.708h-3.13v-3.622h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-[#D13523]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.392-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.949.555-2.005.959-3.127 1.184-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.928 2.205-4.928 4.928 0 .386.045.762.127 1.124-4.094-.205-7.725-2.165-10.161-5.144-.424.722-.666 1.562-.666 2.457 0 1.697.863 3.194 2.178 4.072-.803-.026-1.56-.246-2.224-.616v.062c0 2.372 1.688 4.348 3.924 4.798-.412.112-.846.171-1.292.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.376 4.604 3.414-1.68 1.318-3.809 2.105-6.102 2.105-.396 0-.79-.023-1.17-.069 2.179 1.397 4.768 2.213 7.557 2.213 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.633.961-.694 1.8-1.562 2.46-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-[#D13523]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.973.24 2.428.415a4.92 4.92 0 011.675 1.09 4.92 4.92 0 011.09 1.675c.175.455.359 1.258.415 2.428.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.973-.415 2.428a4.92 4.92 0 01-1.09 1.675 4.92 4.92 0 01-1.675 1.09c-.455.175-1.258.359-2.428.415-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.973-.24-2.428-.415a4.92 4.92 0 01-1.675-1.09 4.92 4.92 0 01-1.09-1.675c-.175-.455-.359-1.258-.415-2.428C2.175 15.747 2.163 15.368 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.973.415-2.428a4.92 4.92 0 011.09-1.675 4.92 4.92 0 011.675-1.09c.455-.175 1.258-.359 2.428-.415C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.736 0 8.332.012 7.052.07 5.773.128 4.667.313 3.757.637a7.076 7.076 0 00-2.555 1.66A7.076 7.076 0 00.637 4.852C.313 5.762.128 6.868.07 8.148.012 9.428 0 9.832 0 12c0 2.168.012 2.572.07 3.852.058 1.28.243 2.386.567 3.296a7.076 7.076 0 001.66 2.555 7.076 7.076 0 002.555 1.66c.91.324 2.016.509 3.296.567 1.28.058 1.684.07 3.852.07s2.572-.012 3.852-.07c1.28-.058 2.386-.243 3.296-.567a7.076 7.076 0 002.555-1.66 7.076 7.076 0 001.66-2.555c.324-.91.509-2.016.567-3.296.058-1.28.07-1.684.07-3.852s-.012-2.572-.07-3.852c-.058-1.28-.243-2.386-.567-3.296a7.076 7.076 0 00-1.66-2.555 7.076 7.076 0 00-2.555-1.66C18.386.313 17.28.128 16 .07 14.72.012 14.316 0 12 0z" />
                    <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z" />
                    <circle cx="18.406" cy="5.594" r="1.44" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul>
                <li className="mb-2">
                  <a href="#mission" className="hover:text-[#D13523]">
                    Our Mission
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#features" className="hover:text-[#D13523]">
                    How It Works
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#testimonials" className="hover:text-[#D13523]">
                    Success Stories
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#faq" className="hover:text-[#D13523]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Resources</h4>
              <ul>
                <li className="mb-2">
                  <a href="#" className="hover:text-[#D13523]">
                    Blog
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-[#D13523]">
                    Help Center
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-[#D13523]">
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-[#D13523]">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
              <ul>
                <li className="mb-2">
                  <a href="mailto:info@storyvault.com" className="hover:text-[#D13523]">
                    info@storyvault.com
                  </a>
                </li>
                <li className="mb-2">
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="mb-2">
                  <span>123 Story Vault Lane, San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-neutral-500">
            &copy; {new Date().getFullYear()} Story Vault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}