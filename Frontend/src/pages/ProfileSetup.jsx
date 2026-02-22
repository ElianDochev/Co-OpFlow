import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  LinkIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    location: '',
    education: '',
    skills: '',
    interests: '',
    portfolio: '',
    avatar: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Professional title is required';
    }
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // TODO: Implement profile setup logic
      console.log('Profile setup form submitted:', formData);
      navigate('/profile');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Tell us more about yourself to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {formData.avatar ? (
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700"
              >
                <PhotoIcon className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Professional Title
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="Software Engineer"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="Tell us about yourself..."
                />
              </div>
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.bio}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="San Francisco, CA"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Education
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="education"
                  id="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="Bachelor's in Computer Science"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Skills
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="React, Node.js, Python (comma separated)"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="interests"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Interests
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="interests"
                  id="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="AI, Web Development, UX Design (comma separated)"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="portfolio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Portfolio URL
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  name="portfolio"
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup; 