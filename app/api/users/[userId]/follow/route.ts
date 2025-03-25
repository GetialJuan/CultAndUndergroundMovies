/**
 * @fileoverview API routes for following and unfollowing users.
 * This module defines API endpoints for managing user follow relationships, including following and unfollowing users,
 * and creating notifications for these actions. It uses NextAuth.js for authentication and Prisma for database interactions.
 */

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/users/[userId]/follow - Follows a user.
 *
 * @async
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} context - The route context.
 * @param {Object} context.params - The route parameters.
 * @param {string} context.params.userId - The ID of the user to follow.
 * @returns {Promise<NextResponse>} A JSON response indicating the success of the operation or an error message.
 */
export async function POST(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = await context.params;
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = await session.user.id;
    const userToFollowId = userId;

    // Prevent following oneself
    if (currentUserId === userToFollowId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if the user to follow exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userToFollowId },
    });
    if (!userToFollow) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the current user is already following the target user
    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followedId: {
          followerId: currentUserId,
          followedId: userToFollowId,
        },
      },
    });
    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      );
    }

    // Create the follow relationship
    await prisma.follower.create({
      data: {
        followerId: currentUserId,
        followedId: userToFollowId,
        createdAt: new Date(),
      },
    });

    // Create a notification for the followed user
    try {
      await prisma.notification.create({
        data: {
          userId: userToFollowId,
          type: 'new_follower',
          content: `${session.user.name} has started following you.`,
          referenceId: currentUserId,
          isRead: false,
        },
      });
      console.log('Notificación guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la notificación:', error);
    }

    return NextResponse.json(
      { message: 'Successfully followed user' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[userId]/follow - Unfollows a user.
 *
 * @async
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} context - The route context.
 * @param {Object} context.params - The route parameters.
 * @param {string} context.params.userId - The ID of the user to unfollow.
 * @returns {Promise<NextResponse>} A JSON response indicating the success of the operation or an error message.
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = await context.params;
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const userToUnfollowId = userId;

    // Delete the follow relationship
    await prisma.follower.delete({
      where: {
        followerId_followedId: {
          followerId: currentUserId,
          followedId: userToUnfollowId,
        },
      },
    });

    return NextResponse.json(
      { message: 'Successfully unfollowed user' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}