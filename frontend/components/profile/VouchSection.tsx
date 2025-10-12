'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useVouches } from '@/hooks/useVouches';
import { VouchStats } from '@/types/vouch';
import { formatRelativeTime } from '@/utils/formatters';

interface VouchSectionProps {
  userId: string;
  isOwner?: boolean;
}

export const VouchSection: React.FC<VouchSectionProps> = ({ userId, isOwner = false }) => {
  const { getUserVouches } = useVouches();
  const [vouchStats, setVouchStats] = useState<VouchStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVouches();
  }, [userId]);

  const loadVouches = async () => {
    setLoading(true);
    const stats = await getUserVouches(userId);
    setVouchStats(stats);
    setLoading(false);
  };

  if (loading) {
    return <Card><p className="text-gray-500">Loading vouches...</p></Card>;
  }

  if (!vouchStats) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">Vouches</h3>
          {vouchStats.count > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl">⭐</span>
              <span className="text-lg font-semibold">{vouchStats.averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-600">({vouchStats.count} vouches)</span>
            </div>
          )}
        </div>
      </div>

      {vouchStats.vouches.length === 0 ? (
        <p className="text-gray-500">No vouches yet</p>
      ) : (
        <div className="space-y-4">
          {vouchStats.vouches.map((vouch) => (
            <div key={vouch.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <Avatar
                  firstName={vouch.voucher.firstName}
                  lastName={vouch.voucher.lastName}
                  src={vouch.voucher.profileImage}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {vouch.voucher.firstName} {vouch.voucher.lastName}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(vouch.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                  </div>
                  {vouch.comment && (
                    <p className="text-sm text-gray-700 mt-2">{vouch.comment}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(vouch.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
