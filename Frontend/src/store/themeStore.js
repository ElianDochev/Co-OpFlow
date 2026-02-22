import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: false, // Always set to false
  toggleTheme: () => {
    // Do nothing - always stay in light mode
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    return { isDarkMode: false };
  },
}));

export default useThemeStore;