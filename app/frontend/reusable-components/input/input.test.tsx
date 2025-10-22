import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input';
import '@testing-library/jest-dom';

describe('Input', () => {
  it('renders label and input', () => {
    render(<Input label="Username" value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input label="Username" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
