const request = require('supertest');
const app = require('./app');

jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

// Mock Redis client
jest.mock('./v1/databases/init.redis', () => ({
    get: jest.fn().mockResolvedValue('mocked value'),
    set: jest.fn().mockResolvedValue('OK'),
    lrange: jest.fn().mockResolvedValue(['item1', 'item2']),
    del: jest.fn().mockResolvedValue(1),
    flushdb: jest.fn().mockResolvedValue('OK'),
    // Add other methods as needed
}));

jest.mock('passport-google-oauth20', () => {
    const originalModule = jest.requireActual('passport-google-oauth20');
    return {
        ...originalModule,
        Strategy: jest.fn().mockImplementation(() => ({
            name: 'google',
            authenticate: jest.fn('google', { scope: ['profile', 'email'] }),
        })),
    };
});

describe('404 Error Handling', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('It should respond with 404 for non-existent routes', async () => {
        const response = await request(app).get('/api/nonexistent');
        expect(response.statusCode).toBe(404);
        // Optionally, check the response body
        expect(response.body).toEqual(expect.objectContaining({
            code: 404,
            status: expect.any(String),
            message: 'Resource not found',
        }));
    });
});