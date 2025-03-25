/**
 * @fileoverview NextAuth.js API route handler.
 * This module sets up the NextAuth.js API route, exporting handlers for GET and POST requests.
 * It imports the authentication options from '@/lib/auth'.
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth.js route handler.
 *
 * @constant
 */
const handler = NextAuth(authOptions);

/**
 * Exported GET request handler.
 *
 * @constant
 * @type {typeof handler}
 */
export { handler as GET, handler as POST };