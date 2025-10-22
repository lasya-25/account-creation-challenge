import React from 'react';
import { render, screen } from '@testing-library/react';
import { Error } from './error';
import '@testing-library/jest-dom';

describe('Error', () => {
  it('renders error info', () => {
    render(<Error info="username is required" isGeneric={false} />);
    const element = screen.getByText(/username is required/i);
    expect(element).toBeInTheDocument();
    expect(element.parentElement).not.toHaveClass('border');
  });

  it('renders generic error', () => {
    render(<Error info="Something went wrong" isGeneric={true} />);
    const element = screen.getByText(/Something went wrong/i);
    expect(element).toBeInTheDocument();
    expect(element.parentElement).toHaveClass('border');
  });

  it('accepts isGeneric as optional', () => {
    render(<Error info="not generic error"/>);
    expect(screen.getByText(/not generic error/i)).toBeInTheDocument();
  });
});
