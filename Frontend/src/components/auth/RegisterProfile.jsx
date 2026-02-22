import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const RegisterProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();

  // Get required info from first page
  const requiredData = location.state?.formData || {};

  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    skills: '',
    interests: '',
    portfolio_links: '',
    avatar_url: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, skip = false) => {
    e.preventDefault();
    // Prepare data for API
    let apiData = { ...requiredData };
    if (!skip) {
      apiData = {
        ...apiData,
        bio: formData.bio || '',
        location: formData.location || '',
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        interests: formData.interests ? formData.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
        portfolio_links: formData.portfolio_links ? formData.portfolio_links.split(',').map(s => s.trim()).filter(Boolean) : [],
        avatar_url: formData.avatar_url || '',
      };
    } else {
      apiData = {
        ...apiData,
        bio: '',
        location: '',
        skills: [],
        interests: [],
        portfolio_links: [],
        avatar_url: '',
      };
    }
    const result = await register(apiData);
    if (result.success) {
      navigate('/discover');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Complete your profile (optional)
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            You can skip this step and finish registration, or add more info to help others know you better.
          </p>
        </div>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={e => handleSubmit(e, false)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={2}
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 disabled:opacity-50 border-gray-300 dark:border-gray-700"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 disabled:opacity-50 border-gray-300 dark:border-gray-700"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills (comma separated)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 disabled:opacity-50 border-gray-300 dark:border-gray-700"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python"
              />
            </div>
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Interests (comma separated)
              </label>
              <input
                id="interests"
                name="interests"
                type="text"
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 disabled:opacity-50 border-gray-300 dark:border-gray-700"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g. AI, Web Development, Startups"
              />
            </div>
            <div>
              <label htmlFor="portfolio_links" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Portfolio Links (comma separated)
              </label>
              <input
                id="portfolio_links"
                name="portfolio_links"
                type="text"
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 disabled:opacity-50 border-gray-300 dark:border-gray-700"
                value={formData.portfolio_links}
                onChange={handleChange}
                placeholder="e.g. https://github.com/yourname, https://yourportfolio.com"
              />
            </div>
            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Avatar URL
              </label>
              <input
                id="avatar_url"
                name="avatar_url"
                type="text"
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 disabled:opacity-50 border-gray-300 dark:border-gray-700"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button
              type="button"
              className="w-1/2 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={e => handleSubmit(e, true)}
              disabled={loading}
            >
              Skip
            </button>
            <button
              type="submit"
              className="w-1/2 ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Finish Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProfile; 