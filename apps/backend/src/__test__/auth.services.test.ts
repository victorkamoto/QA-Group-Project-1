import { registerUser, loginUser } from '../services/auth.services';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { xata } from 'xata.io/client';


jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Services', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'securePassword123',
    role: 'member', 
  };

  const mockUserWithHashedPassword = {
    ...mockUser,
    password: 'hashedPassword',
  };

  const mockUserWithToken = {
    ...mockUser,
    token: 'mockToken',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should register a new user in the system', async () => {
    const mockHashedPassword = 'hashedPassword';
    const mockUserId = 'mockUserId';

    jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashedPassword as never);
    jest.spyOn(xata.db.User, 'create').mockResolvedValue({ id: mockUserId });

    const response = await registerUser(mockUser);

    expect(xata.db.User.create).toHaveBeenCalledWith(mockUserWithHashedPassword);
    expect(response).toEqual({ id: mockUserId });
  });

  it('should login a user', async () => {
    jest.spyOn(xata.db.User, 'filter').mockResolvedValue([mockUserWithHashedPassword]);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest.spyOn(jwt, 'sign').mockReturnValue(mockUserWithToken.token as never);

    const response = await loginUser({ email: mockUser.email, password: mockUser.password });

    expect(xata.db.User.filter).toHaveBeenCalledWith({ email: mockUser.email });
    expect(response).toEqual(mockUserWithToken);
  });
});