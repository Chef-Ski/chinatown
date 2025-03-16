import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MeetTheTeamSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const teamCardsRef = useRef(null);

  // Sample team data - replace with your actual team members
  const teamMembers = [
    {
      name: "Aristu S.",
      role: "Lead Design",
      bio: "'The best way to predict the future is to create it'",
      image: "/aristubetter.jpeg" // Replace with actual image path
    },
    {
      name: "Naveen G.",
      role: "Fullstack Developer",
      bio: "Full-stack developer with 10+ years of experience building educational platforms.",
      image: "/api/placeholder/300/300" // Replace with actual image path
    },
    {
      name: "Rishi",
      role: "AI and Backend Developer",
      bio: "Python expert and AI developer.",
      image: "/api/placeholder/300/300" // Replace with actual image path
    },
    {
      name: "Jacob S.",
      role: "Frontend Lead",
      bio: "UX/UI specialist focused on creating intuitive learning experiences.",
      image: "/jacobimg.jpg" // Replace with actual image path
    }
  ];

  useEffect(() => {
    // Animate the heading with a reveal effect
    gsap.fromTo(
      headingRef.current,
      { 
        y: 50, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // Staggered animation for team cards
    gsap.fromTo(
      teamCardsRef.current.children,
      { 
        y: 100, 
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: teamCardsRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );

    // Add hover animations for each team card
    const teamCards = teamCardsRef.current.children;
    for (let i = 0; i < teamCards.length; i++) {
      const card = teamCards[i];
      const image = card.querySelector('.team-image');
      const content = card.querySelector('.team-content');
      
      // Create hover timeline for each card
      const hoverTl = gsap.timeline({ paused: true });
      
      hoverTl
        .to(image, { 
          y: -20, 
          scale: 1.05, 
          boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
          duration: 0.3, 
          ease: "power2.out" 
        })
        .to(content, { 
          y: -10, 
          duration: 0.2, 
          ease: "power2.out" 
        }, "-=0.2");
      
      // Set up hover events
      card.addEventListener("mouseenter", () => hoverTl.play());
      card.addEventListener("mouseleave", () => hoverTl.reverse());
    }

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-red-50 to-rose-50">
      <div className="container mx-auto px-4 md:px-12">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Meet Our Team</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Passionate educators and technologists dedicated to transforming how coding is taught and learned.
          </p>
        </div>

        <div 
          ref={teamCardsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300"
            >
              <div className="team-image relative h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="team-content p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-red-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
                <div className="mt-4 flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeamSection;