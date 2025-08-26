import React from 'react';
import type { WebSource } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface CitationProps {
  citationNumber: number;
  source: WebSource;
}

export const Citation: React.FC<CitationProps> = ({ citationNumber, source }) => {
  return (
    <span className="relative inline-block group mx-1">
      <a
        href={`#source-${citationNumber}`}
        className="text-indigo-600 font-semibold no-underline"
        aria-label={`Go to source ${citationNumber}`}
      >
        <sup className="cursor-pointer bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md hover:bg-indigo-200 transition-colors">
          {citationNumber}
        </sup>
      </a>
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 w-72 bg-slate-800 text-white text-sm rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 transform -translate-x-1/2 left-1/2">
        <p className="font-bold text-base mb-1 truncate">{source.title || 'Untitled Source'}</p>
        <a
          href={source.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-300 text-xs flex items-center hover:underline pointer-events-auto"
        >
          <LinkIcon className="w-3 h-3 mr-1.5 shrink-0" />
          <span className="truncate">{source.uri}</span>
        </a>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
      </div>
    </span>
  );
};