import { connectDatabase } from '../src/config/database';
import { connectRedis } from '../src/config/redis';

beforeAll(async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Test setup error:', error);
  }
});

afterAll(async () => {
  jest.clearAllMocks();
});
