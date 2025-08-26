import React, { useState, useEffect } from 'react';
import { ImageIcon } from './icons/ImageIcon';

const loadingMessages = [
  "Analyzing your query...",
  "Designing a clear visual...",
  "Rendering infographic elements...",
  "Finalizing the layout...",
  "Almost ready!",
];

export const VisualAidLoader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-video bg-slate-200 border border-slate-300 rounded-lg p-6 overflow-hidden relative">
      <div className="animate-pulse flex flex-col h-full">
        {/* Title skeleton */}
        <div className="h-6 bg-slate-300 rounded w-3/4 mb-6"></div>
        
        <div className="flex-grow flex items-center justify-around gap-4">
          {/* Chart-like bars */}
          <div className="w-1/4 h-full flex flex-col justify-end gap-2">
            <div className="h-1/3 bg-slate-300 rounded-sm"></div>
            <div className="h-2/5 bg-slate-300 rounded-sm"></div>
          </div>
          <div className="w-1/4 h-full flex flex-col justify-end gap-2">
            <div className="h-1/2 bg-slate-300 rounded-sm"></div>
            <div className="h-1/3 bg-slate-300 rounded-sm"></div>
          </div>
           {/* Icon skeleton */}
          <div className="w-1/3 h-2/3 bg-slate-300 rounded-lg flex items-center justify-center">
             <ImageIcon className="w-16 h-16 text-slate-400" />
          </div>
        </div>
        
        {/* Text lines skeleton */}
        <div className="mt-6 space-y-3">
            <div className="h-4 bg-slate-300 rounded w-full"></div>
            <div className="h-4 bg-slate-300 rounded w-5/6"></div>
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

      {/* Loading text overlay */}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
        <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-md">
          {loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
};