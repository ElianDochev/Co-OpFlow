import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { id } = useParams();
  const isOwnProfile = !id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const navigate = useNavigate();
  const { hydrated, isAuthenticated, user: currentUser } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchProfile = async () => {
      try {
        const data = isOwnProfile ? await api.users.getMe() : await api.users.getById(id);
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, isOwnProfile]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Profile not found.'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated and viewing own profile, redirect to login
  if (!isAuthenticated && isOwnProfile) {
    window.location.href = '/login';
    return null;
  }

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.users.update(profile.id, {
        name: editProfile.name,
        bio: editProfile.bio,
        location: editProfile.location,
        skills: editProfile.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: editProfile.interests.split(',').map(s => s.trim()).filter(Boolean),
        portfolio_links: editProfile.portfolio_links.split(',').map(s => s.trim()).filter(Boolean),
        avatar_url: editProfile.avatar_url,
      });
      setShowEditModal(false);
      // Refresh profile
      const data = isOwnProfile ? await api.users.getMe() : await api.users.getById(id);
      setProfile(data);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button for external profiles */}
      {!isOwnProfile && (
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
      )}

      {/* Profile Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <UserIcon className="h-24 w-24 text-gray-400" />
              {!isOwnProfile && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {profile.role || profile.title}
              </p>
              <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400 space-x-4">
                <span className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  {profile.location}
                </span>
                {!isOwnProfile && profile.rating && (
                    <span className="flex items-center">
                      <StarIcon className="h-5 w-5 mr-1 text-yellow-500" />
                      {profile.rating}
                    </span>
                )}
                {!isOwnProfile && profile.experience && (
                    <span className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-1" />
                      {profile.experience} experience
                    </span>
                )}
              </div>
              
            </div>
             {/* More profile details (education, contact, skills, projects, teams, etc.) can be added here as needed */}
      {isOwnProfile && (
        <button
          onClick={() => {
            setEditProfile({
              name: profile.name || '',
              bio: profile.bio || '',
              location: profile.location || '',
              skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
              interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : '',
              portfolio_links: Array.isArray(profile.portfolio_links) ? profile.portfolio_links.join(', ') : '',
              avatar_url: profile.avatar_url || '',
            });
            setShowEditModal(true);
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mb-4"
        >
          Edit Profile
        </button>
      )}
          </div>
          {!isOwnProfile && (
            <div className="flex space-x-4">
              {!isOwnProfile && (
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  onClick={async () => {
                    if (!currentUser?.id) {
                      alert('Please log in to send messages.');
                      return;
                    }
                    
                    setMessageLoading(true);
                    // Create chat with current user and profile user
                    const chatName = `${profile.name}`;
                    const participant_ids = [currentUser?.id, profile.id];
                    try {
                      const chat = await api.messages.createChat({
                        name: chatName,
                        is_group: false,
                        participant_ids,
                      });
                      // Navigate to the chat/messages page
                      navigate(`/messages/${chat.id}`);
                    } catch (err) {
                      console.error('Failed to create chat:', err);
                      alert('Failed to create chat. Please try again.');
                    } finally {
                      setMessageLoading(false);
                    }
                  }}
                  disabled={messageLoading}
                >
                  {messageLoading ? 'Creating...' : 'Message'}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
        </div>

        <div className="mt-6 flex space-x-6">
          <div className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              {(profile.projects?.length || 0)} Projects
            </span>
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              {(profile.teams?.length || 0)} Teams
            </span>
          </div>
          {!isOwnProfile && profile.website && (
            <div className="flex items-center">
              <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
              <a 
                href={`https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Skills Section */}
      {Array.isArray(profile.skills) && profile.skills.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">{skill}</span>
              ))}
            </div>
          </div>
      )}

      {/* Interests Section */}
      {Array.isArray(profile.interests) && profile.interests.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">{interest}</span>
              ))}
          </div>
        </div>
      )}

      {/* Portfolio Links Section */}
      {Array.isArray(profile.portfolio_links) && profile.portfolio_links.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Portfolio Links</h2>
          <ul className="list-disc pl-6 space-y-2">
            {profile.portfolio_links.map((link, idx) => (
              <li key={idx}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline break-all">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

     

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={editProfile.name}
                  onChange={e => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea
                  value={editProfile.bio}
                  onChange={e => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={editProfile.location}
                  onChange={e => setEditProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editProfile.skills}
                  onChange={e => setEditProfile(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="React, Node.js, Python"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests (comma separated)</label>
                <input
                  type="text"
                  value={editProfile.interests}
                  onChange={e => setEditProfile(prev => ({ ...prev, interests: e.target.value }))}
                  placeholder="AI, Web Development, Design"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portfolio Links (comma separated)</label>
                <input
                  type="text"
                  value={editProfile.portfolio_links}
                  onChange={e => setEditProfile(prev => ({ ...prev, portfolio_links: e.target.value }))}
                  placeholder="https://github.com/yourname, https://yourportfolio.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={editProfile.avatar_url}
                  onChange={e => setEditProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;