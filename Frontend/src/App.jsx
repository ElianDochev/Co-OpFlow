import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginForm from './pages/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import RegisterProfile from './components/auth/RegisterProfile';
import ProfileSetup from './pages/ProfileSetup';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Discover from './pages/discover/Discover';
import Collaborate from './pages/collaborate/Collaborate';
import Community from './pages/community/Community';
import Funding from './pages/funding/Funding';
import Explore from './pages/Explore';
import Landing from './pages/Landing';
import ProjectDetails from './pages/projects/ProjectDetails';
import TeamDetails from './pages/collaborate/TeamDetails';
import ForumDetails from './pages/community/ForumDetails';
import EventDetails from './pages/community/EventDetails';
import FundingDetails from './pages/funding/FundingDetails';
import MyTeams from './pages/MyTeams';
import useThemeStore from './store/themeStore';
import useAuthStore from './store/authStore';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {this.state.error?.message || 'Please try refreshing the page'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, hydrated } = useAuthStore();
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { isDarkMode } = useThemeStore();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize theme from localStorage
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Initialize authentication state
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <Background />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/register/profile" element={<RegisterProfile />} />
              <Route path="/explore" element={<Explore />} />
              
              {/* Public access to main sections - users can browse without login */}
              <Route path="/discover" element={<Discover />} />
              <Route path="/collaborate" element={<Collaborate />} />
              <Route path="/community" element={<Community />} />
              <Route path="/funding" element={<Funding />} />
              
              {/* Public detail pages */}
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/teams/:id" element={<TeamDetails />} />
              <Route path="/forums/:id" element={<ForumDetails />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/funding/:id" element={<FundingDetails />} />
              
              {/* Protected Routes - require authentication */}
              <Route path="/profile-setup" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/messages/:chatId" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile/:id" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/my-teams" element={
                <ProtectedRoute>
                  <MyTeams />
                </ProtectedRoute>
              } />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;