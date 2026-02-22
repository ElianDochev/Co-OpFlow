import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserGroupIcon,
  ClockIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  ShareIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const ProjectDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Mock project data - in a real app, this would come from an API
  const project = {
    id: id,
    title: "AI-Powered Task Management System",
    description: "A revolutionary task management system that uses artificial intelligence to optimize workflow and increase productivity. The system learns from user behavior to provide personalized task prioritization and scheduling recommendations.",
    category: "Artificial Intelligence",
    status: "In Progress",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    team: [
      { name: "John Doe", role: "Project Lead", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Jane Smith", role: "AI Engineer", avatar: "https://i.pravatar.cc/150?img=2" },
      { name: "Mike Johnson", role: "Frontend Developer", avatar: "https://i.pravatar.cc/150?img=3" },
    ],
    technologies: ["React", "Python", "TensorFlow", "MongoDB"],
    progress: 65,
    likes: 234,
    stars: 156,
    comments: [
      {
        user: "Sarah Wilson",
        avatar: "https://i.pravatar.cc/150?img=4",
        text: "This project looks promising! Would love to contribute to the frontend development.",
        timestamp: "2 hours ago"
      },
      {
        user: "Alex Brown",
        avatar: "https://i.pravatar.cc/150?img=5",
        text: "The AI implementation is fascinating. Looking forward to seeing the final product.",
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
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-8 border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-1" />
                  {project.category}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {project.startDate} - {project.endDate}
                </span>
                <span className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {project.team.length} members
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
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
              <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
            </div>

            {/* Progress */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Progress</h2>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{project.progress}% complete</p>
            </div>

            {/* Technologies */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments</h2>
              <div className="space-y-4">
                {project.comments.map((comment, index) => (
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

          {/* Right Column - Team and Stats */}
          <div className="space-y-8">
            {/* Team */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team</h2>
              <div className="space-y-4">
                {project.team.map((member) => (
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

            {/* Stats */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{project.likes}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Likes</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{project.stars}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Stars</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 