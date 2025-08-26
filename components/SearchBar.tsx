
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white p-2 rounded-full shadow-lg border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything about Indian laws..."
        className="w-full bg-transparent px-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <SearchIcon className="w-6 h-6" />
      </button>
    </form>
  );
};
