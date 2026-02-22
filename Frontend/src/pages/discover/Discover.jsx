import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  HeartIcon,
  UserGroupIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    techStack: '',
    teamName: '',
    lookingFor: '',
  });

  const categories = [
    'All',
    'Technology',
    'Design',
    'Business',
    'Education',
    'Health',
    'Entertainment',
  ];

  const projects = [
    {
      id: 1,
      title: 'AI-Powered Task Manager',
      description: 'An intelligent task management system that learns from your work patterns and optimizes productivity through machine learning algorithms.',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 245,
      stars: 189,
      members: 12,
      timeLeft: '5 days',
      techStack: ['React', 'Node.js', 'Python', 'TensorFlow'],
      teamName: 'AI Innovators',
      lookingFor: 'Frontend Developer, ML Engineer',
    },
    {
      id: 2,
      title: 'Sustainable Fashion Marketplace',
      description: 'A platform connecting eco-friendly fashion brands with conscious consumers, promoting sustainable fashion choices.',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 189,
      stars: 156,
      members: 8,
      timeLeft: '3 days',
      techStack: ['Vue.js', 'Laravel', 'MySQL', 'Stripe'],
      teamName: 'EcoTech Solutions',
      lookingFor: 'UI/UX Designer, Backend Developer',
    },
    {
      id: 3,
      title: 'Virtual Reality Learning Platform',
      description: 'Immersive educational experiences using VR technology to make learning more engaging and effective.',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 312,
      stars: 278,
      members: 15,
      timeLeft: '8 days',
      techStack: ['Unity', 'C#', 'Oculus SDK', 'Firebase'],
      teamName: 'VR Educators',
      lookingFor: '3D Artist, VR Developer',
    },
    {
      id: 4,
      title: 'Mental Health Support App',
      description: 'A comprehensive mental health platform providing resources, therapy matching, and peer support communities.',
      category: 'Health',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 198,
      stars: 167,
      members: 10,
      timeLeft: '12 days',
      techStack: ['React Native', 'Express.js', 'MongoDB', 'Socket.io'],
      teamName: 'MindCare Team',
      lookingFor: 'Mobile Developer, Therapist Consultant',
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    // TODO: Implement project creation logic
    console.log('New project:', newProject);
    setShowCreateModal(false);
    setNewProject({
      title: '',
      description: '',
      category: '',
      techStack: '',
      teamName: '',
      lookingFor: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find innovative projects and join teams that match your interests and skills.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Project
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {project.category}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">{project.timeLeft}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                {project.description}
              </p>
              
              {/* Team Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Team: {project.teamName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Looking for: {project.lookingFor}</p>
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 text-red-500 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {project.likes}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {project.stars}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {project.members}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={newProject.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={newProject.techStack}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={newProject.teamName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Looking For
                </label>
                <input
                  type="text"
                  name="lookingFor"
                  value={newProject.lookingFor}
                  onChange={handleInputChange}
                  placeholder="Frontend Developer, Designer"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;