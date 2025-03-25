import { GET } from '@/app/api/users/[userId]/followers/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock the Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    follower: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('Followers API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return followers with pagination', async () => {
    // Mock followers data
    const mockFollowers = [
      {
        followerId: 'follower-id-1',
        followedId: 'user-123',
        createdAt: new Date(),
        follower: {
          id: 'follower-id-1',
          username: 'follower1',
          profilePicture: 'profile1.jpg',
        },
      },
      {
        followerId: 'follower-id-2',
        followedId: 'user-123',
        createdAt: new Date(),
        follower: {
          id: 'follower-id-2',
          username: 'follower2',
          profilePicture: 'profile2.jpg',
        },
      },
    ];

    // Set up the mocks
    (prisma.follower.findMany as jest.Mock).mockResolvedValue(mockFollowers);
    (prisma.follower.count as jest.Mock).mockResolvedValue(2);

    // Create request with search params
    const request = new NextRequest('http://localhost:3000/api/users/user-123/followers?page=1&limit=10');

    // Execute the API endpoint
    const response = await GET(request, { params: { id: 'user-123' } });
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data.followers).toHaveLength(2);
    expect(data.pagination).toEqual({
      total: 2,
      page: 1,
      limit: 10,
      pages: 1,
    });
    expect(data.followers[0].username).toBe('follower1');
    expect(data.followers[1].username).toBe('follower2');

    // Verify Prisma was called correctly
    expect(prisma.follower.findMany).toHaveBeenCalledWith({
      where: { followedId: 'user-123' },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      skip: 0,
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  });

  it('should handle API errors', async () => {
    // Mock an error
      (prisma.follower.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      (prisma.follower.count as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/users/user-123/followers');
    const response = await GET(request, { params: { id: 'user-123' } });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch followers');
  });
});