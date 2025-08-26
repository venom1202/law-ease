
import React, { useState } from 'react';
import { EmailIcon } from './icons/EmailIcon';
import { LockIcon } from './icons/LockIcon';

interface SignUpProps {
  onSuccess: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswords = (pass: string, confirmPass: string) => {
    if (confirmPass && pass !== confirmPass) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setError(''); // Clear general error when email changes

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail.toLowerCase() === 'user@example.com') {
      setEmailError('An account with this email already exists.');
    } else if (newEmail && !emailRegex.test(newEmail)) {
      setEmailError('Invalid email format. Please use a valid email.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setError('');
    validatePasswords(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setError('');
    validatePasswords(password, newConfirmPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Final check to prevent submission if there's an error
    if (emailError || passwordError) {
      return;
    }

    if (!email) {
      setEmailError('Email address is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call for registration
    setTimeout(() => {
        setIsLoading(false);
        onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
      
      <div>
        <div className="relative">
          <label htmlFor="signup-email" className="sr-only">Email</label>
          <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email address"
            className={`w-full bg-slate-100 border rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:outline-none ${emailError ? 'border-red-500 ring-red-500' : 'border-slate-300 focus:ring-indigo-500'}`}
            required
            aria-invalid={!!error || !!emailError}
            aria-describedby="signup-error email-validation-error"
          />
        </div>
        {emailError && <p id="email-validation-error" className="text-red-500 text-sm mt-1 px-1">{emailError}</p>}
      </div>

      <div className="relative">
        <label htmlFor="signup-password" className="sr-only">Password</label>
        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Create a password (min. 8 characters)"
          className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
          aria-invalid={!!error}
          aria-describedby="signup-error"
        />
      </div>

      <div>
        <div className="relative">
            <label htmlFor="signup-confirm-password" className="sr-only">Confirm Password</label>
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm password"
            className={`w-full bg-slate-100 border rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:outline-none ${passwordError ? 'border-red-500 ring-red-500' : 'border-slate-300 focus:ring-indigo-500'}`}
            required
            aria-invalid={!!passwordError}
            aria-describedby="password-match-error"
            />
        </div>
        {passwordError && <p id="password-match-error" className="text-red-500 text-sm mt-1 px-1">{passwordError}</p>}
      </div>

      {error && <span id="signup-error" className="sr-only">{error}</span>}
      <button
        type="submit"
        disabled={isLoading || !!emailError || !!passwordError}
        className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:opacity-75 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
      >
        {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};