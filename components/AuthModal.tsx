
import React, { useState } from 'react';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { BalanceIcon } from './icons/BalanceIcon';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (rememberMe: boolean) => void;
}

type AuthView = 'login' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [view, setView] = useState<AuthView>('login');

  const handleSwitchView = () => {
    setView(view === 'login' ? 'signup' : 'login');
  };
  
  const handleSignUpSuccess = () => {
    // New sign-ups are remembered by default.
    onSuccess(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto relative transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          aria-label="Close authentication modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-8">
            <div className="text-center mb-6">
                <BalanceIcon className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-800">
                    {view === 'login' ? 'Welcome Back' : 'Create Your Account'}
                </h2>
                <p className="text-slate-500">
                    {view === 'login' ? 'Sign in to continue to LawEase' : 'to get started with LawEase'}
                </p>
            </div>

            {view === 'login' ? <Login onSuccess={onSuccess} /> : <SignUp onSuccess={handleSignUpSuccess} />}
            
            <div className="text-center mt-6">
                <button onClick={handleSwitchView} className="text-sm text-indigo-600 hover:underline">
                    {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};