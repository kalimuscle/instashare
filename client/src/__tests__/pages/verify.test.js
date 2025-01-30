import React from 'react';
import { render, screen } from '@testing-library/react';
import Verify from '../../pages/verify';

// Mock react-router components
jest.mock('react-router', () => ({
  NavLink: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  Link: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: () => ({
    pathname: '/verify'
  })
}));


describe('Verify Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Verify />);
    expect(screen.getByText('Check your inbox')).toBeInTheDocument();
  });

  it('displays the main heading with correct styling', () => {
    render(<Verify />);
    const heading = screen.getByRole('heading', { level: 2 });
    
    expect(heading).toHaveTextContent('Check your inbox');
    expect(heading).toHaveClass(
      'mb-2',
      'text-[42px]',
      'font-bold',
      'text-zinc-800'
    );
  });

  it('renders the description text with signin link', () => {
    render(<Verify />);
    
    // const description = screen.getByText("We are glad, that you're with us. Now");
    // expect(description).toBeInTheDocument();
    // expect(description).toHaveClass('mb-2', 'text-lg', 'text-zinc-500');
    
    const signinLink = screen.getByText('signin');
    expect(signinLink).toHaveAttribute('href', '/signin');
    expect(signinLink).toHaveClass('font-bold', 'text-blue-600');
  });

  it('renders the back home link with correct styling', () => {
    render(<Verify />);
    
    const backHomeLink = screen.getByText('Back home→');
    expect(backHomeLink).toHaveAttribute('href', '/');
    expect(backHomeLink).toHaveClass(
      'mt-3',
      'inline-block',
      'w-96',
      'rounded',
      'bg-blue-600',
      'px-5',
      'py-3',
      'font-medium',
      'text-white',
      'shadow-md',
      'shadow-blue-500/20',
      'hover:bg-blue-700'
    );
  });

  it('has proper container styling', () => {
    render(<Verify />);
    
    const container = screen.getByText('Check your inbox').closest('div');
    expect(container.parentElement).toHaveClass(
      'relative',
      'flex',
      'min-h-screen',
      'flex-col',
      'items-center',
      'justify-center',
      'overflow-hidden',
      'py-6',
      'sm:py-12',
      'bg-white'
    );
  });

  it('has correct content wrapper styling', () => {
    render(<Verify />);
    
    const contentWrapper = screen.getByText('Check your inbox').parentElement;
    expect(contentWrapper).toHaveClass('max-w-xl', 'px-5', 'text-center');
  });

  it('maintains proper component hierarchy', () => {
    render(<Verify />);
    
    const mainContainer = screen.getByText('Check your inbox').closest('div').parentElement;
    const contentWrapper = screen.getByText('Check your inbox').closest('div');
    
    expect(mainContainer).toContainElement(contentWrapper);
    expect(contentWrapper).toContainElement(screen.getByText('Check your inbox'));
    expect(contentWrapper).toContainElement(screen.getByText(/We are glad/));
    expect(contentWrapper).toContainElement(screen.getByText('Back home→'));
  });

  it('renders all navigation links correctly', () => {
    render(<Verify />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2); // Should have signin and back home links
    
    expect(links[0]).toHaveAttribute('href', '/signin');
    expect(links[1]).toHaveAttribute('href', '/');
  });
});