'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import NotificationsDropdown from './NotificationsDropdown';
import DevRoleSwitcher from './DevRoleSwitcher';
import { FiSun, FiMoon, FiUser, FiSettings, FiLogOut, FiTarget, FiEye } from 'react-icons/fi';

export default function DashboardHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [focusMode, setFocusMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Generate initials for avatar if no profile image
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Center Section with Role Switcher */}
        <div className="flex-1 flex justify-center max-w-md mx-auto">
          <DevRoleSwitcher />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-text-primary hover:bg-background-secondary transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`hidden md:flex items-center justify-center p-2.5 rounded-full transition-colors ${
              focusMode 
                ? 'bg-button-primary text-white hover:bg-button-primary/90' 
                : 'text-text-primary hover:bg-background-secondary'
            }`}
            aria-label={focusMode ? 'Disable focus mode' : 'Enable focus mode'}
          >
            {focusMode ? <FiTarget className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center ml-1.5 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-button-primary focus:ring-offset-2 focus:ring-offset-background rounded-full"
              aria-label="Open profile menu"
            >
              {user?.profileImageUrl ? (
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-background">
                  <Image
                    src={user.profileImageUrl}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-button-primary to-button-secondary text-white rounded-full font-medium text-sm">
                  {getInitials()}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center">
                    {user?.profileImageUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={user.profileImageUrl}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-button-primary to-button-secondary text-white rounded-full font-medium text-sm mr-3">
                        {getInitials()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-background-secondary transition-colors"
                  >
                    <FiUser className="w-4 h-4 mr-3 text-text-secondary" />
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-background-secondary transition-colors"
                  >
                    <FiSettings className="w-4 h-4 mr-3 text-text-secondary" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-border py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-background-secondary transition-colors"
                  >
                    <FiLogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 