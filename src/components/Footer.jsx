import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-[#080c1a] text-gray-300 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding and Description */}
        <div>
          <div className="flex items-center mb-4 space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-teal-400" />
            <span className="text-xl font-semibold">
              Campus<span className="text-teal-400">Connect</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            The premier platform for college students to connect, collaborate, and create innovative projects together. Find your team, showcase your work, and access valuable resources.
          </p>
          <div className="flex space-x-4 mt-4 text-xl">
            <a href="#"><FaGithub /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Home</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Login</a></li>
            <li><a href="#">Sign Up</a></li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Features</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Project Matchmaking</a></li>
            <li><a href="#">Resource Library</a></li>
            <li><a href="#">Campus Events</a></li>
            <li><a href="#">Discussion Forums</a></li>
            <li><a href="#">Alumni Connect</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <div className="flex items-center space-x-2 text-sm">
            <HiOutlineMail className="text-lg" />
            <span>info@campusConnect.com</span>
          </div>
          <p className="text-sm mt-4">
            College Campus, <br />
            Innovation Building, <br />
            Tech District, CA 12345
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        © 2025 Campus Collab Connect. All rights reserved.
      </div>
    </footer>
  );
}