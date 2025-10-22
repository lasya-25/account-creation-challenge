import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreateAccount } from './create-account';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.resetAllMocks();
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('CreateAccount', () => {
  it('renders form fields and button', () => {
    renderWithRouter(<CreateAccount />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  // Inputs must satisfy minLength/pattern so onSubmit runs (HTML5 validation otherwise blocks it)
  it('shows error when API returns field errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: { username: ['is too short'], password: ['is too weak'] } })
    });
    renderWithRouter(<CreateAccount />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'validusername' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'validpassword1234567' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => {
      expect(screen.getByText(/username is too short/i)).toBeInTheDocument();
      expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
    });
  });

  it('shows general error when API returns error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Something went wrong' })
    });
    renderWithRouter(<CreateAccount />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'validusername' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'validpassword1234567' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows general error when API returns no response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    });
    renderWithRouter(<CreateAccount />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'validusername' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'validpassword1234567' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  it('shows general error when fetch throws an error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(new Error('Service Failure'));
    renderWithRouter(<CreateAccount />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'validusername' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'validpassword1234567' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  it('no error on successful account creation', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });
    renderWithRouter(<CreateAccount />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'validusername' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'validpassword1234567' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => {
      expect(screen.queryByText(/An unexpected error occurred/i)).not.toBeInTheDocument();
    });
  });
});