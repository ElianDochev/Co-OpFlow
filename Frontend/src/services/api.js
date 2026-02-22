// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    try {
      const { user } = JSON.parse(auth);
      return user?.token || null;
    } catch (error) {
      console.error('Error parsing auth token:', error);
      return null;
    }
  }
  return null;
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint, options = {}, retry = true) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401 && retry) {
      // Try to refresh token
      try {
        const refreshRes = await api.auth.refresh();
        // Save new token to localStorage and update your auth store
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth && auth.user) {
          auth.user.token = refreshRes.access_token;
          localStorage.setItem('auth', JSON.stringify(auth));
        }
        // Retry original request with new token
        return await makeRequest(endpoint, options, false);
      } catch (refreshError) {
        // Refresh failed, force logout
        localStorage.removeItem('auth');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API service object
const api = {
  // Authentication endpoints
  auth: {
    login: async (email, password) => {
      return makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (userData) => {
      return makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    logout: async () => {
      return makeRequest('/auth/logout', {
        method: 'POST',
      });
    },

    refresh: async () => {
      return makeRequest('/auth/refresh', {
        method: 'POST',
      });
    },
  },

  // User management endpoints
  users: {
    // Get all users with pagination and search
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/users${queryString ? `?${queryString}` : ''}`);
    },

    // Get specific user
    getById: async (id) => {
      return makeRequest(`/users/${id}`);
    },

    // Update user profile
    update: async (id, userData) => {
      return makeRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },

    // Delete user account
    delete: async (id) => {
      return makeRequest(`/users/${id}`, {
        method: 'DELETE',
      });
    },

    // Get current user profile
    getMe: async () => {
      return makeRequest('/users/me');
    },

    // Update current user profile
    updateMe: async (userData) => {
      return makeRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },

    // Upload user avatar
    uploadAvatar: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return makeRequest('/users/me/avatar', {
        method: 'POST',
        headers: {}, // Let browser set Content-Type for FormData
        body: formData,
      });
    },

    // Get user's teams
    getMyTeams: async () => {
      return makeRequest('/users/me/teams');
    },

    // Get user's team invitations
    getTeamInvitations: async () => {
      return makeRequest('/users/me/team-invitations');
    },

    // Accept team invitation
    acceptTeamInvitation: async (invitationId) => {
      return makeRequest(`/users/me/team-invitations/${invitationId}/accept`, {
        method: 'POST',
      });
    },

    // Decline team invitation
    declineTeamInvitation: async (invitationId) => {
      return makeRequest(`/users/me/team-invitations/${invitationId}/decline`, {
        method: 'POST',
      });
    },

    // Get user's team applications
    getTeamApplications: async () => {
      return makeRequest('/users/me/team-applications');
    },

    // Get user's registered events
    getRegisteredEvents: async () => {
      return makeRequest('/users/me/registered-events');
    },

    // Get user's investments
    getInvestments: async () => {
      return makeRequest('/users/me/investments');
    },
  },

  // Projects endpoints
  projects: {
    // Get all projects with filtering and pagination
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/projects${queryString ? `?${queryString}` : ''}`);
    },

    // Get specific project
    getById: async (id) => {
      return makeRequest(`/projects/${id}`);
    },

    // Create new project
    create: async (projectData) => {
      return makeRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },

    // Update project
    update: async (id, projectData) => {
      return makeRequest(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      });
    },

    // Delete project
    delete: async (id) => {
      return makeRequest(`/projects/${id}`, {
        method: 'DELETE',
      });
    },

    // Like a project
    like: async (id) => {
      return makeRequest(`/projects/${id}/like`, {
        method: 'POST',
      });
    },

    // Star a project
    star: async (id) => {
      return makeRequest(`/projects/${id}/star`, {
        method: 'POST',
      });
    },

    // Unstar a project
    unstar: async (id) => {
      return makeRequest(`/projects/${id}/star`, {
        method: 'DELETE',
      });
    },

    // Upload project file
    uploadFile: async (id, file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return makeRequest(`/projects/${id}/upload`, {
        method: 'POST',
        headers: {}, // Let browser set Content-Type for FormData
        body: formData,
      });
    },

    // Download project file
    downloadFile: async (id, filename) => {
      return makeRequest(`/projects/${id}/files/${filename}`, {
        method: 'GET',
      });
    },
  },

  // Teams endpoints
  teams: {
    // Get all teams with filtering and pagination
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/teams${queryString ? `?${queryString}` : ''}`);
    },

    // Get specific team
    getById: async (id) => {
      return makeRequest(`/teams/${id}`);
    },

    // Create new team
    create: async (teamData) => {
      return makeRequest('/teams', {
        method: 'POST',
        body: JSON.stringify(teamData),
      });
    },

    // Update team
    update: async (id, teamData) => {
      return makeRequest(`/teams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(teamData),
      });
    },

    // Delete team
    delete: async (id) => {
      return makeRequest(`/teams/${id}`, {
        method: 'DELETE',
      });
    },

    // Apply to join team
    apply: async (id, applicationData) => {
      return makeRequest(`/teams/${id}/apply`, {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });
    },

    // Invite user to team
    invite: async (id, invitationData) => {
      return makeRequest(`/teams/${id}/invite`, {
        method: 'POST',
        body: JSON.stringify(invitationData),
      });
    },

    // Leave team
    leave: async (id) => {
      return makeRequest(`/teams/${id}/leave`, {
        method: 'POST',
      });
    },

    // Legacy methods for backward compatibility
    getMyTeams: async () => {
      return makeRequest('/users/me/teams');
    },

    getInvitations: async () => {
      return makeRequest('/users/me/team-invitations');
    },

    acceptInvitation: async (id) => {
      return makeRequest(`/users/me/team-invitations/${id}/accept`, {
        method: 'POST',
      });
    },

    declineInvitation: async (id) => {
      return makeRequest(`/users/me/team-invitations/${id}/decline`, {
        method: 'POST',
      });
    },

    getApplications: async () => {
      return makeRequest('/users/me/team-applications');
    },
  },

  // Forums endpoints
  forums: {
    // Get forum threads with filtering and pagination
    getThreads: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/forums/threads${queryString ? `?${queryString}` : ''}`);
    },

    // Get specific thread with replies
    getThread: async (id) => {
      return makeRequest(`/forums/threads/${id}`);
    },

    // Create new thread
    createThread: async (threadData) => {
      return makeRequest('/forums/threads', {
        method: 'POST',
        body: JSON.stringify(threadData),
      });
    },

    // Update thread
    updateThread: async (id, threadData) => {
      return makeRequest(`/forums/threads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(threadData),
      });
    },

    // Delete thread
    deleteThread: async (id) => {
      return makeRequest(`/forums/threads/${id}`, {
        method: 'DELETE',
      });
    },

    // Add reply to thread
    addReply: async (id, replyData) => {
      return makeRequest(`/forums/threads/${id}/replies`, {
        method: 'POST',
        body: JSON.stringify(replyData),
      });
    },

    // Update reply
    updateReply: async (replyId, replyData) => {
      return makeRequest(`/forums/replies/${replyId}`, {
        method: 'PUT',
        body: JSON.stringify(replyData),
      });
    },

    // Delete reply
    deleteReply: async (replyId) => {
      return makeRequest(`/forums/replies/${replyId}`, {
        method: 'DELETE',
      });
    },
  },

  // Events endpoints
  events: {
    // Get events list with filtering and pagination
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/events${queryString ? `?${queryString}` : ''}`);
    },

    // Get specific event
    getById: async (id) => {
      return makeRequest(`/events/${id}`);
    },

    // Create new event
    create: async (eventData) => {
      return makeRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    },

    // Update event
    update: async (id, eventData) => {
      return makeRequest(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      });
    },

    // Delete event
    delete: async (id) => {
      return makeRequest(`/events/${id}`, {
        method: 'DELETE',
      });
    },

    // Register for event
    register: async (id, registrationData = {}) => {
      return makeRequest(`/events/${id}/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
    },

    // Unregister from event
    unregister: async (id) => {
      return makeRequest(`/events/${id}/unregister`, {
        method: 'POST',
      });
    },
  },

  // Messaging endpoints (if implemented in backend)
  messages: {
    getChats: async () => {
      return makeRequest('/messages/chats');
    },

    getMessages: async (chatId) => {
      return makeRequest(`/messages/chats/${chatId}/messages`);
    },

    sendMessage: async (chatId, messageData) => {
      return makeRequest(`/messages/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },

    createChat: async (chatData) => {
      return makeRequest('/messages/chats', {
        method: 'POST',
        body: JSON.stringify(chatData),
      });
    },
  },

  // Notifications endpoints (if implemented in backend)
  notifications: {
    getAll: async () => {
      return makeRequest('/notifications');
    },

    markAsRead: async (id) => {
      return makeRequest(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    },

    markAllAsRead: async () => {
      return makeRequest('/notifications/mark-all-read', {
        method: 'PUT',
      });
    },
  },

  // Legacy community endpoints (for backward compatibility)
  community: {
    // Forum threads (redirects to forums)
    getThreads: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/forums/threads${queryString ? `?${queryString}` : ''}`);
    },

    getThread: async (id) => {
      return makeRequest(`/forums/threads/${id}`);
    },

    createThread: async (threadData) => {
      return makeRequest('/forums/threads', {
        method: 'POST',
        body: JSON.stringify(threadData),
      });
    },

    replyToThread: async (id, replyData) => {
      return makeRequest(`/forums/threads/${id}/replies`, {
        method: 'POST',
        body: JSON.stringify(replyData),
      });
    },

    // Events (redirects to events)
    getEvents: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/events${queryString ? `?${queryString}` : ''}`);
    },

    getEvent: async (id) => {
      return makeRequest(`/events/${id}`);
    },

    createEvent: async (eventData) => {
      return makeRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    },

    registerForEvent: async (id, registrationData) => {
      return makeRequest(`/events/${id}/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
    },

    getRegisteredEvents: async () => {
      return makeRequest('/users/me/registered-events');
    },
  },

  // Funding endpoints (if implemented in backend)
  funding: {
    getStartups: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return makeRequest(`/funding/startups${queryString ? `?${queryString}` : ''}`);
    },

    getStartup: async (id) => {
      return makeRequest(`/funding/startups/${id}`);
    },

    createStartup: async (startupData) => {
      return makeRequest('/funding/startups', {
        method: 'POST',
        body: JSON.stringify(startupData),
      });
    },

    invest: async (id, investmentData) => {
      return makeRequest(`/funding/startups/${id}/invest`, {
        method: 'POST',
        body: JSON.stringify(investmentData),
      });
    },

    getInvestments: async () => {
      return makeRequest('/users/me/investments');
    },

    getPitchDecks: async () => {
      return makeRequest('/funding/pitch-decks');
    },

    getPitchDeck: async (id) => {
      return makeRequest(`/funding/pitch-decks/${id}`);
    },
  },
};

export default api;