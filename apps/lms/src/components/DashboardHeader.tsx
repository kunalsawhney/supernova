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
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl">🚀</span>
          <span className="font-bold text-lg text-text-primary">Supernova LMS</span>
        </Link>

        {/* Center Section with Role Switcher */}
        <div className="flex-1 flex justify-center">
          <DevRoleSwitcher />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`hidden md:flex px-4 py-2 rounded-lg border border-border items-center space-x-2 ${
              focusMode ? 'bg-button-primary text-white' : 'bg-background text-text-primary'
            }`}
          >
            <span>{focusMode ? '🎯' : '👀'}</span>
            <span className="text-sm">{focusMode ? 'Focus On' : 'Focus Off'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <img
                src={user?.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full bg-background-secondary"
              />
              <span className="hidden md:inline text-text-primary">{user?.name}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-background border border-border rounded-lg shadow-lg z-50">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-text-primary hover:bg-background-secondary"
                >
                  👤 My Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-text-primary hover:bg-background-secondary"
                >
                  ⚙️ Settings
                </Link>
                <hr className="my-2 border-border" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-background-secondary"
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