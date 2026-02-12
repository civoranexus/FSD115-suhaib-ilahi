import { register, login } from '../../src/services/authService';
import { findByEmail, create } from '../../src/models/User';
import { ConflictError, AuthenticationError } from '../../src/utils/errorHandler';

jest.mock('../../src/models/User');
jest.mock('../../src/config/email');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Test@123456',
        phoneNumber: '+919999999999',
        role: 'buyer'
      };

      findByEmail.mockResolvedValue(null);
      create.mockResolvedValue({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        role: 'buyer'
      });

      const result = await register(userData);

      expect(result.user.email).toBe('john@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw ConflictError if user already exists', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Test@123456',
        phoneNumber: '+919999999999',
        role: 'buyer'
      };

      findByEmail.mockResolvedValue({ id: 1, email: 'john@example.com' });

      await expect(register(userData)).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const email = 'john@example.com';
      const password = 'Test@123456';

      findByEmail.mockResolvedValue({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email,
        password: '$2a$10$...',
        role: 'buyer'
      });

      const result = await login(email, password);

      expect(result.user.email).toBe(email);
      expect(result.accessToken).toBeDefined();
    });

    it('should throw AuthenticationError for invalid credentials', async () => {
      findByEmail.mockResolvedValue(null);

      await expect(login('john@example.com', 'wrong')).rejects.toThrow(AuthenticationError);
    });
  });
});
