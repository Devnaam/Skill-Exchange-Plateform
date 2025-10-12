'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface ReportModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Inappropriate behavior',
  'Spam or misleading information',
  'Harassment or bullying',
  'Fake profile',
  'Safety concern',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  userId,
  userName,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.reason) {
      setError('Please select a reason');
      return;
    }

    setLoading(true);

    try {
      await api.post('/reports/create', {
        reportedId: userId,
        reason: formData.reason,
        description: formData.description || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Report Submitted</h2>
            <p className="text-gray-600">
              Thank you for helping keep our community safe.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Report {userName}</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a reason</option>
              {REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Provide more context about your report..."
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" variant="danger" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
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
