'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useConnections } from '@/hooks/useConnections';
import { ConnectionList } from '@/components/connections/ConnectionList';
import { Card } from '@/components/ui/Card';

export default function ConnectionsPage() {
  const { status } = useSession();
  const router = useRouter();
  const {
    connections,
    loading,
    acceptRequest,
    rejectRequest,
    cancelRequest,
  } = useConnections();
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'accepted'>('received');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleAccept = async (id: string) => {
    await acceptRequest(id);
  };

  const handleReject = async (id: string) => {
    await rejectRequest(id);
  };

  const handleCancel = async (id: string) => {
    await cancelRequest(id);
  };

  const handleMessage = (userId: string) => {
    router.push(`/messages?user=${userId}`);
  };

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading connections...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Premium Header with Stats */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative px-6 sm:px-8 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Your Network
                </h1>
                <p className="text-indigo-100 text-lg">
                  Manage connections and grow your skill-sharing community
                </p>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{connections.received.length}</p>
                  <p className="text-xs sm:text-sm text-indigo-100 mt-1">Pending</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{connections.sent.length}</p>
                  <p className="text-xs sm:text-sm text-indigo-100 mt-1">Sent</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{connections.accepted.length}</p>
                  <p className="text-xs sm:text-sm text-indigo-100 mt-1">Connected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('received')}
              className={`relative flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'received'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="relative z-10">Received</span>
              {connections.received.length > 0 && (
                <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  activeTab === 'received' ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                }`}>
                  {connections.received.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`relative flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'sent'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="relative z-10">Sent</span>
              {connections.sent.length > 0 && (
                <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  activeTab === 'sent' ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                }`}>
                  {connections.sent.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`relative flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'accepted'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="relative z-10">Connected</span>
              {connections.accepted.length > 0 && (
                <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  activeTab === 'accepted' ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                }`}>
                  {connections.accepted.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content with smooth transitions */}
        <div className="animate-fadeIn">
          {activeTab === 'received' && (
            <ConnectionList
              connections={connections.received}
              type="received"
              onAccept={handleAccept}
              onReject={handleReject}
              emptyMessage="No pending connection requests"
            />
          )}

          {activeTab === 'sent' && (
            <ConnectionList
              connections={connections.sent}
              type="sent"
              onCancel={handleCancel}
              emptyMessage="No sent connection requests"
            />
          )}

          {activeTab === 'accepted' && (
            <ConnectionList
              connections={connections.accepted}
              type="accepted"
              onMessage={handleMessage}
              emptyMessage="No connections yet. Start by sending connection requests!"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
