import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';
import '@testing-library/jest-dom';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /Click Me/i }));
    expect(handleClick).toHaveBeenCalled();
  });
});
