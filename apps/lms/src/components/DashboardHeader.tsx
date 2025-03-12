'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';
import DevRoleSwitcher from './DevRoleSwitcher';

export default function DashboardHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [focusMode, setFocusMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="heading-xl">Supernova LMS</span>
          </Link>
        </div>

        {/* Center Section with Role Switcher */}
        <div className="flex-1 flex justify-center">
          <DevRoleSwitcher />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`hidden md:flex px-4 py-2 rounded-lg border border-border items-center space-x-2 hover:bg-background-secondary ${
              focusMode ? 'bg-button-primary text-white' : 'bg-background text-text-primary'
            }`}
          >
            <span>{focusMode ? '🎯' : '👀'}</span>
            <span className="text-sm">{focusMode ? 'Focus On' : 'Focus Off'}</span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center hover:ring-1 hover:ring-text-primary"
            >
              {user?.profileImageUrl ? (
                <img
                  src={user?.profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full bg-background-secondary"
                />
              ) : (
                <span className="text-md-medium bg-button-primary p-2 rounded-full">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-background border border-border rounded-lg shadow-lg z-50">
                <Link
                  href="/dashboard/profile"
                  className="text-sm block px-4 py-2 hover:bg-background-secondary"
                >
                  👤 My Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-sm block px-4 py-2 hover:bg-background-secondary"
                >
                  ⚙️ Settings
                </Link>
                {/* Theme change */}
                <hr className="my-2 border-border" />
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowProfileMenu(false);
                  }}
                  className="text-sm w-full text-left px-4 py-2 hover:bg-background-secondary"
                >
                  {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-sm w-full text-left px-4 py-2 text-red-500 hover:bg-background-secondary"
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 