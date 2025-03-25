/**
 * @fileoverview LoginForm component for user authentication.
 * Provides email/password and Google login functionality.
 * Uses NextAuth for authentication and redirects users upon successful login.
 *
 * @module components/LoginForm
 */

'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * LoginForm component for user authentication.
 * Allows users to sign in using email/password or Google authentication.
 *
 * @component
 * @returns {JSX.Element} The rendered login form.
 */
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  /**
   * Handles form submission for email/password login.
   * Calls NextAuth's `signIn` method and redirects on success.
   *
   * @async
   * @param {React.FormEvent} e - The form submit event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error && result.error !== 'undefined') {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Authentication error. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles Google login using NextAuth.
   * Redirects users to the dashboard upon successful authentication.
   *
   * @async
   */
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('An error occurred during Google login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
      {error && (
        <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Link href="/forgot-password" className="text-sm text-red-500 hover:text-red-400">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
        </div>
      </div>

      <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        </svg>
        Sign in with Google
      </Button>
    </div>
  );
}
