import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  UserIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  MapPinIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const Collaborate = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [searchQuery, setSearchQuery] = useState('');

  const teams = [
    {
      id: 1,
      name: 'Innovation Squad',
      description: 'Looking for a UI/UX designer to join our team working on a revolutionary mobile app for productivity management.',
      skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'User Research'],
      members: 4,
      location: 'Remote',
      posted: '2 days ago',
      currentProject: 'AI-Powered Task Manager',
      avatar: 'https://ui-avatars.com/api/?name=Innovation+Squad&background=6366f1&color=fff',
    },
    {
      id: 2,
      name: 'Tech Pioneers',
      description: 'Seeking a backend developer with experience in Node.js and MongoDB for our e-commerce platform.',
      skills: ['Node.js', 'MongoDB', 'API Development', 'AWS'],
      members: 3,
      location: 'San Francisco',
      posted: '1 day ago',
      currentProject: 'Sustainable Fashion Marketplace',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Pioneers&background=8b5cf6&color=fff',
    },
    {
      id: 3,
      name: 'VR Educators',
      description: 'Educational VR team looking for 3D artists and Unity developers to create immersive learning experiences.',
      skills: ['Unity', '3D Modeling', 'VR Development', 'Blender'],
      members: 6,
      location: 'Remote',
      posted: '3 days ago',
      currentProject: 'Virtual Reality Learning Platform',
      avatar: 'https://ui-avatars.com/api/?name=VR+Educators&background=10b981&color=fff',
    },
  ];

  const soloWorkers = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Full Stack Developer',
      description: 'Passionate about building scalable web applications with modern technologies. Available for exciting projects.',
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
      location: 'New York',
      experience: '5 years',
      rating: 4.9,
      availability: 'Available',
      avatar: 'https://i.pravatar.cc/150?img=1',
      portfolio: 'sarah-chen.dev',
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'UI/UX Designer',
      description: 'Creative designer specializing in user-centered design and modern interfaces. Love working on innovative products.',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
      location: 'Los Angeles',
      experience: '4 years',
      rating: 4.8,
      availability: 'Available',
      avatar: 'https://i.pravatar.cc/150?img=3',
      portfolio: 'marcus-design.com',
    },
    {
      id: 3,
      name: 'Emily Watson',
      title: 'Mobile Developer',
      description: 'iOS and Android developer with expertise in React Native and Flutter. Focused on creating smooth user experiences.',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      location: 'Remote',
      experience: '6 years',
      rating: 4.9,
      availability: 'Busy until March',
      avatar: 'https://i.pravatar.cc/150?img=5',
      portfolio: 'emily-mobile.dev',
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Data Scientist',
      description: 'ML engineer and data scientist with experience in AI/ML projects. Passionate about solving complex problems with data.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Machine Learning'],
      location: 'Seattle',
      experience: '7 years',
      rating: 4.7,
      availability: 'Available',
      avatar: 'https://i.pravatar.cc/150?img=7',
      portfolio: 'david-ml.com',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Collaborate
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find the perfect team or connect with talented individuals to start collaborating.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('teams')}
            className={`${
              activeTab === 'teams'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Teams ({teams.length})
          </button>
          <button
            onClick={() => setActiveTab('solo')}
            className={`${
              activeTab === 'solo'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Solo Workers ({soloWorkers.length})
          </button>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeTab === 'teams' ? 'teams' : 'developers'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
            <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>All Skills</option>
              <option>Development</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Data Science</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={team.avatar}
                  alt={team.name}
                  className="w-16 h-16 rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {team.name}
                      </h3>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                        Working on: {team.currentProject}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {team.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/teams/${team.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Team
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {team.members} members
                      </span>
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {team.location}
                      </span>
                    </div>
                    <span>Posted {team.posted}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'solo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {soloWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {worker.name}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 text-sm">
                        {worker.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {worker.rating} • {worker.experience} experience
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      worker.availability === 'Available' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {worker.availability}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {worker.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {worker.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
                {worker.skills.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    +{worker.skills.length - 4}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {worker.location}
                  </span>
                </div>
                <a 
                  href={`https://${worker.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Portfolio
                </a>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  to={`/messages?user=${worker.name}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  Message
                </Link>
                <Link
                  to={`/profile/${worker.id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collaborate;