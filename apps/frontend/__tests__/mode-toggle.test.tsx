import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '../components/mode-toggle';
import { useTheme } from 'next-themes';

// Mock the next-themes hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ModeToggle', () => {
  it('renders the mode toggle button', () => {
    (useTheme as jest.Mock).mockReturnValue({ setTheme: jest.fn() });

    render(<ModeToggle />);

    const toggleButton = screen.getByRole('button', { name: /Toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('changes theme when options are clicked', () => {
    const mockSetTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ setTheme: mockSetTheme });

    render(<ModeToggle />);

    // Open the dropdown
    fireEvent.click(screen.getByRole('button', { name: /Toggle theme/i }));
    // Click on theme options
    fireEvent.click(screen.getByRole('menuitem', { name: /Light/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    fireEvent.click(screen.getByRole('menuitem', { name: /Dark/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByText(/System/i)); 
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});