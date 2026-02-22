import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    has_next: false,
    has_prev: false
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: filters.page,
        limit: filters.limit,
        sort_by: 'created_at', // Default sorting as per the curl example
      };
      
      // Only add category if it has a value
      if (filters.category) {
        params.category = filters.category;
      }
      
      // Only add search if it has a value
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await api.projects.getAll(params);
      
      // Handle the response format with pagination
      if (response.projects) {
        setProjects(response.projects);
        setPagination({
          total: response.total || 0,
          has_next: response.has_next || false,
          has_prev: response.has_prev || false
        });
      } else {
        setProjects(response || []);
        setPagination({
          total: 0,
          has_next: false,
          has_prev: false
        });
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on component mount and when filters change
  useEffect(() => {
    fetchProjects();
  }, [filters]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle like project
  const handleLike = async (projectId) => {
    try {
      await api.projects.like(projectId);
      // Refresh projects to get updated like count
      fetchProjects();
    } catch (err) {
      console.error('Error liking project:', err);
    }
  };

  // Handle star project
  const handleStar = async (projectId) => {
    try {
      await api.projects.star(projectId);
      // Refresh projects to get updated star count
      fetchProjects();
    } catch (err) {
      console.error('Error starring project:', err);
    }
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: category === prev.category ? '' : category,
      page: 1
    }));
  };

  // Handle load more
  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover innovative projects and find opportunities to collaborate.
          </p>
          <img
            src="/logo-trans-bg.png"
            alt="Co-OpFlow logo"
            className="mx-auto mb-8 h-20 w-20 object-contain drop-shadow-lg"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
          <input
            type="text"
              placeholder="Search projects by title, description, or technologies..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              </div>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {['web_app', 'mobile_app', 'ai_ml', 'blockchain', 'game_dev', 'other'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.category === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {searchTerm || filters.category 
                ? 'No projects found matching your criteria.' 
                : 'No projects available at the moment.'
              }
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
              key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              >
                {/* Project Image */}
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Project Image Placeholder */}
                <div className={`w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center ${project.image_url ? 'hidden' : ''}`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-xl font-bold">
                        {project.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                      {project.category}
                    </p>
                  </div>
                </div>
                
              <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {project.title}
                </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(project.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleStar(project.id);
                        }}
                        className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>
                  
                  {/* Technologies/Tags */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                    <span
                          key={tech}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs"
                    >
                          {tech}
                    </span>
                  ))}
                      {project.tech_stack.length > 3 && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs">
                          +{project.tech_stack.length - 3} more
                        </span>
                      )}
                </div>
                  )}
                  
                  {/* Looking For */}
                  {project.looking_for && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Looking for:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                        {project.looking_for.split(',').slice(0, 2).map((role) => (
                      <span
                            key={role.trim()}
                            className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-xs"
                      >
                            {role.trim()}
                      </span>
                    ))}
                        {project.looking_for.split(',').length > 2 && (
                          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-xs">
                            +{project.looking_for.split(',').length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Project Stats */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      {project.likes_count !== undefined && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {project.likes_count}
                        </span>
                      )}
                      {project.stars_count !== undefined && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {project.stars_count}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-500 dark:text-gray-400">
                      {project.category && (
                        <span className="capitalize">
                          {project.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      )}
                      {project.creator_name && (
                        <span>by {project.creator_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
          ))}
        </div>
        )}

        {/* Load More Button */}
        {projects.length < pagination.total && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Projects'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore; 