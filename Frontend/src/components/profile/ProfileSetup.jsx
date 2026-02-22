import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProfileSetup = () => {
  const [profile, setProfile] = useState({
    skills: [],
    interests: [],
    portfolioLinks: [],
    bio: '',
    location: '',
    newSkill: '',
    newInterest: '',
    newPortfolioLink: '',
  });

  const handleAddSkill = () => {
    if (profile.newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const handleAddInterest = () => {
    if (profile.newInterest.trim()) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, prev.newInterest.trim()],
        newInterest: ''
      }));
    }
  };

  const handleAddPortfolioLink = () => {
    if (profile.newPortfolioLink.trim()) {
      setProfile(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, prev.newPortfolioLink.trim()],
        newPortfolioLink: ''
      }));
    }
  };

  const handleRemoveItem = (type, index) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Complete Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('skills', index)}
                      className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex">
                <input
                  type="text"
                  value={profile.newSkill}
                  onChange={(e) => setProfile(prev => ({ ...prev, newSkill: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Interests
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('interests', index)}
                      className="ml-2 inline-flex items-center p-0.5 rounded-full text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex">
                <input
                  type="text"
                  value={profile.newInterest}
                  onChange={(e) => setProfile(prev => ({ ...prev, newInterest: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="Add an interest"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Portfolio Links
              </label>
              <div className="mt-1 space-y-2">
                {profile.portfolioLinks.map((link, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={link}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('portfolioLinks', index)}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex">
                <input
                  type="url"
                  value={profile.newPortfolioLink}
                  onChange={(e) => setProfile(prev => ({ ...prev, newPortfolioLink: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="Add a portfolio link"
                />
                <button
                  type="button"
                  onClick={handleAddPortfolioLink}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 