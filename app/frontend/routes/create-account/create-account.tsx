import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../reusable-components/input/input.tsx';
import { Button } from '../../reusable-components/button/button.tsx';
import { Error } from '../../reusable-components/error/error.tsx';
import { Card } from '../../reusable-components/card/card.tsx';
import logo from '../../images/wealthfront-logo.png';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{username?: string[], password?: string[]}>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    setIsSubmitting(true);
    event.preventDefault();
    setErrors({});
    setGeneralError(null);
    try {
      const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/signup/account-selection')
      } else {
        if (data.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
          setGeneralError(null);
        } else {
          setGeneralError(data.error || 'An unexpected error occurred. Please try again later.');
          setErrors({});
        }
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again later.');
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderFieldErrors(field: 'username' | 'password') {
    return errors[field]?.map((err, idx) => (
      <Error info={`${field} ${err}`} isGeneric={false} key={`${field}-error-${idx}`} />
    ));
  }

  return (
    <Card>
        <img src={logo} alt="Logo" className="h-12 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-center">Create New Account</h1>
        <form onSubmit={handleSubmit}>
          {generalError && <Error info={generalError} isGeneric={true}/>}
          <Input 
            label="Username" 
            type="text" 
            onChange={e => setUsername(e.target.value)} 
            value={username}
            minLength={10}
            maxLength={50}
            required
            tooltip="Username must be between 10 and 50 characters long"
          />
          {renderFieldErrors('username')}
          <Input 
            label="Password" 
            type="password" 
            onChange={e => setPassword(e.target.value)} 
            value={password}
            minLength={20}
            maxLength={50}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
            title="Password must include at least one letter and one number"
            tooltip="Password must be between 20 and 50 characters long and include at least one letter and one number"
          />
          {renderFieldErrors('password')}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <ArrowPathIcon className="w-5 h-5 mr-2 inline-block animate-spin [animation-duration:2s]" />}
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
    </Card>
  );
}
