import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Discover', path: '/discover' },
    { name: 'Collaborate', path: '/collaborate' },
    { name: 'Community', path: '/community' },
    { name: 'Funding', path: '/funding' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white/10 dark:bg-black/10 shadow-lg backdrop-blur-md border-b border-white/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-space font-bold tracking-tight text-gray-900 dark:text-white">
              <img
                src="/logo-trans-bg.png"
                alt="Co-OpFlow logo"
                className="h-9 w-9 object-contain"
              />
              <span>Co-OpFlow</span>
            </Link>
            
            {/* Desktop Navigation - Only show navigation items if authenticated */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {isAuthenticated && navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-space font-medium tracking-wide"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-teams"
                  className="text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <UserGroupIcon className="h-5 w-5 mr-1" />
                </Link>

                <Link
                  to="/messages"
                  className="text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                </Link>
{/* 
                <Link
                  to="/notifications"
                  className="text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <BellIcon className="h-5 w-5 mr-1" />
                </Link> */}

                {/* <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-indigo-400/20 dark:hover:bg-indigo-900/20 transition-colors duration-200"
                >
                  {isDarkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button> */}

                <Link
                  to="/profile"
                  className="text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                </button>
              </>
            ) : (
              <>
                {/* <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-indigo-400/20 dark:hover:bg-indigo-900/20 transition-colors duration-200"
                >
                  {isDarkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button> */}

                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          {/* Only show navigation in mobile if authenticated */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated && navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <UserIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-100">{user?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/my-teams"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  My Teams
                </Link>
                <Link
                  to="/messages"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Messages
                </Link>
                {/* <Link
                  to="/notifications"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BellIcon className="h-5 w-5 mr-2" />
                  Notifications
                </Link> */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {isDarkMode ? (
                    <>
                      <SunIcon className="h-5 w-5 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleTheme}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                {isDarkMode ? (
                  <>
                    <SunIcon className="h-5 w-5 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-5 w-5 mr-2" />
                    Dark Mode
                  </>
                )}
              </button>
              <Link
                to="/login"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;