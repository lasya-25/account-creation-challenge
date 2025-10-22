import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Card } from './card';

describe('Card', () => {
  it('renders children inside the card', () => {
    render(
      <Card>
        <p>Child content</p>
      </Card>
    );
    expect(screen.getByText(/Child content/i)).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Card title="Card Title">
        <p>Child content</p>
      </Card>
    );
    expect(screen.getByText(/Card Title/i)).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Card description="Card Description">
        <p>Child content</p>
      </Card>
    );
    expect(screen.getByText(/Card Description/i)).toBeInTheDocument();
  });

  it('renders both title and description together', () => {
    render(
      <Card title="Title" description="Description">
        <p>Child content</p>
      </Card>
    );
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Description/i)).toBeInTheDocument();
  });
});