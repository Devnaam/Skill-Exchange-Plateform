'use client';

import { useEffect, useState } from 'react';  // ← ADD useEffect here
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
    console.log('handleMessage called with userId:', userId);
    router.push(`/messages?user=${userId}`);
  };

  if (loading || status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading connections...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
          <p className="text-gray-600 mt-2">
            Manage your connection requests and connected users
          </p>
        </div>

        <Card>
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Received ({connections.received.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent ({connections.sent.length})
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'accepted'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Connected ({connections.accepted.length})
            </button>
          </div>
        </Card>

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
    </DashboardLayout>
  );
}
