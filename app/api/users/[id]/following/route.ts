import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const userId = id;

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        // Get following with pagination
        const following = await prisma.follower.findMany({
            where: {
                followerId: userId,
            },
            include: {
                followed: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });

        // Get total count for pagination
        const total = await prisma.follower.count({
            where: {
                followerId: userId,
            },
        });

        return NextResponse.json({
            followers: following.map((f) => f.followed),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching followers:", error);
        return NextResponse.json(
            { error: "Failed to fetch followers" },
            { status: 500 }
        );
    }
}