import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  HeartIcon,
  StarIcon,
  ShareIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const FundingDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Mock startup data - in a real app, this would come from an API
  const startup = {
    id: id,
    name: "AI Health Solutions",
    description: "Revolutionary AI-powered healthcare platform that helps doctors diagnose diseases more accurately and efficiently. Our technology uses machine learning to analyze medical images and patient data, providing real-time insights and recommendations.",
    industry: "Healthcare & AI",
    stage: "Series A",
    founded: "2023-01-15",
    team: [
      { name: "John Doe", role: "CEO & Co-founder", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Jane Smith", role: "CTO", avatar: "https://i.pravatar.cc/150?img=2" },
      { name: "Mike Johnson", role: "Head of AI", avatar: "https://i.pravatar.cc/150?img=3" },
    ],
    funding: {
      target: 5000000,
      raised: 2500000,
      equity: 15,
      minimum: 50000,
      investors: [
        { name: "Tech Ventures", amount: 1000000 },
        { name: "Health Capital", amount: 750000 },
        { name: "AI Fund", amount: 750000 },
      ],
    },
    metrics: {
      users: 50000,
      growth: 25,
      revenue: 1200000,
      burnRate: 150000,
    },
    pitchDeck: {
      title: "AI Health Solutions - Series A",
      slides: 15,
      lastUpdated: "2024-03-01",
      url: "#",
    },
    likes: 234,
    stars: 156,
    comments: [
      {
        user: "Sarah Wilson",
        avatar: "https://i.pravatar.cc/150?img=4",
        text: "The technology looks promising, and the team has a strong track record in healthcare AI.",
        timestamp: "2 hours ago"
      },
      {
        user: "Alex Brown",
        avatar: "https://i.pravatar.cc/150?img=5",
        text: "The market opportunity is huge, and the technology has shown great results in early trials.",
        timestamp: "5 hours ago"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-100/40 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent dark:from-indigo-800/20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Funding
        </button>

        {/* Startup Header */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-8 border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{startup.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  {startup.industry}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Founded {startup.founded}
                </span>
                <span className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  {startup.stage}
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg ${
                  isLiked
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <HeartIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => setIsStarred(!isStarred)}
                className={`p-2 rounded-lg ${
                  isStarred
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <StarIcon className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Startup Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About the Startup</h2>
              <p className="text-gray-600 dark:text-gray-300">{startup.description}</p>
            </div>

            {/* Funding Progress */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Funding Progress</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Target: ${startup.funding.target.toLocaleString()}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Raised: ${startup.funding.raised.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full"
                      style={{ width: `${(startup.funding.raised / startup.funding.target) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Equity Offered</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{startup.funding.equity}%</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Minimum Investment</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${startup.funding.minimum.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Investors */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Investors</h2>
              <div className="space-y-4">
                {startup.funding.investors.map((investor) => (
                  <div key={investor.name} className="flex justify-between items-center bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                    <span className="font-medium text-gray-900 dark:text-white">{investor.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">${investor.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments</h2>
              <div className="space-y-4">
                {startup.comments.map((comment, index) => (
                  <div key={index} className="flex space-x-4">
                    <img
                      src={comment.avatar}
                      alt={comment.user}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">{comment.user}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Team and Metrics */}
          <div className="space-y-8">
            {/* Team */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team</h2>
              <div className="space-y-4">
                {startup.team.map((member) => (
                  <div key={member.name} className="flex items-center space-x-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active Users</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{startup.metrics.users.toLocaleString()}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Growth</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{startup.metrics.growth}%</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Annual Revenue</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${startup.metrics.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Burn Rate</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${startup.metrics.burnRate.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Pitch Deck */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pitch Deck</h2>
              <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{startup.pitchDeck.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{startup.pitchDeck.slides} slides • Updated {startup.pitchDeck.lastUpdated}</p>
                  </div>
                </div>
                <a
                  href={startup.pitchDeck.url}
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Pitch Deck
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingDetails; 