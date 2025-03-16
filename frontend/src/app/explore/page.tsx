"use client";

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

// Sample community data (for Sidebar navigation)
const COMMUNITIES = [
  { id: 'vietnam-war', name: 'Vietnam War', postCount: 245 },
  { id: 'pakistan-partition', name: 'Pakistan Partition', postCount: 187 },
  { id: 'north-korean-escape', name: 'North Korean Escape', postCount: 113 },
  { id: 'holocaust-survivors', name: 'Holocaust Survivors', postCount: 315 },
  { id: 'cuban-revolution', name: 'Cuban Revolution', postCount: 92 },
  { id: 'soviet-afghanistan', name: 'Soviet-Afghan War', postCount: 156 },
  { id: 'cultural-revolution', name: 'Cultural Revolution', postCount: 204 },
  { id: 'fall-of-berlin-wall', name: 'Fall of Berlin Wall', postCount: 127 },
];

// Sample posts data for the Top Stories page
const TOP_STORIES_POSTS = [
  {
    id: 1,
    user: { name: "Alice Smith", handle: "asmith" },
    title: "Memories of Saigon: The Last Days",
    content: "When the helicopters flew over our neighborhood, I knew our lives would never be the same. My father gathered only what we could carry...",
    audioLength: 300,
    progress: 15,
    likes: 50,
    comments: 10,
    timestamp: "1d ago",
  },
  {
    id: 2,
    user: { name: "Bob Johnson", handle: "bjohnson" },
    title: "My Grandmother's Escape from East Berlin",
    content: "The wall had been up for three years when my grandmother decided she couldn't live divided from her family any longer. With nothing but a small suitcase...",
    audioLength: 420,
    progress: 30,
    likes: 75,
    comments: 15,
    timestamp: "2d ago",
  },
  {
    id: 3,
    user: { name: "Maria Gonzalez", handle: "mgonzalez" },
    title: "Life Before the Revolution",
    content: "Havana was a different world before 1959. My grandfather owned a small tobacco shop near the Malecón. Tourists from America would come and...",
    audioLength: 380,
    progress: 0,
    likes: 42,
    comments: 8,
    timestamp: "3d ago",
  },
];

// Reusable Sidebar component for navigation
const Sidebar = ({ communities, currentSlug }) => {
  return (
    <aside className="w-full md:w-72 bg-stone-50 border-r border-stone-200 md:min-h-screen">
      <div className="p-6 border-b border-stone-200">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-[#D13523] via-[#E05042] to-[#FF8A7E] bg-clip-text text-transparent">
            Story Vault
          </span>
        </h1>
        <p className="text-sm text-stone-600">Community Stories</p>
      </div>
      <nav className="py-6 font-sans">
        <h2 className="px-6 mb-4 text-sm font-medium text-stone-500 uppercase tracking-wider">
          Communities
        </h2>
        <ul className="space-y-1">
          {communities.map((community) => (
            <li key={community.id}>
              <Link
                href={`/explore/${community.id}`}
                className={`flex items-center justify-between px-6 py-3 ${
                  community.id === currentSlug
                    ? 'bg-stone-100 text-[#D13523] font-medium border-l-4 border-[#D13523]'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-[#D13523] transition-all duration-300'
                }`}
              >
                <span>{community.name}</span>
                <span className="text-xs font-medium bg-white px-2 py-1 rounded-full shadow-sm border border-stone-200">
                  {community.postCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-6 border-t border-stone-200 font-sans">
        <Link href="/create">
          <button className="w-full py-3 px-6 bg-[#D13523] text-white rounded-full font-medium hover:bg-[#FF8A7E] transition-all duration-300 shadow-sm flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Upload A Story
          </button>
        </Link>
      </div>
    </aside>
  );
};

export default function TopStoriesPage() {
  const [isPlaying, setIsPlaying] = useState({});

  const togglePlay = (postId) => {
    setIsPlaying((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Head>
        <title>Top Stories | Story Vault</title>
        <meta name="description" content="Top historical stories from community members" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <Sidebar communities={COMMUNITIES} currentSlug="vietnam-war" />
        
        {/* Main Content using SAAS-friendly sans-serif font */}
        <main className="flex-1 p-6 md:p-8 lg:p-12 font-sans">
          <header className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-stone-100">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#D13523]">
                Top Stories
              </h1>
              <p className="text-stone-600 mt-2 text-lg">
                Discover the most popular and impactful historical accounts.
              </p>
            </div>
          </header>
          
          {/* Top Stories Posts */}
          <div className="space-y-8">
            {TOP_STORIES_POSTS.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300"
              >
                {/* User Info */}
                <div className="flex items-center mb-4">
                  {/* Profile Icon with plain background */}
                  <div className="h-12 w-12 rounded-full bg-[#D13523] overflow-hidden flex-shrink-0">
                    <div className="h-full w-full flex items-center justify-center text-white font-bold text-lg">
                      {post.user.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-stone-900">{post.user.name}</p>
                    <p className="text-sm text-stone-500">@{post.user.handle}</p>
                  </div>
                </div>
                
                {/* Post Title */}
                <h3 className="text-xl font-bold mb-3 text-[#D13523]">
                  {post.title}
                </h3>
                
                {/* Post Content Preview */}
                <p className="text-stone-700 mb-6 leading-relaxed">{post.content}</p>
                
                {/* Audio Player */}
                <div className="bg-stone-50 rounded-xl p-4 mb-4 border border-stone-100">
                  <div className="flex items-center mb-2">
                    <button
                      onClick={() => togglePlay(post.id)}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D13523] text-white transition-all duration-300 hover:shadow-md"
                    >
                      {isPlaying[post.id] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>
                    <div className="ml-4 flex-grow">
                      <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D13523] rounded-full"
                          style={{ width: `${post.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium text-stone-500">
                      {Math.floor((post.audioLength * post.progress) / 100)}s / {post.audioLength}s
                    </span>
                  </div>
                </div>
                
                {/* Interaction Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center text-stone-500 hover:text-[#D13523] transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="ml-2 text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center text-stone-500 hover:text-[#D13523] transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="ml-2 text-sm font-medium">{post.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
