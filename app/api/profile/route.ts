// Ruta: app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Cambia la importación a la nueva ubicación
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        biography: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            following: true,
            followers: true,
            reviews: true,
            movieLists: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      biography: user.biography,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      followingCount: user._count.following,
      followersCount: user._count.followers,
      reviewsCount: user._count.reviews,
      movieListsCount: user._count.movieLists,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse form data
    const formData = await req.formData();
    const username = formData.get('username') as string;
    const biography = formData.get('biography') as string;
    const profileImage = formData.get('profileImage') as File | null;

    // Validate username
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Check if username is taken (only if it's different from current username)
    if (username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // Handle profile image upload
    let profilePicturePath = user.profilePicture;

    if (profileImage) {
      // Create a unique filename
      const fileExtension = profileImage.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Define the path to save the image
      const publicPath = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(publicPath, fileName);

      // Ensure the directory exists
      try {
        await writeFile(
          filePath,
          Buffer.from(await profileImage.arrayBuffer())
        );
        profilePicturePath = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Error saving profile image:', error);
        return NextResponse.json(
          { error: 'Failed to save profile image' },
          { status: 500 }
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        biography,
        profilePicture: profilePicturePath,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        biography: updatedUser.biography,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
