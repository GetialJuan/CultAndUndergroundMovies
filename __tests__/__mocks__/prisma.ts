export const PrismaClient = jest.fn().mockImplementation(() => ({
    follower: {
        findMany: jest.fn(),
        count: jest.fn()
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
}));