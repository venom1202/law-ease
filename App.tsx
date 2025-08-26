import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CategorySelector } from './components/CategorySelector';
import { AuthModal } from './components/AuthModal';
import { simplifyTextWithSearch, generateVisualAid } from './services/geminiService';
import type { SimplifiedResult } from './types';
import { Language } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [result, setResult] = useState<SimplifiedResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    // Check for a logged-in user in either storage on initial load
    if (localStorage.getItem('lawease_user') || sessionStorage.getItem('lawease_user')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (rememberMe: boolean) => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    const userSession = JSON.stringify({ email: 'user@example.com' });
    
    // Use localStorage for persistent session, sessionStorage for temporary one
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('lawease_user', userSession);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear both storages to ensure a clean logout
    localStorage.removeItem('lawease_user');
    sessionStorage.removeItem('lawease_user');
    setResult(null); // Clear results on logout
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!query.trim()) {
      setError("Please enter a valid query.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Step 1: Get structured text using search grounding.
      const { data: structuredResponse, sources } = await simplifyTextWithSearch(query, language);
      
      const initialResult: SimplifiedResult = {
        query,
        ...structuredResponse,
        sources: sources,
        visualAidUrl: null, // This will trigger the VisualAidLoader
      };
      setResult(initialResult);
      setIsLoading(false); // Stop main loader, show text result.

      // Step 2: Generate visual aid in the background.
      try {
        const visualAidPrompt = `Create a simple, clear, and visually appealing infographic or diagram that explains "${query}". The style should be modern and easy to understand for someone with no legal background. Use icons and simple text, in ${language}. If the query is about a process, summarize the key steps visually.`;
        const imageUrl = await generateVisualAid(visualAidPrompt);
        
        // Update the result with the image URL when it's ready.
        setResult(prevResult => prevResult ? { ...prevResult, visualAidUrl: imageUrl } : null);
      } catch (imageErr) {
          console.error("Failed to generate visual aid:", imageErr);
          // Set a special value to indicate error in the UI
          setResult(prevResult => prevResult ? { ...prevResult, visualAidUrl: 'ERROR' } : null);
      }

    } catch (err) {
      console.error(err);
      setError("An error occurred while processing your request. Please try again.");
      setIsLoading(false);
    }
  }, [language, isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Indian Law, Simplified
            </h1>
            <p className="text-slate-600 mb-8 text-lg">
              Your AI assistant for understanding complex laws, tax rules, and regulations.
            </p>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {error && <p className="text-center text-red-500 mt-4">{error}</p>}

          {isLoading && <LoadingSpinner />}
          
          {result && !isLoading && <ResultDisplay result={result} />}

          {!isLoading && !result && !error && (
            <CategorySelector onPromptClick={handleSearch} />
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Information provided is for educational purposes only and is not legal advice.</p>
      </footer>
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default App;