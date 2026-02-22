import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  hydrated: false,
  
  login: async (email, password) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.auth.login(email, password);
      
      // Store the user data and token
      const userData = {
        ...response.user,
        token: response.access_token
      };
      
      set({ 
        isAuthenticated: true, 
        user: userData,
        loading: false,
        error: null
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ 
        isAuthenticated: true, 
        user: userData 
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      set({ 
        isAuthenticated: false, 
        user: null,
        loading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },
  
  register: async (userData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.auth.register(userData);
      
      // Store the user data and token
      const newUserData = {
        ...response.user,
        token: response.access_token
      };
      
      set({ 
        isAuthenticated: true, 
        user: newUserData,
        loading: false,
        error: null
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ 
        isAuthenticated: true, 
        user: newUserData 
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      set({ 
        isAuthenticated: false, 
        user: null,
        loading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },
  
  logout: async () => {
    try {
      // Call logout API if user is authenticated
      if (get().isAuthenticated) {
        await api.auth.logout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    set({ isAuthenticated: false, user: null, loading: false, error: null });
    localStorage.removeItem('auth');
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  initializeAuth: () => {
    // Check localStorage for existing auth state
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { isAuthenticated, user } = JSON.parse(storedAuth);
        if (isAuthenticated && user) {
          set({ isAuthenticated, user });
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('auth');
      }
    }
    set({ hydrated: true });
  },
}));

export default useAuthStore;