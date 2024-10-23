import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignupForm } from '../components/signup';
import { signup } from '../lib/auth';
import { toast } from '../components/ui/use-toast';

jest.mock('../lib/auth', () => ({
  signup: jest.fn(),
}));

jest.mock('../components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('SignupForm', () => {
  it('renders the signup form', () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('********')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    (signup as jest.Mock).mockResolvedValue({ status: 201 });
    
    render(<SignupForm />);
    
    fireEvent.change(screen.getByPlaceholderText('John Doe'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(toast).toHaveBeenCalledWith({
        title: 'Registration Successful',
        description: 'Welcome to our task manager',
      });
    });
  });

  it('shows an error message for invalid data', async () => {
    (signup as jest.Mock).mockResolvedValue({ status: 400, message: 'Email already exists' });
    
    render(<SignupForm />);
    
    fireEvent.change(screen.getByPlaceholderText('John Doe'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Something went wrong.',
        description: 'Email already exists',
        variant: 'destructive',
      });
    });
  });
});