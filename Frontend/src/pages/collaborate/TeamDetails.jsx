import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  ShareIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const TeamDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // Mock team data - in a real app, this would come from an API
  const team = {
    id: id,
    name: "Innovation Squad",
    description: "A dynamic team of developers, designers, and product managers focused on creating innovative solutions for complex problems. We specialize in AI, web development, and user experience design.",
    focus: "Web Development & AI",
    founded: "2023-01-15",
    members: [
      { name: "John Doe", role: "Team Lead", avatar: "https://i.pravatar.cc/150?img=1", skills: ["React", "Node.js", "Leadership"] },
      { name: "Jane Smith", role: "Senior Developer", avatar: "https://i.pravatar.cc/150?img=2", skills: ["Python", "AI", "Machine Learning"] },
      { name: "Mike Johnson", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/150?img=3", skills: ["Figma", "UI Design", "User Research"] },
      { name: "Sarah Wilson", role: "Product Manager", avatar: "https://i.pravatar.cc/150?img=4", skills: ["Agile", "Product Strategy", "Analytics"] },
    ],
    projects: [
      {
        name: "AI-Powered Task Management",
        status: "In Progress",
        progress: 65,
        description: "Building an intelligent task management system with ML capabilities",
      },
      {
        name: "Smart Analytics Dashboard",
        status: "Planning",
        progress: 20,
        description: "Creating a comprehensive analytics platform for business insights",
      },
    ],
    skills: ["React", "Python", "AI", "UI/UX Design", "Product Management", "Node.js"],
    likes: 189,
    stars: 142,
    lookingFor: ["Frontend Developer", "ML Engineer", "DevOps Engineer"],
    comments: [
      {
        user: "Alex Brown",
        avatar: "https://i.pravatar.cc/150?img=5",
        text: "Great team! Would love to collaborate on future projects.",
        timestamp: "3 hours ago"
      },
      {
        user: "Emily Davis",
        avatar: "https://i.pravatar.cc/150?img=6",
        text: "The team's approach to AI integration is impressive.",
        timestamp: "1 day ago"
      }
    ]
  };

  const handleJoinTeam = (e) => {
    e.preventDefault();
    if (coverLetter.trim()) {
      // TODO: Implement join team logic with cover letter
      console.log('Join team request:', {
        teamId: id,
        coverLetter: coverLetter.trim(),
        timestamp: new Date().toISOString(),
      });
      setShowJoinModal(false);
      setCoverLetter('');
      // Show success message or redirect
      alert('Your application has been sent to the team! They will review your cover letter and get back to you.');
    }
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
          Back to Teams
        </button>

        {/* Team Header */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-8 border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{team.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {team.focus}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Founded {team.founded}
                </span>
                <span className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {team.members.length} members
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
          {/* Left Column - Team Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About the Team</h2>
              <p className="text-gray-600 dark:text-gray-300">{team.description}</p>
            </div>

            {/* Looking For */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Currently Looking For</h2>
              <div className="flex flex-wrap gap-3">
                {team.lookingFor.map((role) => (
                  <span
                    key={role}
                    className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Apply to Join Team
                </button>
              </div>
            </div>

            {/* Current Projects */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Projects</h2>
              <div className="space-y-6">
                {team.projects.map((project) => (
                  <div key={project.name} className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'In Progress' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{project.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments</h2>
              <div className="space-y-4">
                {team.comments.map((comment, index) => (
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

          {/* Right Column - Team Members and Stats */}
          <div className="space-y-8">
            {/* Team Members */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Members</h2>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member.name} className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="mt-2 inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Skills */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Skills</h2>
              <div className="flex flex-wrap gap-2">
                {team.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{team.likes}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Likes</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{team.stars}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Stars</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Apply to Join {team.name}</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <div className="flex items-start">
                  <DocumentTextIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Cover Letter Required</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                      Please write a cover letter explaining why you'd like to join this team and what you can contribute.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleJoinTeam} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Dear Innovation Squad team,

I am excited to apply to join your team because...

My relevant experience includes...

I believe I can contribute to your projects by...

Thank you for considering my application.

Best regards,
[Your Name]"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Minimum 100 characters. Be specific about your skills and how you can help the team.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={coverLetter.length < 100}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;