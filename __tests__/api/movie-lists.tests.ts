import { GET, POST } from '@/app/api/movie-lists/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

// Mock the external dependencies
jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
        movieList: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

describe('Movie Lists API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/movie-lists', () => {
        it('should return movie lists for authenticated users', async () => {
            // Mock authenticated session
            (getServerSession as jest.Mock).mockResolvedValue({
                user: { email: 'test@example.com' },
            });

            // Mock user in database
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 'user-123',
            });

            const createdAt = new Date();
            const updatedAt = new Date();

            // Mock movie lists data - use string dates to match JSON serialization
            const mockMovieLists = [
                {
                    id: 'list-1',
                    name: 'Favorites',
                    description: 'My favorite movies',
                    isPublic: true,
                    userId: 'user-123',
                    createdAt: createdAt.toISOString(),
                    updatedAt: updatedAt.toISOString(),
                    _count: { items: 2 },
                    items: [
                        {
                            movie: {
                                posterImage: 'poster1.jpg',
                            },
                        },
                    ],
                },
                {
                    id: 'list-2',
                    name: 'To Watch',
                    description: 'Movies I want to watch',
                    isPublic: true,
                    userId: 'user-123',
                    createdAt: createdAt.toISOString(),
                    updatedAt: updatedAt.toISOString(),
                    _count: { items: 0 },
                    items: [],
                },
            ];

            (prisma.movieList.findMany as jest.Mock).mockResolvedValue(mockMovieLists);

            // Create request
            const request = new NextRequest('http://localhost:3000/api/movie-lists');

            // Execute the API endpoint
            const response = await GET(request);
            const data = await response.json();

            // Assertions
            expect(response.status).toBe(200);
            expect(data).toEqual(mockMovieLists);
            expect(prisma.movieList.findMany).toHaveBeenCalledWith({
                where: { userId: 'user-123' },
                include: {
                    _count: {
                        select: { items: true },
                    },
                    items: {
                        include: {
                            movie: {
                                select: {
                                    posterImage: true,
                                },
                            },
                        },
                        take: 1,
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });
        });

        // Other tests remain the same...
    });

    describe('POST /api/movie-lists', () => {
        it('should create a new movie list successfully', async () => {
            // Mock authenticated session
            (getServerSession as jest.Mock).mockResolvedValue({
                user: { email: 'test@example.com' },
            });

            // Mock user in database
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 'user-123',
            });

            const newListData = {
                name: 'New List',
                description: 'A new movie list',
                isPublic: true,
            };

            const createdAt = new Date();
            const updatedAt = new Date();

            const mockCreatedList = {
                id: 'list-new',
                ...newListData,
                userId: 'user-123',
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
            };

            (prisma.movieList.create as jest.Mock).mockResolvedValue(mockCreatedList);

            // Create request with body
            const request = new NextRequest('http://localhost:3000/api/movie-lists', {
                method: 'POST',
                body: JSON.stringify(newListData),
            });

            // Execute the API endpoint
            const response = await POST(request);
            const data = await response.json();

            // Assertions
            expect(response.status).toBe(200);
            expect(data).toEqual(mockCreatedList);
            expect(prisma.movieList.create).toHaveBeenCalledWith({
                data: {
                    name: 'New List',
                    description: 'A new movie list',
                    isPublic: true,
                    userId: 'user-123',
                },
            });
        });

        // Other tests remain the same...
    });
});