'use client';

import { useState, useRef, useEffect } from 'react';
// import { useTheme } from '@/contexts/ThemeContext';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import NotificationsDropdown from '../NotificationsDropdown';
import DevRoleSwitcher from '../DevRoleSwitcher';
import { FiSun, FiMoon, FiUser, FiSettings, FiLogOut, FiTarget, FiEye, FiMenu, FiX } from 'react-icons/fi';
import { Button } from '../ui/button';

export function DashboardHeader() {
  // const { theme, toggleTheme } = useTheme();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  const sidebarOpen = isMobile ? openMobile : open;
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

  // Toggle sidebar visibility
  const handleToggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
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
    <header className="h-16 border-b border-border/30 bg-card/80 backdrop-blur-sm sticky top-0 z-20 px-4 md:px-6">
      <div className="h-full flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle button with animation */}
          <button 
            className="lg:hidden p-2 rounded-full hover:bg-background-secondary transition-colors"
            onClick={handleToggleSidebar}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>

        {/* Center Section with Role Switcher */}
        <div className="flex-1 flex items-center justify-center max-w-md mx-auto">
          <DevRoleSwitcher />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* Theme Toggle Button */}
          <Button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            variant="ghost"
            size="icon"
            className=""
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </Button>

          {/* Focus Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFocusMode(!focusMode)}
            className=""
            aria-label={focusMode ? 'Disable focus mode' : 'Enable focus mode'}
          >
            {focusMode ? <FiTarget className="w-5 h-5 text-primary" /> : <FiEye className="w-5 h-5" />}
          </Button>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className=""
              aria-label="Open profile menu"
            >
              {user?.profileImageUrl ? (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border/30">
                  <Image
                    src={user.profileImageUrl}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white rounded-full font-medium text-sm">
                  {getInitials()}
                </div>
              )}
            </Button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-card border border-border/30 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border/30">
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
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white rounded-full font-medium text-sm mr-3">
                        {getInitials()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-background-secondary transition-colors text-muted-foreground"
                  >
                    <FiUser className="w-4 h-4 mr-3 text-muted-foreground" />
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-background-secondary transition-colors text-muted-foreground"
                  >
                    <FiSettings className="w-4 h-4 mr-3 text-muted-foreground" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-border/30 py-1">
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