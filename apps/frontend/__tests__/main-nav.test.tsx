import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MainNav } from '../components/main-nav';

// Mock the next/navigation hook
jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => null,
}));

describe('MainNav', () => {
  const mockItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  it('renders the logo and navigation items', () => {
    render(<MainNav items={mockItems} />);
    
    // Check if the logo is rendered
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    
    // Check if navigation items are rendered
    mockItems.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it('renders mobile menu button on small screens', () => {
    render(<MainNav items={mockItems} />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /Task Manager/i });
    expect(mobileMenuButton).toBeInTheDocument();
  });
});