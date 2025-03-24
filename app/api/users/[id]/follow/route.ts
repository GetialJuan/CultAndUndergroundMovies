// app/api/users/[id]/follow/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Follow a user
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUserId = session.user.id;
        const userToFollowId = params.id;

        // Prevent following yourself
        if (currentUserId === userToFollowId) {
            return NextResponse.json(
                { error: "Cannot follow yourself" },
                { status: 400 }
            );
        }

        // Check if user to follow exists
        const userToFollow = await prisma.user.findUnique({
            where: { id: userToFollowId },
        });

        if (!userToFollow) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if already following
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
                { error: "Already following this user" },
                { status: 400 }
            );
        }

        // Create follow relationship
        await prisma.follower.create({
            data: {
            followerId: currentUserId,
            followedId: userToFollowId,
            createdAt: new Date(),
            },
        });

        // Create notification for the followed user
        await prisma.notification.create({
            data: {
            userId: userToFollowId,
            type: "FOLLOW",
            content: `${session.user.name} has started following you.`,
            isRead: false,
            },
        });

        return NextResponse.json(
            { message: "Successfully followed user" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error following user:", error);
        return NextResponse.json(
            { error: "Failed to follow user" },
            { status: 500 }
        );
    }
}

// Unfollow a user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUserId = session.user.id;
        const userToUnfollowId = params.id;

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
            { message: "Successfully unfollowed user" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return NextResponse.json(
            { error: "Failed to unfollow user" },
            { status: 500 }
        );
    }
}