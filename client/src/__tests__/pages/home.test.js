import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import HomePage from '../../pages/home';

// Mock NavLink since we're using react-router
jest.mock('react-router', () => ({
  NavLink: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<HomePage />);
    
    // Check if main title is present
    expect(screen.getByText('Instashare: share files instantly')).toBeInTheDocument();
    
    // Check if description text is present
    expect(screen.getByText(/Instashare is a web application/i)).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(<HomePage />);
    
    // Check for sign in links
    const signInLinks = screen.getAllByText(/Sign in/i);
    expect(signInLinks.length).toBeGreaterThan(0);
    
    // Check for get started link
    const getStartedLink = screen.getByText('Get started');
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('displays the creator information', () => {
    render(<HomePage />);
    
    expect(screen.getByText(/Created by Victor Manuel Moraton Hernandez/i)).toBeInTheDocument();
    
    const githubLink = screen.getByText(/Github link/i);
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('contains the correct styling classes', () => {
    render(<HomePage />);
    
    // Check main container
    const mainContainer = screen.getByText(/Instashare: share files instantly/i).closest('div');
    expect(mainContainer).toHaveClass('text-center');

    // Check get started button styling
    const getStartedButton = screen.getByText('Get started');
    expect(getStartedButton).toHaveClass(
      'rounded-md',
      'bg-blue-600',
      'px-3.5',
      'py-2.5',
      'text-sm',
      'font-semibold',
      'text-white'
    );
  });

  it('has proper semantic HTML structure', () => {
    render(<HomePage />);
    
    // Check header
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Check navigation
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Global');
    
    // Check main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Instashare: share files instantly');
  });
});