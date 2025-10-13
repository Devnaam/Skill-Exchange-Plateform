'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateEmail, validatePassword, validateRequired } from '@/utils/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const firstNameValidation = validateRequired(formData.firstName, 'First name');
    if (!firstNameValidation.valid) newErrors.firstName = firstNameValidation.message!;

    const lastNameValidation = validateRequired(formData.lastName, 'Last name');
    if (!lastNameValidation.valid) newErrors.lastName = lastNameValidation.message!;

    const emailValidation = validateRequired(formData.email, 'Email');
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message!;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.message!;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location || undefined,
        }
      );

      if (response.data.token) {
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-indigo-600">SkillExchange</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the skill exchange community
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                error={errors.firstName}
                placeholder="John"
              />
              <Input
                label="Last Name"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                error={errors.lastName}
                placeholder="Doe"
              />
            </div>

            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              placeholder="your.email@example.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              placeholder="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              placeholder="Re-enter password"
            />

            <Input
              label="Location (City, Area)"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., Downtown, Mumbai"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
