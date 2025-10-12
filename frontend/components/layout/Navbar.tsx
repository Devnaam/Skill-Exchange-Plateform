'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { useMessages } from '@/hooks/useMessages';

export const Navbar = () => {
  const { data: session, status } = useSession();
  const { unreadCount } = useMessages();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              SkillExchange
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {status === 'authenticated' ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/matches"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Matches
                </Link>
                <Link
                  href="/connections"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Connections
                </Link>
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-indigo-600 font-medium relative"
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
                    className="text-gray-700 hover:text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
