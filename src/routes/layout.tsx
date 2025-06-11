import { component$, Slot, useSignal, $ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

/**
 * Modern layout component for the time tracking application
 * Features a sleek top navigation bar with gradient design
 * Matches the modern aesthetic of the application
 */
export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  // State for mobile menu
  const isMobileMenuOpen = useSignal(false);
  
  // Navigation items with modern icons
  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      description: 'Overview and statistics' 
    },
    { 
      path: '/entry', 
      label: 'Time Entry', 
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Add new time entries' 
    },
    { 
      path: '/calendar', 
      label: 'Calendar', 
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'View entries by date' 
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
        </svg>
      ),
      description: 'Analytics and exports' 
    }
  ];

  // Get current path for active navigation highlighting
  const currentPath = globalThis?.location?.pathname || '/';

  const toggleMobileMenu = $(() => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Top Navigation */}
      <nav class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            
            {/* Logo/Brand */}
            <div class="flex items-center space-x-3">
              <a href="/" class="flex items-center space-x-3 group">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="hidden sm:block">
                  <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    TimeTracker
                  </h1>
                  <p class="text-xs text-gray-500 dark:text-gray-400 -mt-1">Professional Time Management</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div class="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <a 
                  key={item.path}
                  href={item.path}
                  class={`group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 relative ${
                    currentPath === item.path 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                  title={item.description}
                >
                  <span class={`transition-colors duration-200 ${
                    currentPath === item.path ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                  }`}>
                    {item.icon}
                  </span>
                  <span class="text-sm font-semibold">{item.label}</span>
                  
                  {/* Active indicator */}
                  {currentPath === item.path && (
                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
                  )}
                </a>
              ))}
            </div>

            {/* Right side controls */}
            <div class="flex items-center space-x-4">
              
              {/* Theme Toggle */}
              <div class="relative group">
                <button class="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
                
                {/* Theme dropdown would go here - simplified for now */}
              </div>

              {/* User Profile */}
              <div class="flex items-center space-x-3">
                <div class="hidden lg:block text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">John Doe</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200">
                  <span class="text-white font-bold text-sm">JD</span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button 
                class="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                onClick$={toggleMobileMenu}
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen.value && (
          <div class="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/20">
            <div class="px-4 py-6 space-y-3">
              {navItems.map((item) => (
                <a 
                  key={item.path}
                  href={item.path}
                  class={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentPath === item.path 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                  onClick$={() => isMobileMenuOpen.value = false}
                >
                  <span class={`${currentPath === item.path ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <div>
                    <div class="font-semibold">{item.label}</div>
                    <div class={`text-xs ${currentPath === item.path ? 'text-white/80' : 'text-gray-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </a>
              ))}
              
              {/* Mobile User Info */}
              <div class="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
                <div class="flex items-center space-x-3 px-4 py-2">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-sm">JD</span>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">John Doe</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main class="min-h-[calc(100vh-4rem)]">
        <Slot />
      </main>

      {/* Modern Footer */}
      <footer class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/20 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div class="col-span-1 md:col-span-2">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">TimeTracker</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                Professional time management solution built with modern technologies. 
                Track, analyze, and optimize your productivity with beautiful, intuitive interfaces.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
              <div class="space-y-2">
                <a href="/about" class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">About</a>
                <a href="/contact" class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Contact</a>
                <a href="/help" class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Help & Support</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <div class="space-y-2">
                <a href="/privacy" class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Privacy Policy</a>
                <a href="/terms" class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Terms of Service</a>
                <a href="/cookies" class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Cookie Policy</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
            <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                © 2024 TimeTracker. Built with Qwik & Modern UI Principles.
              </p>
              <div class="flex items-center space-x-6">
                <span class="text-sm text-gray-500 dark:text-gray-400">Made with ❤️ for productivity</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}); 