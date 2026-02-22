import { useState, useEffect } from 'react';
import api from '../services/api';

// Custom hook for API calls with loading and error states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Hook for mutations (POST, PUT, DELETE)
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

// Specific hooks for common API calls
export const useProjects = (params = {}) => {
  return useApi(() => api.projects.getAll(params), [JSON.stringify(params)]);
};

export const useProject = (id) => {
  return useApi(() => api.projects.getById(id), [id]);
};

export const useTeams = (params = {}) => {
  return useApi(() => api.teams.getAll(params), [JSON.stringify(params)]);
};

export const useTeam = (id) => {
  return useApi(() => api.teams.getById(id), [id]);
};

export const useEvents = (params = {}) => {
  return useApi(() => api.community.getEvents(params), [JSON.stringify(params)]);
};

export const useEvent = (id) => {
  return useApi(() => api.community.getEvent(id), [id]);
};

export const useStartups = (params = {}) => {
  return useApi(() => api.funding.getStartups(params), [JSON.stringify(params)]);
};

export const useStartup = (id) => {
  return useApi(() => api.funding.getStartup(id), [id]);
};

export const useNotifications = () => {
  return useApi(() => api.notifications.getAll(), []);
};

export const useMessages = () => {
  return useApi(() => api.messages.getChats(), []);
};

export const useUserProfile = () => {
  return useApi(() => api.users.getMe(), []);
};

export default api;