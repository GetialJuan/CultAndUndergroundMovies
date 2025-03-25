/**
 * @fileoverview AuthProvider component for providing session context to the application.
 * This component wraps the application with NextAuth's SessionProvider, making session
 * data available to all child components.
 *
 * @component
 * @example
 * <AuthProvider>
 * <App />
 * </AuthProvider>
 */

'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * @typedef {Object} AuthProviderProps
 * @property {ReactNode} children - The child components to wrap with SessionProvider.
 */

/**
 * AuthProvider component.
 *
 * @param {AuthProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered AuthProvider component.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}