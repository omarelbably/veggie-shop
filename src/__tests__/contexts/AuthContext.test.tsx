/**
 * Unit Tests for AuthContext
 * 
 * @test AuthContext
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Test component that uses the auth context
function TestComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
      <span data-testid="user-name">{user?.firstName || 'No User'}</span>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial unauthenticated state', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: false }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });

  it('shows loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ json: () => ({ success: false }) }), 1000))
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('updates state when user is authenticated', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockUser }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('John');
    });
  });

  it('throws error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
