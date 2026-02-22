import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserGroupIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  ShareIcon,
  ArrowLeftIcon,
  FlagIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

const ForumDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock forum data - in a real app, this would come from an API
  const forum = {
    id: id,
    title: "Best Practices for AI Implementation in Web Applications",
    description: "A discussion about implementing AI features in web applications, focusing on practical approaches, common challenges, and success stories.",
    category: "Artificial Intelligence",
    author: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Senior Developer",
    },
    createdAt: "2024-03-15",
    views: 1234,
    likes: 89,
    replies: [
      {
        user: {
          name: "Jane Smith",
          avatar: "https://i.pravatar.cc/150?img=2",
          role: "AI Engineer",
        },
        content: "In my experience, starting with a clear use case and gradually integrating AI features has been the most successful approach. We began with simple recommendation systems before moving to more complex features.",
        timestamp: "2 hours ago",
        likes: 23,
      },
      {
        user: {
          name: "Mike Johnson",
          avatar: "https://i.pravatar.cc/150?img=3",
          role: "Product Manager",
        },
        content: "One challenge we faced was balancing performance with user experience. We found that implementing progressive loading and fallback options was crucial for maintaining a smooth user experience.",
        timestamp: "5 hours ago",
        likes: 15,
      },
    ],
    tags: ["AI", "Web Development", "Best Practices", "Implementation"],
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
          Back to Forums
        </button>

        {/* Forum Header */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-8 border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{forum.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {forum.category}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Posted {forum.createdAt}
                </span>
                <span className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  {forum.replies.length} replies
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
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg ${
                  isBookmarked
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <BookmarkIcon className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forum Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Original Post */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-start space-x-4">
                <img
                  src={forum.author.avatar}
                  alt={forum.author.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{forum.author.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{forum.author.role}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{forum.createdAt}</span>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">{forum.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {forum.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Replies */}
            <div className="space-y-4">
              {forum.replies.map((reply, index) => (
                <div
                  key={index}
                  className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={reply.user.avatar}
                      alt={reply.user.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{reply.user.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{reply.user.role}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{reply.timestamp}</span>
                      </div>
                      <p className="mt-4 text-gray-600 dark:text-gray-300">{reply.content}</p>
                      <div className="mt-4 flex items-center space-x-4">
                        <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                          <HeartIcon className="h-5 w-5 mr-1" />
                          <span>{reply.likes}</span>
                        </button>
                        <button className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400">
                          <FlagIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Forum Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{forum.views}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Views</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{forum.likes}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetails;