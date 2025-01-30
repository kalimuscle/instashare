import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../../../components/pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 2,
    pageSize: 10,
    totalFiles: 45,
    totalPages: 5,
    setPage: jest.fn()
  };

  beforeEach(() => {
    defaultProps.setPage.mockClear();
  });

  it('renders pagination information correctly', () => {
    render(<Pagination {...defaultProps} />);
    
    // Check if showing correct range of results
    const paginationText = screen.getByText(/showing/i);
    expect(paginationText).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Start of range (page 2 starts at item 10)
    expect(screen.getByText('20')).toBeInTheDocument(); // End of range (page 2 ends at item 20)
    expect(screen.getByText('45')).toBeInTheDocument(); // Total items
  });

  it('renders navigation buttons', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('handles previous page navigation', async () => {
    render(<Pagination {...defaultProps} />);
    
    const previousButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(previousButton);
    
    expect(defaultProps.setPage).toHaveBeenCalledWith(1);
  });

  it('handles next page navigation', async () => {
    render(<Pagination {...defaultProps} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    
    expect(defaultProps.setPage).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('shows correct range for first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Start of range
    expect(screen.getByText('10')).toBeInTheDocument(); // End of range
  });

  it('shows correct range for last incomplete page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    
    const startRange = screen.getByText('40');
    const endRange = screen.getAllByText('45'); 

    expect(startRange).toBeInTheDocument();
    expect(endRange.length).toBe(2); 
    expect(endRange[0]).toBeInTheDocument();
  });

  it('maintains accessibility features', () => {
    render(<Pagination {...defaultProps} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Pagination');
  });
});