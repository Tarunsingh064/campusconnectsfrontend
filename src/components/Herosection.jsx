'use client';

import {
  FiArrowRight,
  FiUser,
  FiUsers,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiMessageCircle,
  FiHeart,
  FiActivity,
  FiMonitor,
} from 'react-icons/fi';
import { FaCode, FaUserFriends } from 'react-icons/fa';
import { PiBookOpenTextLight } from 'react-icons/pi';
import Link from 'next/link';
import { useAuth } from '@/Authcontext/Authcontext';
import PortfolioSection from './PortfolioSection';

export default function Herosection() {
  const { user } = useAuth();

  return (
    <>
      {/* HERO SECTION */}
      <section className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#111827] to-[#0a0f1f] text-white pt-24 px-6 md:px-16 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* LEFT */}
          <div className="max-w-2xl">
            <span className="inline-block bg-purple-700/30 text-purple-300 px-4 py-1 rounded-full mb-4 text-sm font-medium backdrop-blur-md shadow-inner">
              Connect. Collaborate. Create.
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white tracking-tight">
              Where College <br />
              Innovators <span className="text-cyan-400">Connect & Create</span>
            </h1>

            <p className="text-gray-300 mt-6 text-lg">
              Join the premier platform for college students to find project
              partners, showcase their work, and collaborate on innovative ideas.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <Link
                href={user ? "/Auth/dashboard" : "/Auth/login"}
                className="bg-gradient-to-tr from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl backdrop-blur-md transition-all duration-300"
              >
                {user ? 'Explore' : 'Get Started'}
              </Link>

              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border border-cyan-500 text-white bg-white/5 backdrop-blur-md hover:bg-cyan-400/10 hover:scale-105 transition-all duration-300 shadow-lg">
                <FiArrowRight />
                Browse Projects
              </button>
            </div>

            <div className="mt-12 flex gap-10 flex-wrap">
              <FeatureCard icon={<FaCode />} title="Coding Projects" desc="Find teammates" />
              <FeatureCard icon={<FaUserFriends />} title="Peer Network" desc="Connect with students" />
              <FeatureCard icon={<PiBookOpenTextLight />} title="Resources" desc="Access knowledge" />
            </div>
          </div>

          {/* RIGHT CARD (Responsive) */}
          <div className="flex items-center justify-center w-full lg:w-auto mt-8 lg:mt-0">
            {user ? (
              <PortfolioSection />
            ) : (
              <div className="bg-gradient-to-tr from-[#1e1b4b] to-[#312e81] rounded-xl p-8 w-full max-w-sm shadow-xl border border-[#312e81] flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-16 h-16 rounded-full bg-purple-600 mx-auto mb-4" />
                  <h3 className="text-center text-white font-bold text-lg">
                    Campus Collab Connect
                  </h3>
                  <p className="text-center text-sm text-gray-300 mt-2">
                    Launching your innovation journey
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-4 bg-gray-600 rounded-md" />
                  <div className="h-4 bg-cyan-400 rounded-md" />
                  <div className="h-4 bg-gray-600 rounded-md col-span-2" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to <span className="text-cyan-400">Succeed</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Campus Collab Connect brings together all the tools and connections students need to collaborate, learn, and build amazing projects.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] hover:scale-105 transition-transform duration-300 rounded-xl p-6 border border-gray-700 hover:border-cyan-400 shadow-md backdrop-blur-sm"
              >
                <div className="text-cyan-400 text-2xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        className="relative bg-gradient-to-br from-[#0a0f1f] via-[#111827] to-[#0a0f1f] text-white py-24 px-6 md:px-16 overflow-hidden"
        style={{ backgroundAttachment: 'fixed' }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            How <span className="text-teal-400">Campus</span>
            <span className="text-green-400">Connect</span>{' '}
            <span className="text-purple-400">Works</span>
          </h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Our platform makes it easy to connect with other students,
            collaborate on projects, and showcase your work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#0f172a]/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 text-center shadow-xl transition-transform hover:-translate-y-2 duration-300"
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center border border-teal-500 text-teal-400 text-2xl">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="flex items-center gap-3">
    <div className="text-cyan-400 text-xl">{icon}</div>
    <div>
      <p className="font-semibold text-white">{title}</p>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  </div>
);

const features = [
  {
    icon: <FiUsers />,
    title: 'Find Project Partners',
    description: 'Connect with like-minded peers with complementary skills to form your dream project team.',
  },
  {
    icon: <FiMonitor />,
    title: 'Project Showcase',
    description: 'Display your best work and see what others are building to get inspired.',
  },
  {
    icon: <FiCalendar />,
    title: 'Campus Events',
    description: 'Never miss a hackathon, workshop or tech talk with our centralized event calendar.',
  },
  {
    icon: <FiBookOpen />,
    title: 'Resource Library',
    description: 'Access and share notes, tutorials, and study materials with your campus community.',
  },
  {
    icon: <FiAward />,
    title: 'Recognition & Badges',
    description: 'Earn badges for your achievements and build credibility within the community.',
  },
  {
    icon: <FiMessageCircle />,
    title: 'Discussion Forums',
    description: 'Get your technical questions answered and help others by sharing your knowledge.',
  },
  {
    icon: <FiHeart />,
    title: 'Alumni Connect',
    description: "Get mentorship and career guidance from graduates who've been in your shoes.",
  },
  {
    icon: <FiActivity />,
    title: 'Innovation Hub',
    description: 'Discover exciting opportunities, internships, and external competitions.',
  },
];

const steps = [
  {
    icon: <FiUser />,
    title: 'Create Your Profile',
    description: 'Sign up and showcase your skills, interests, and portfolio to connect with like-minded peers.',
  },
  {
    icon: <FiUsers />,
    title: 'Find Your Team',
    description: 'Browse projects, join teams or create your own and invite others with complementary skills.',
  },
  {
    icon: <FiMonitor />,
    title: 'Build & Showcase',
    description: 'Collaborate on projects, access resources, and showcase your work to the campus community.',
  },
];