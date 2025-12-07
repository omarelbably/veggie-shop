/**
 * Unit Tests for Footer Component
 * 
 * @test Footer
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    
    expect(screen.getByText(/VeggieShop/i)).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('renders customer service section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Customer Service')).toBeInTheDocument();
  });

  it('renders contact info section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders home link', () => {
    render(<Footer />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders about link', () => {
    render(<Footer />);
    
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('renders contact link', () => {
    render(<Footer />);
    
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders email contact', () => {
    render(<Footer />);
    
    expect(screen.getByText(/support@veggieshop.com/i)).toBeInTheDocument();
  });

  it('renders phone contact', () => {
    render(<Footer />);
    
    expect(screen.getByText(/1-800-VEGGIES/i)).toBeInTheDocument();
  });
});
