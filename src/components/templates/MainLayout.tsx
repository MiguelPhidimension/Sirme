import { component$, Slot, useSignal, $ } from "@builder.io/qwik";

/**
 * MainLayout Template Component
 * Provides the main application layout structure with navigation and footer.
 * This template arranges organisms and provides the overall page layout.
 * 
 * Props: None (templates typically handle layout structure)
 * 
 * Example usage:
 * <MainLayout>
 *   <HomePage />
 * </MainLayout>
 */
export const MainLayout = component$(() => {
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
      {/* <footer class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/20 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> */}
            
            {/* Brand Section */}
            {/* <div class="col-span-1 md:col-span-2">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-lg font-bold text-gray-900 dark:text-white">TimeTracker Pro</span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Professional time management solution designed for modern teams. 
                Track, analyze, and optimize your productivity with our intuitive interface.
              </p>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-500 hover:text-blue-500 transition-colors duration-200">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="text-gray-500 hover:text-blue-500 transition-colors duration-200">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div> */}

            {/* Quick Links */}
            {/* <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Features</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Time Tracking</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Analytics</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Reporting</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Team Management</a></li>
              </ul>
            </div> */}

            {/* Support */}
            {/* <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Help Center</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Documentation</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">System Status</a></li>
              </ul>
            </div>
          </div> */}
          
          {/* Bottom Footer */}
          {/* <div class="border-t border-gray-200 dark:border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 TimeTracker Pro. All rights reserved.
            </p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Terms of Service</a>
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div> */}
      {/* </footer> */}
    </div>
  );
}); 