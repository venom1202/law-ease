import React, { useState } from 'react';
import { EmailIcon } from './icons/EmailIcon';
import { LockIcon } from './icons/LockIcon';

interface LoginProps {
  onSuccess: (rememberMe: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = () => {
    if (!email) {
      alert("Please enter your email address above to receive password reset instructions.");
      return;
    }
    // Simulate sending a reset link. In a real app, this would trigger an API call.
    alert(`If an account exists for ${email}, a password reset link has been sent.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format. Please check and try again.');
      return;
    }

    if (!password) {
      setError('Password cannot be empty');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you'd validate credentials against a database.
      // This is a simple simulation.
      if (email.toLowerCase() === 'user@example.com' && password === 'password123') {
        onSuccess(rememberMe);
      } else if (email.toLowerCase() === 'user@example.com' && password !== 'password123') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('No account found with this email.');
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
      <div className="relative">
        <label htmlFor="login-email" className="sr-only">Email</label>
        <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
          aria-invalid={!!error}
          aria-describedby="login-error"
        />
      </div>
      <div className="relative">
        <label htmlFor="login-password" className="sr-only">Password</label>
        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
          aria-invalid={!!error}
          aria-describedby="login-error"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="font-medium text-indigo-600 hover:underline focus:outline-none"
            aria-label="Forgot your password?"
          >
            Forgot Password?
          </button>
        </div>
      </div>
      
      {error && <span id="login-error" className="sr-only">{error}</span>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:opacity-75 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
      >
        {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};