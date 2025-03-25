module.exports = {
    // Your existing configuration

    // Add this to exclude mocks from being treated as test files
    testPathIgnorePatterns: [
        '/node_modules/',
        '/__mocks__/'
    ],

    // If you're using TypeScript, make sure this is also included
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    }
};