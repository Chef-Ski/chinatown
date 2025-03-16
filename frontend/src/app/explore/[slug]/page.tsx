"use client";

import { useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

// TypeScript interfaces for better reusability
export interface Community {
  id: string;
  name: string;
  postCount: number;
  description?: string;
}

export interface Post {
  id: number;
  user: { name: string; handle: string };
  title: string;
  content: string;
  audioLength: number;
  progress: number;
  likes: number;
  comments: number;
  timestamp: string;
}

// Sample community data (replace with your API or database calls)
const COMMUNITIES: Community[] = [
  { id: 'vietnam-war', name: 'Vietnam War', postCount: 245 },
  { id: 'pakistan-partition', name: 'Pakistan Partition', postCount: 187 },
  { id: 'north-korean-escape', name: 'North Korean Escape', postCount: 113 },
  { id: 'holocaust-survivors', name: 'Holocaust Survivors', postCount: 315 },
  { id: 'cuban-revolution', name: 'Cuban Revolution', postCount: 92 },
  { id: 'soviet-afghanistan', name: 'Soviet-Afghan War', postCount: 156 },
  { id: 'cultural-revolution', name: 'Cultural Revolution', postCount: 204 },
  { id: 'fall-of-berlin-wall', name: 'Fall of Berlin Wall', postCount: 127 },
];

// Sample posts data for each community
const SAMPLE_POSTS: Record<string, Post[]> = {
  'vietnam-war': [
    {
      id: 1,
      user: { name: "James Wilson", handle: "jwilson" },
      title: "My Father's Letters from Da Nang",
      content: "These letters were written during the spring of 1968...",
      audioLength: 320,
      progress: 0,
      likes: 42,
      comments: 7,
      timestamp: "2d ago",
    },
    {
      id: 2,
      user: { name: "Minh Nguyen", handle: "mnguyen" },
      title: "Returning to Saigon After 40 Years",
      content: "When I left as a child, I never thought I'd return...",
      audioLength: 415,
      progress: 30,
      likes: 87,
      comments: 13,
      timestamp: "5d ago",
    },
    {
      id: 3,
      user: { name: "Robert Johnson", handle: "rjohnson" },
      title: "The Forgotten Battalion: Oral History Project",
      content: "We interviewed 24 veterans from the 3rd Battalion...",
      audioLength: 620,
      progress: 0,
      likes: 124,
      comments: 19,
      timestamp: "1w ago",
    },
  ],
  'pakistan-partition': [
    {
      id: 1,
      user: { name: "Amina Khan", handle: "akhan" },
      title: "Grandmother's Journey from Amritsar to Lahore",
      content: "In August 1947, my grandmother left everything behind...",
      audioLength: 380,
      progress: 50,
      likes: 63,
      comments: 11,
      timestamp: "3d ago",
    },
    {
      id: 2,
      user: { name: "Raj Patel", handle: "rpatel" },
      title: "Voices of Divided Families",
      content: "This collection shares stories from families separated...",
      audioLength: 540,
      progress: 0,
      likes: 97,
      comments: 24,
      timestamp: "1w ago",
    },
  ],
  'north-korean-escape': [
    {
      id: 1,
      user: { name: "Soo-Jin Park", handle: "sjpark" },
      title: "Three Attempts Across the River",
      content: "My journey to freedom took three attempts over two years...",
      audioLength: 475,
      progress: 15,
      likes: 112,
      comments: 31,
      timestamp: "2d ago",
    },
    {
      id: 2,
      user: { name: "Anonymous", handle: "anon_survivor" },
      title: "Life in Pyongyang Before Escape",
      content: "For safety reasons, I remain anonymous, but this is my story...",
      audioLength: 390,
      progress: 0,
      likes: 84,
      comments: 17,
      timestamp: "4d ago",
    },
  ],
};

// Default posts if no specific posts exist for a community
const DEFAULT_POSTS: Post[] = [
  {
    id: 1,
    user: { name: "Community Member", handle: "member1" },
    title: "My Personal Account",
    content: "This is my story of what happened during this historical event...",
    audioLength: 360,
    progress: 0,
    likes: 45,
    comments: 8,
    timestamp: "3d ago",
  },
  {
    id: 2,
    user: { name: "Historical Society", handle: "histsociety" },
    title: "Collected Oral Histories",
    content: "We've gathered testimonies from 50 participants and witnesses...",
    audioLength: 480,
    progress: 20,
    likes: 72,
    comments: 14,
    timestamp: "1w ago",
  },
];

const Sidebar = ({
  communities,
  currentSlug,
}: {
  communities: Community[];
  currentSlug: string | undefined;
}) => {
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
                className={`flex items-center px-6 py-3 ${
                  community.id === currentSlug
                    ? 'bg-stone-100 text-[#D13523] font-medium border-l-4 border-[#D13523]'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-[#D13523] transition-all duration-300'
                }`}
              >
                <span>{community.name}</span>
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

export default function CommunityPage() {
  const { slug } = useParams();
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});

  const activeCommunity =
    COMMUNITIES.find((community) => community.id === slug) || COMMUNITIES[0];
  const posts = slug && SAMPLE_POSTS[slug] ? SAMPLE_POSTS[slug] : DEFAULT_POSTS;

  const togglePlay = (postId: number) => {
    setIsPlaying((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div key={slug} className="min-h-screen bg-stone-50">
      <Head>
        <title>{activeCommunity?.name || 'Communities'} | Historical Voices</title>
        <meta name="description" content="Listen to historical accounts from community members" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col md:flex-row">
        <Sidebar communities={COMMUNITIES} currentSlug={slug} />
        <main className="flex-1 p-6 font-sans">
          <header className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-stone-100">
            <h1 className="text-3xl font-bold text-[#D13523]">
              {activeCommunity?.name || 'Communities'}
            </h1>
          </header>
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-4">
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
                <h3 className="text-xl font-bold mb-3 text-[#D13523]">
                  {post.title}
                </h3>
                <p className="text-stone-700 mb-6 leading-relaxed">{post.content}</p>
                <div className="bg-stone-50 rounded-xl p-4 mb-4 border border-stone-100">
                  <div className="flex items-center mb-2">
                    <button
                      onClick={() => togglePlay(post.id)}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D13523] text-white transition-all duration-300 hover:shadow-md"
                    >
                      {isPlaying[post.id] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-stone-500 hover:text-[#D13523] transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="ml-1 text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center text-stone-500 hover:text-[#D13523] transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="ml-1 text-sm">{post.comments}</span>
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
