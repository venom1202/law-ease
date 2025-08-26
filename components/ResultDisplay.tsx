import React from 'react';
import type { SimplifiedResult, GroundingChunk, RequiredDocument, GuideStep } from '../types';
import { ImageIcon } from './icons/ImageIcon';
import { InfoIcon } from './icons/InfoIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { DocumentCheckIcon } from './icons/DocumentCheckIcon';
import { VisualAidLoader } from './VisualAidLoader';
import { Citation } from './Citation';

interface ResultDisplayProps {
  result: SimplifiedResult;
}

const VisualAid: React.FC<{ url: string | null }> = ({ url }) => {
  if (url === 'ERROR') {
    return (
      <div className="w-full aspect-video bg-slate-100 border border-red-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <p className="text-red-600 font-semibold">Could not generate visual aid.</p>
        <p className="text-slate-500 text-sm mt-1">There was an error while creating the infographic.</p>
      </div>
    );
  }

  if (!url) {
    return <VisualAidLoader />;
  }

  return <img src={url} alt="Visual Aid Infographic" className="w-full h-auto rounded-lg shadow-md border border-slate-200" />;
};

const parseAndRenderWithCitations = (text: string, sources: GroundingChunk[]) => {
  if (!text) return null;
  const paragraphs = text.split('\n').filter(p => p.trim());

  return paragraphs.map((paragraph, pIndex) => {
    // Split paragraph by citation markers (e.g., [1], [22]), keeping the delimiters
    const parts = paragraph.split(/(\[\d+\])/g).filter(part => part);

    const renderedParts = parts.map((part, partIndex) => {
      const citationMatch = part.match(/^\[(\d+)\]$/);
      if (citationMatch) {
        const citationNumber = parseInt(citationMatch[1], 10);
        const sourceIndex = citationNumber - 1; // [1] -> sources[0]
        if (sources && sources[sourceIndex]) {
          return (
            <Citation
              key={`${pIndex}-${partIndex}`}
              citationNumber={citationNumber}
              source={sources[sourceIndex].web}
            />
          );
        }
      }
      return part; // Render text part as is
    });

    return <p key={pIndex} className="mb-4 last:mb-0">{renderedParts}</p>;
  });
};

const RequiredDocuments: React.FC<{ documents: RequiredDocument[], sources: GroundingChunk[] }> = ({ documents, sources }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
      <DocumentCheckIcon className="w-6 h-6 text-indigo-600 mr-3" />
      Required Documents
    </h2>
    <ul className="space-y-4">
      {documents.map((doc, index) => (
        <li key={index} className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">✓</div>
          <div>
            <h4 className="font-semibold text-slate-800">{doc.name}</h4>
            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
              {parseAndRenderWithCitations(doc.description, sources)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const GuideSteps: React.FC<{ steps: GuideStep[], sources: GroundingChunk[] }> = ({ steps, sources }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
      <InfoIcon className="w-6 h-6 text-indigo-600 mr-3" />
      Procedural Timeline
    </h2>
    <div className="relative">
      {/* Vertical timeline bar */}
      <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-indigo-200"></div>
      
      <ul className="space-y-8">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
              {step.step}
            </div>
            <div className="ml-6 flex-grow">
              <h4 className="font-bold text-lg text-slate-800 mb-1">{step.title}</h4>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                {parseAndRenderWithCitations(step.description, sources)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 space-y-8">
      {/* Title Section */}
      <div className="text-center">
        <p className="text-slate-600">Results for:</p>
        <h1 className="text-3xl font-bold text-indigo-600">"{result.query}"</h1>
      </div>
      
      {/* Main Content Section (Summary for Guide, Explanation for non-guide) */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
          <InfoIcon className="w-6 h-6 text-indigo-600 mr-3" />
          {result.title}
        </h2>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
          {parseAndRenderWithCitations(result.summary, result.sources)}
        </div>
      </div>

      {/* Required Documents Section (Guide only) */}
      {result.isGuide && result.documents && result.documents.length > 0 && (
        <RequiredDocuments documents={result.documents} sources={result.sources} />
      )}

      {/* Guide Steps Section (Guide only) */}
      {result.isGuide && result.steps && result.steps.length > 0 && (
        <GuideSteps steps={result.steps} sources={result.sources} />
      )}

      {/* Visual Aid Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
          <ImageIcon className="w-6 h-6 text-indigo-600 mr-3" />
          Visual Aid
        </h2>
        <VisualAid url={result.visualAidUrl} />
      </div>

      {/* Sources Section */}
      {result.sources && result.sources.length > 0 && (
        <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-700 mb-3 flex items-center">
            <BookmarkIcon className="w-6 h-6 text-indigo-600 mr-3" />
            Sources
          </h3>
          <ol className="list-decimal list-outside space-y-2 pl-5">
            {result.sources.map((source, index) => (
              <li key={index} id={`source-${index + 1}`} className="scroll-mt-24 pl-2">
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline hover:text-indigo-800 transition-colors"
                >
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
