import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Discover', href: '/discover' },
      { name: 'Collaborate', href: '/collaborate' },
      { name: 'Community', href: '/community' },
      { name: 'Funding', href: '/funding' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
    resources: [
      { name: 'Help Center', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Status', href: '#' },
    ],
    social: [
      { name: 'Twitter', href: '#', icon: '🐦' },
      { name: 'GitHub', href: '#', icon: '🐙' },
      { name: 'LinkedIn', href: '#', icon: '💼' },
      { name: 'Discord', href: '#', icon: '💬' },
    ],
  };

  return (
    <footer className="bg-white/5 dark:bg-black/10 backdrop-blur-md border-t border-white/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-space font-bold tracking-tight text-gray-900 dark:text-white">
              Co-OpFlow*
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
              Connect with talented individuals, collaborate on innovative projects, and bring your ideas to life. 
              Join a community of creators, developers, and entrepreneurs.
            </p>
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <GlobeAltIcon className="h-4 w-4 mr-1" />
                <span>Available worldwide</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                <span>24/7 Community support</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  title={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {currentYear} Co-OpFlow. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Footer extras removed as requested */}
      </div>
    </footer>
  );
};

export default Footer;