/**
 * @fileoverview API route to mark a specific notification as read.
 * This module defines an API endpoint to update the 'isRead' status of a single notification identified by its ID.
 * It uses NextAuth.js for authentication and Prisma for database interactions.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/notifications/[id]/read - Marks a specific notification as read.
 *
 * @async
 * @param {Request} request - The incoming request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the notification to mark as read.
 * @returns {Promise<NextResponse>} A JSON response indicating the success of the operation or an error message.
 */
export async function POST(request: Request, { params }: { params: { id?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!params?.id) {
    return NextResponse.json({ error: "ID de notificación requerido" }, { status: 400 });
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ error: "Error marking notification as read" }, { status: 500 });
  }
}




