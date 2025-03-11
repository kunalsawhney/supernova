'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-button-primary">Supernova</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link href="/courses" className="nav-link">
              Courses
            </Link>
            <Link href="/progress" className="nav-link">
              Progress
            </Link>
            <ThemeToggle />
            <button className="btn-primary">
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-text-primary"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/dashboard"
                className="block px-3 py-2 nav-link"
              >
                Dashboard
              </Link>
              <Link
                href="/courses"
                className="block px-3 py-2 nav-link"
              >
                Courses
              </Link>
              <Link
                href="/progress"
                className="block px-3 py-2 nav-link"
              >
                Progress
              </Link>
              <button className="w-full mt-2 btn-primary">
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 