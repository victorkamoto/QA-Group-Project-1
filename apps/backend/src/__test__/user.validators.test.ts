import { Request, Response, NextFunction } from 'express';
import { createUserSchema } from '../middleware/validators/user.validators';

describe('createUserSchema', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
    } as any;

    res = {
      status: jest.fn(),
      json: jest.fn(),
    } as any;

    next = jest.fn();
  });

  afterEach(() => {
    next.mockRestore();
  });

  it('should validate user creation', async () => {
    req.body = {
      // valid user data
    };

    const result = await createUserSchema.run(req);
    expect(result).toBeUndefined();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should return error for invalid user data', async () => {
    req.body = {
      // invalid user data
    };

    const result = await createUserSchema.run(req);
    expect(result).toBeInstanceOf(Error);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(result);
  });
});