import { fetchUsers } from '../services/user.services';
import { xata } from '../server';

// Mock the xata module
jest.mock('../server', () => ({
  xata: {
    db: {
      User: {
        getAll: jest.fn(),
      },
    },
  },
}));

describe('fetchUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch users successfully', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' },
    ];
    xata.db.User.getAll.mockResolvedValue(mockUsers);

    const result = await fetchUsers();

    expect(result).toEqual(mockUsers);
    expect(xata.db.User.getAll).toHaveBeenCalledTimes(1);
  });

  it('should handle errors and return error message', async () => {
    const errorMessage = 'Database connection failed';
    xata.db.User.getAll.mockRejectedValue(new Error(errorMessage));

    const result = await fetchUsers();

    expect(result).toBe(`Error: ${errorMessage}`);
    expect(xata.db.User.getAll).toHaveBeenCalledTimes(1);
  });
});