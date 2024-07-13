jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

jest.mock('./src/v1/databases/init.mongodb', () => ({
    connect: jest.fn(),
    connection: {
        close: jest.fn(),
    },
}));

jest.mock('./src/app', () => ({
    listen: jest.fn((port, callback) => {
        callback();
        return {
            close: jest.fn(callback => callback()),
        };
    }),
}));

jest.mock('./src/v1/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const mongoose = require('./src/v1/databases/init.mongodb');
const startServer = require('./server').startServer;

describe('Server Start Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Server starts successfully', async () => {
        mongoose.connect.mockResolvedValue();
        const result = await startServer();
        expect(result).toBe(true);
    });

    test('Server fails to start due to database connection error', async () => {
        mongoose.connect.mockRejectedValue(new Error('Connection failed'));
        const result = await startServer();
        expect(result).toBe(false);
    });
})