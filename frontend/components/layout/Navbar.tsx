'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { useMessages } from '@/hooks/useMessages';

export const Navbar = () => {
  const { data: session, status } = useSession();
  const { unreadCount } = useMessages();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-indigo-600">
              SkillExchange
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {status === 'authenticated' ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/feed"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Feed
                </Link>
                <Link
                  href="/matches"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Matches
                </Link>
                <Link
                  href="/connections"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Connections
                </Link>
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-indigo-600 font-medium relative transition-colors"
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-3">
                  <Link href="/profile">
                    <Avatar
                      firstName={session.user.firstName}
                      lastName={session.user.lastName}
                      src={session.user.profileImage}
                      size="sm"
                    />
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {status === 'authenticated' ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-3 border-b">
                  <Avatar
                    firstName={session.user.firstName}
                    lastName={session.user.lastName}
                    src={session.user.profileImage}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.firstName} {session.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/feed"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={toggleMenu}
                >
                  Feed
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={toggleMenu}
                >
                  My Profile
                </Link>
                <Link
                  href="/skills"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={toggleMenu}
                >
                  My Skills
                </Link>
                <Link
                  href="/matches"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={toggleMenu}
                >
                  Find Matches
                </Link>
                <Link
                  href="/connections"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={toggleMenu}
                >
                  Connections
                </Link>
                <Link
                  href="/messages"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 relative"
                  onClick={toggleMenu}
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => {
                    toggleMenu();
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
