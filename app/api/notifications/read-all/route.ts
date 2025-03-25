/**
 * @fileoverview API route to mark all unread notifications of the authenticated user as read.
 * This module defines an API endpoint to update the 'isRead' status of all unread notifications for a user in the database.
 * It uses NextAuth.js for authentication and Prisma for database interactions.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/notifications/read-all - Marks all unread notifications of the authenticated user as read.
 *
 * @async
 * @returns {Promise<NextResponse>} A JSON response indicating the success of the operation or an error message.
 */
export async function POST() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Mark all unread notifications of the user as read
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json({ error: "Error marking all notifications as read" }, { status: 500 });
  }
}