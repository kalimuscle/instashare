import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormSignUp from '../../../components/forms/formSignUp';

const mockOnSubmit = jest.fn();

describe('Form sign up component', () => {

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form elements correctly', () => {
    render(<FormSignUp onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Email address")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account now/i })).toBeInTheDocument();
  });

  it('shows error messages for empty form submission', async () => {
    render(<FormSignUp onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create account now/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("User name required")).toBeInTheDocument(); // Username error
    });

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Please enter a password")).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates username requirements', async () => {
    render(<FormSignUp onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByPlaceholderText("Type username");

    // Test minimum length
    await userEvent.type(usernameInput, 'short');
    await userEvent.tab();
    
    await waitFor(() => {
      expect(screen.getByText("Too short!")).toBeInTheDocument();
    });

    // Test maximum length
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'thisUsernameIsTooLongForTheValidation');
    
    await waitFor(() => {
      expect(screen.getByText("Too long!")).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<FormSignUp onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByPlaceholderText("Type email address");
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/email must be a valid email/i)).toBeInTheDocument();
    });
  });

  it('validates password requirements', async () => {
    render(<FormSignUp onSubmit={mockOnSubmit} />);
    
    const passwordInput = screen.getByPlaceholderText("Type password");
    
    // Test minimum length
    await userEvent.type(passwordInput, 'short');
    await userEvent.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/password must have at least 8 characters/i)).toBeInTheDocument();
    });

    // Test password requirements one by one
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'nouppercase1!');
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'NOLOWERCASE1!');
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
    });

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'NoNumber!!');
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
    });

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'NoSpecial123');
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one special character/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    render(<FormSignUp onSubmit={mockOnSubmit} />);
    
    const passwordInput = screen.getByPlaceholderText("Type password");
    const confirmPasswordInput = screen.getByPlaceholderText("Type password to confirm");

    await userEvent.type(passwordInput, 'ValidPass1!');
    await userEvent.type(confirmPasswordInput, 'DifferentPass1!');
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/not the same as password/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<FormSignUp onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByPlaceholderText("Type username");
    const emailInput = screen.getByPlaceholderText("Type email address");
    const passwordInput = screen.getByPlaceholderText("Type password");
    const confirmPasswordInput = screen.getByPlaceholderText("Type password to confirm");

    const submitButton = screen.getByRole('button', { name: /create account now/i });

    await userEvent.type(usernameInput, 'validuser123');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'ValidPass1!');
    await userEvent.type(confirmPasswordInput, 'ValidPass1!');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'validuser123',
        email: 'test@example.com',
        password: 'ValidPass1!',
        confirmPassword: 'ValidPass1!'
      });
    });
  });

  // it('shows error messages for empty form submission', async () => {
  //   render(<FormSignIn onSubmit={mockOnSubmit} />);
    
  //   const submitButton = screen.getByRole('button', { name: /sign in now/i });
  //   await userEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText(/please enter a password/i)).toBeInTheDocument();
  //   });
    
  //   expect(mockOnSubmit).not.toHaveBeenCalled();
  // });

  // it('validates email format', async () => {
  //   render(<FormSignIn onSubmit={mockOnSubmit} />);
    
  //   const emailInput = screen.getByPlaceholderText("Type email address");
  //   await userEvent.type(emailInput, 'invalid-email');
  //   await userEvent.tab(); // Trigger blur event

  //   await waitFor(() => {
  //     expect(screen.getByText(/email must be a valid email/i)).toBeInTheDocument();
  //   });
  // });

  // it('validates password requirements', async () => {
  //   render(<FormSignIn onSubmit={mockOnSubmit} />);
    
  //   const passwordInput = screen.getByPlaceholderText("Type Password");
    
  //   // Test minimum length
  //   await userEvent.type(passwordInput, 'short');
  //   await userEvent.tab();
    
  //   await waitFor(() => {
  //     expect(screen.getByText(/password must have at least 8 characters/i)).toBeInTheDocument();
  //   });

  //   // Clear and test missing uppercase
  //   await userEvent.clear(passwordInput);
  //   await userEvent.type(passwordInput, 'nouppercase1!');
    
  //   await waitFor(() => {
  //     expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
  //   });

  //   // Clear and test missing lowercase
  //   await userEvent.clear(passwordInput);
  //   await userEvent.type(passwordInput, 'NOLOWERCASE1!');
    
  //   await waitFor(() => {
  //     expect(screen.getByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
  //   });

  //   // Clear and test missing number
  //   await userEvent.clear(passwordInput);
  //   await userEvent.type(passwordInput, 'NoNumber!!');
    
  //   await waitFor(() => {
  //     expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
  //   });

  //   // Clear and test missing special character
  //   await userEvent.clear(passwordInput);
  //   await userEvent.type(passwordInput, 'NoSpecial123');
    
  //   await waitFor(() => {
  //     expect(screen.getByText(/password must contain at least one special character/i)).toBeInTheDocument();
  //   });
  // });

  // it('submits form with valid data', async () => {
  //   render(<FormSignIn onSubmit={mockOnSubmit} />);
    
  //   const emailInput = screen.getByPlaceholderText("Type email address");
  //   const passwordInput = screen.getByPlaceholderText("Type Password");
  //   const submitButton = screen.getByRole('button', { name: /sign in now/i });

  //   await userEvent.type(emailInput, 'test@example.com');
  //   await userEvent.type(passwordInput, 'ValidPass1!');
  //   await userEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockOnSubmit).toHaveBeenCalledWith({
  //       email: 'test@example.com',
  //       password: 'ValidPass1!'
  //     });
  //   });
  // });

});