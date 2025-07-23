// File: app/about/page.jsx
// This is a Next.js component using the .jsx format.
'use client'; // Add this directive for client-side hooks

import { useState, useEffect } from 'react';
import {
  Heart,
  Target,
  Users,
  Trophy,
  Briefcase,
  GraduationCap,
  Building,
  Clock,
  Lightbulb,
  Share2,
  Code,
  Rocket,
  Loader, // For loading state
  AlertCircle, // For error state
} from 'lucide-react';

// --- Reusable Components ---

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
    <div className="flex justify-center items-center mb-3">
      <Icon className="w-8 h-8 text-indigo-400" />
    </div>
    <div className="text-4xl font-bold text-white">{value}</div>
    <p className="text-gray-400 mt-1">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, highlighted = false }) => (
  <div className={`
    p-8 rounded-2xl h-full
    ${highlighted ? 'bg-indigo-600/20 border-2 border-indigo-500 shadow-2xl scale-105' : 'bg-gray-800/50 border border-gray-700'}
    transform hover:-translate-y-2 transition-transform duration-300
  `}>
    <div className="mb-4">
      <Icon className="w-10 h-10 text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

// --- Main Page Component ---

export default function AboutPage() {
  // State to hold data from the backend
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map string names to icon components
  const iconMap = {
    Users, Trophy, Lightbulb, GraduationCap, Briefcase, Code, Building, Clock, Heart, Share2
  };

  useEffect(() => {
    // --- Simulate fetching data from a backend API ---
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API endpoint
        // const response = await fetch('https://api.campusconnects.in/about');
        // const data = await response.json();

        // For demonstration, we use a mock data object and a timeout
        const mockApiData = {
          hero: {
            title: "About CampusConnect",
            description: "Unlock your potential. The professional network designed exclusively for students."
          },
          mission: {
            title: "Our Mission",
            description: "We believe every student deserves equal access to opportunities, regardless of their college tier. CampusConnect is built to democratize access to internships, mentorship, and career growth for students who often get overlooked by traditional platforms.",
            points: [
              { icon: "Heart", title: "Community First", description: "Building a supportive ecosystem where students help students succeed." },
              { icon: "Share2", title: "Equal Opportunities", description: "Connecting students with companies and mentors to level the playing field." }
            ]
          },
          stats: [
            { icon: "Code", value: "100+", label: "Projects Started" },
            { icon: "Users", value: "10K+", label: "Students Joined" },
            { icon: "Building", value: "500+", label: "Colleges Connected" },
            { icon: "Clock", value: "24/7", label: "Community Support" }
          ],
          features: {
            title: "What Makes Us Different",
            description: "We combine the best of social networking with professional development, creating a unique platform tailored for student success.",
            items: [
              { icon: "Users", title: "Create Your Profile & Feed", description: "Build your personal brand and connect with fellow students across campuses." },
              { icon: "Trophy", title: "Join Hackathons & Challenges", description: "Participate in coding competitions and showcase your skills." },
              { icon: "Lightbulb", title: "Build & Join Projects", description: "Collaborate on exciting projects and learn from peers.", highlighted: true },
              { icon: "GraduationCap", title: "Alumni Mentorship", description: "Connect with successful alumni for guidance and career advice." },
              { icon: "Briefcase", title: "Career Opportunities", description: "Get job training and direct hiring opportunities through the platform." }
            ]
          }
        };

        // Simulate network delay
        setTimeout(() => {
          setPageData(mockApiData);
          setLoading(false);
        }, 1000);

      } catch (err) {
        setError("Failed to load page content. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
        <Loader className="w-16 h-16 animate-spin text-indigo-400" />
        <p className="mt-4 text-lg text-gray-400">Loading Content...</p>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="mt-4 text-lg text-red-400">{error}</p>
      </div>
    );
  }

  // --- Render Page with Fetched Data ---
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
        {/*
      
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <Rocket className="w-8 h-8 text-indigo-400" />
             <span className="text-2xl font-bold">CampusConnect</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">Home</a>
            <a href="#" className="text-indigo-400 font-semibold">About</a>
            <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">Sign In</a>
          </div>
          <a href="#" className="hidden md:block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-colors">
            Get Started
          </a>
          <button className="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
      */}

      <main className="container mx-auto px-6 py-16 md:py-24">
        {/* --- Hero Section --- */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            About <span className="text-indigo-400">CampusConnect</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            {pageData.hero.description}
          </p>
        </div>

        {/* --- Mission & Stats Section --- */}
        <section className="mt-20 md:mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-bold mb-6 flex items-center"><Target className="w-10 h-10 mr-4 text-indigo-400"/> {pageData.mission.title}</h2>
              <p className="text-gray-300 mb-8 text-lg">
                {pageData.mission.description}
              </p>
              <div className="space-y-6">
                 {pageData.mission.points.map(point => {
                   const Icon = iconMap[point.icon];
                   return (
                     <div key={point.title} className="flex items-start">
                        <div className="bg-indigo-600/20 p-2 rounded-full mr-4 mt-1">
                            <Icon className="w-5 h-5 text-indigo-300"/>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-lg">{point.title}</h4>
                            <p className="text-gray-400">{point.description}</p>
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
            <div className="lg:col-span-3 grid grid-cols-2 gap-6">
              {pageData.stats.map(stat => {
                const Icon = iconMap[stat.icon];
                return <StatCard key={stat.label} icon={Icon} value={stat.value} label={stat.label} />;
              })}
            </div>
          </div>
        </section>

        {/* --- What Makes Us Different Section --- */}
        <section className="mt-20 md:mt-32 text-center">
          <h2 className="text-4xl font-bold mb-4">{pageData.features.title}</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            {pageData.features.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {pageData.features.items.map(feature => {
              const Icon = iconMap[feature.icon];
              return <FeatureCard key={feature.title} icon={Icon} title={feature.title} description={feature.description} highlighted={feature.highlighted} />;
            })}
          </div>
        </section>
      </main>

      {/* --- Footer --- 
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CampusConnect. Empowering students everywhere.</p>
        </div>
      </footer>
      */}
    </div>
  );
}