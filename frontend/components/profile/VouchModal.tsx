'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useVouches } from '@/hooks/useVouches';

interface VouchModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const VouchModal: React.FC<VouchModalProps> = ({
  userId,
  userName,
  onClose,
  onSuccess,
}) => {
  const { createVouch, loading } = useVouches();
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await createVouch({
      vouchedId: userId,
      rating: formData.rating,
      comment: formData.comment || undefined,
    });

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to submit vouch');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Vouch for {userName}</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-3xl focus:outline-none"
                >
                  {star <= formData.rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment (Optional)
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Vouch'}
            </Button>
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
