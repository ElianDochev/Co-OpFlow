import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const MyTeams = () => {
  const [activeTab, setActiveTab] = useState('my-teams');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    skills: '',
    looking_for: '',
  });
  const [editTeam, setEditTeam] = useState({
    id: '',
    name: '',
    description: '',
    skills: '',
    looking_for: '',
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    role: '',
    message: '',
  });
  const [invitations, setInvitations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const { user: currentUser } = useAuthStore();

  // Fetch user's teams, invitations, and applications
  const fetchTeamsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [teams, invs, apps] = await Promise.all([
        api.teams.getMyTeams(),
        api.teams.getInvitations(),
        api.teams.getApplications(),
      ]);
      setMyTeams(teams || []);
      setInvitations(invs || []);
      setApplications(apps || []);
    } catch (err) {
      setError('Failed to load teams data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsData();
  }, []);

  // Create team
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.teams.create({
        name: newTeam.name,
        description: newTeam.description,
        skills: newTeam.skills.split(',').map(s => s.trim()).filter(Boolean),
        looking_for: newTeam.looking_for,
        image_url: '',
      });
      setShowCreateModal(false);
      setNewTeam({ name: '', description: '', skills: '', looking_for: '' });
      fetchTeamsData();
    } catch (err) {
      alert('Failed to create team.');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit team
  const handleEditTeam = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.teams.update(editTeam.id, {
        name: editTeam.name,
        description: editTeam.description,
        skills: editTeam.skills.split(',').map(s => s.trim()).filter(Boolean),
        looking_for: editTeam.looking_for,
      });
      setShowEditModal(false);
      setEditTeam({ id: '', name: '', description: '', skills: '', looking_for: '' });
      fetchTeamsData();
    } catch (err) {
      alert('Failed to update team.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    setActionLoading(true);
    try {
      await api.teams.delete(teamId);
      fetchTeamsData();
    } catch (err) {
      alert('Failed to delete team.');
    } finally {
      setActionLoading(false);
    }
  };

  // Invite member
  const handleInviteMember = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.teams.invite(selectedTeam.id, inviteData);
    setShowInviteModal(false);
    setInviteData({ email: '', role: '', message: '' });
    setSelectedTeam(null);
      fetchTeamsData();
    } catch (err) {
      alert('Failed to send invitation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Leave team
  const handleLeaveTeam = async () => {
    setActionLoading(true);
    try {
      await api.teams.leave(selectedTeam.id);
    setShowLeaveModal(false);
    setSelectedTeam(null);
      fetchTeamsData();
    } catch (err) {
      alert('Failed to leave team.');
    } finally {
      setActionLoading(false);
    }
  };

  // Accept/decline invitation
  const handleInvitationResponse = async (invitationId, response) => {
    setActionLoading(true);
    try {
      if (response === 'accept') {
        await api.teams.acceptInvitation(invitationId);
      } else {
        await api.teams.declineInvitation(invitationId);
      }
      fetchTeamsData();
    } catch (err) {
      alert('Failed to respond to invitation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Apply to team
  const handleApplyToTeam = async (teamId, applicationData) => {
    setActionLoading(true);
    try {
      await api.teams.apply(teamId, applicationData);
      fetchTeamsData();
    } catch (err) {
      alert('Failed to apply to team.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Teams
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your teams, invitations, and applications.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Team
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('my-teams')}
            className={`${
              activeTab === 'my-teams'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            My Teams ({myTeams.length})
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`${
              activeTab === 'invitations'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Invitations ({invitations.filter(inv => inv.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`${
              activeTab === 'applications'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Applications ({applications.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'my-teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTeams.map((team) => {
            const isLead = currentUser && team.lead_id && currentUser.id === team.lead_id;
            return (
              <div
                key={team.id}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4 mb-4">
                  {team.avatar ? (
                    <img
                      src={team.avatar}
                      alt={team.name}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    (() => {
                      // Deterministic gradient selection based on team id or name
                      const gradients = [
                        ['from-pink-200', 'to-yellow-200', 'dark:from-pink-900', 'dark:to-yellow-900'],
                        ['from-indigo-100', 'to-purple-100', 'dark:from-indigo-900', 'dark:to-purple-900'],
                        ['from-green-100', 'to-blue-100', 'dark:from-green-900', 'dark:to-blue-900'],
                        ['from-yellow-100', 'to-pink-100', 'dark:from-yellow-900', 'dark:to-pink-900'],
                        ['from-blue-100', 'to-cyan-100', 'dark:from-blue-900', 'dark:to-cyan-900'],
                        ['from-purple-100', 'to-fuchsia-100', 'dark:from-purple-900', 'dark:to-fuchsia-900'],
                      ];
                      const hash = (team.id || team.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                      const grad = gradients[hash % gradients.length];
                      return (
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${grad[0]} ${grad[1]} ${grad[2]} ${grad[3]}`}> 
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="opacity-90"
                            aria-label="Team placeholder"
                          >
                            {/* Background circle */}
                            <circle cx="24" cy="24" r="22" fill="#c7d2fe" opacity="0.3" />
                            {/* Main person */}
                            <circle cx="24" cy="22" r="7" fill="#6366f1" />
                            <ellipse cx="24" cy="36" rx="10" ry="6" fill="#818cf8" />
                            {/* Side persons */}
                            <circle cx="12" cy="26" r="4" fill="#a5b4fc" />
                            <ellipse cx="12" cy="36" rx="5" ry="3" fill="#c7d2fe" />
                            <circle cx="36" cy="26" r="4" fill="#a5b4fc" />
                            <ellipse cx="36" cy="36" rx="5" ry="3" fill="#c7d2fe" />
                            {/* Decorative dots */}
                            <circle cx="8" cy="10" r="1" fill="#fbbf24" />
                            <circle cx="40" cy="12" r="1.2" fill="#f472b6" />
                            <circle cx="24" cy="44" r="0.8" fill="#34d399" />
                          </svg>
                        </div>
                      );
                    })()
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {team.name}
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      {team.role}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                      {team.status}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Project: {team.project}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {team.members} members • Joined {team.joinedDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/teams/${team.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  {isLead ? (
                    <>
                      <button
                        onClick={() => {
                          setEditTeam({
                            id: team.id,
                            name: team.name,
                            description: team.description,
                            skills: Array.isArray(team.skills) ? team.skills.join(', ') : team.skills || '',
                            looking_for: team.looking_for || '',
                          });
                          setShowEditModal(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-yellow-300 dark:border-yellow-600 text-sm font-medium rounded-md text-yellow-700 dark:text-yellow-200 bg-white dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowLeaveModal(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                      Leave
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'invitations' && (
        <div className="space-y-6">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {invitation.teamName}
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Invited as: {invitation.role}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Invited by {invitation.invitedBy} • {invitation.receivedDate}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                  {invitation.status}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {invitation.message}
                </p>
              </div>
              
              {invitation.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleInvitationResponse(invitation.id, 'decline')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {application.teamName}
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Applied for: {application.appliedFor}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Applied on {application.appliedDate}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                  {application.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Cover Letter:</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {application.coverLetter.substring(0, 150)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Team</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={newTeam.skills}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="React, Node.js, Python"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Looking For
                </label>
                <input
                  type="text"
                  value={newTeam.looking_for}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, looking_for: e.target.value }))}
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Invite to {selectedTeam?.name}
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={inviteData.role}
                  onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
                  required
                  placeholder="Frontend Developer"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Personal Message
                </label>
                <textarea
                  value={inviteData.message}
                  onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  placeholder="Tell them why you'd like them to join your team..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Team Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Leave Team
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to leave <strong>{selectedTeam?.name}</strong>? 
              This action cannot be undone and you'll need to be re-invited to rejoin.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveTeam}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Leave Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Team</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleEditTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={editTeam.name}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editTeam.description}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={editTeam.skills}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="React, Node.js, Python"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Looking For
                </label>
                <input
                  type="text"
                  value={editTeam.looking_for}
                  onChange={(e) => setEditTeam(prev => ({ ...prev, looking_for: e.target.value }))}
                  placeholder="Frontend Developer, Designer"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeams;