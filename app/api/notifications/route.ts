/**
 * @fileoverview API route to fetch notifications for the authenticated user.
 * This module defines an API endpoint to retrieve notifications for the authenticated user,
 * ordered by read status and creation date, with optional limit.
 * It uses NextAuth.js for authentication and Prisma for database interactions.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/notifications - Fetches notifications for the authenticated user.
 *
 * @async
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} A JSON response containing an array of notifications or an error message.
 */
export async function GET(request: Request) {
  console.log("GET /api/notifications");
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "5", 10); // Default: 5

  console.log("Esteee: " + session.user.id)

  try {
    // Fetch notifications for the user, ordered by read status and creation date
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { isRead: "asc" }, // First unread (false), then read (true)
        { createdAt: "desc" }, // Most recent first
      ],
      take: limit, // Limit notifications
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 });
  }
}