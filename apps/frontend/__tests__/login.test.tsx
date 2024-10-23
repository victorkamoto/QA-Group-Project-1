import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../components/login';
import { login } from '../lib/auth';
import { toast } from '../components/ui/use-toast';

// Mock the dependencies
jest.mock('../lib/auth', () => ({
  login: jest.fn(),
}));

jest.mock('../components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('LoginForm', () => {
  it('renders the login form', () => {
    render(<LoginForm />);
    // expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('********')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    (login as jest.Mock).mockResolvedValue({ status: 200 });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(toast).toHaveBeenCalledWith({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    });
  });

  it('shows an error message for invalid data', async () => {
    (login as jest.Mock).mockResolvedValue({
      status: 400,
      message: 'Invalid credentials',
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Something went wrong.',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
    });
  });
});

