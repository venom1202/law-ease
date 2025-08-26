import React from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { TransportIcon } from './icons/TransportIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { HeartIcon } from './icons/HeartIcon';
import { LeafIcon } from './icons/LeafIcon';

interface CategorySelectorProps {
  onPromptClick: (prompt: string) => void;
}

const categories = [
  {
    name: 'Business & Corporate Law',
    icon: (props: React.SVGProps<SVGSVGElement>) => <BriefcaseIcon {...props} />,
    prompts: [
      'What is the process for company registration in India?',
      'Explain key aspects of the Indian Contract Act, 1872.',
      'What are GST compliance requirements for a small business?',
    ],
  },
  {
    name: 'Transport & Motor Vehicle Law',
    icon: (props: React.SVGProps<SVGSVGElement>) => <TransportIcon {...props} />,
    prompts: [
      'Penalties for traffic violations under the new Motor Vehicles Act?',
      'Explain the rules for compulsory vehicle insurance in India.',
      'What is the law regarding ride-sharing services like Uber/Ola?',
    ],
  },
  {
    name: 'Intellectual Property Law',
    icon: (props: React.SVGProps<SVGSVGElement>) => <LightbulbIcon {...props} />,
    prompts: [
      'How to register a trademark in India?',
      'What is the difference between copyright and patent?',
      'Explain patent infringement laws in India.',
    ],
  },
  {
    name: 'Family Law',
    icon: (props: React.SVGProps<SVGSVGElement>) => <HeartIcon {...props} />,
    prompts: [
      'What are the grounds for divorce under the Hindu Marriage Act?',
      'Explain the process of child adoption in India.',
      'What are the laws regarding domestic violence?',
    ],
  },
  {
    name: 'Environmental Law',
    icon: (props: React.SVGProps<SVGSVGElement>) => <LeafIcon {...props} />,
    prompts: [
      'What are the key provisions of the Environment Protection Act, 1986?',
      'Explain the role of the National Green Tribunal (NGT).',
      'What are the rules for waste management in India?',
    ],
  },
  {
    name: 'Other Common Laws',
    icon: (props: React.SVGProps<SVGSVGElement>) => <ScaleIcon {...props} />,
    prompts: [
      'What are the fundamental rights in the Indian Constitution?',
      'Explain the process of filing a Right to Information (RTI) request.',
      'What are the basic principles of property inheritance law?',
    ],
  },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onPromptClick }) => {
  return (
    <div className="mt-12">
      <h2 className="text-center text-2xl font-bold text-slate-700 mb-8">
        Or explore by category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.name} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <category.icon className="w-8 h-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold text-slate-800">{category.name}</h3>
            </div>
            <ul className="space-y-3">
              {category.prompts.map((prompt) => (
                <li key={prompt}>
                  <button
                    onClick={() => onPromptClick(prompt)}
                    className="w-full text-left flex items-center text-slate-600 hover:text-indigo-600 group transition-colors"
                    aria-label={`Search for: ${prompt}`}
                  >
                    <ChevronRightIcon className="w-5 h-5 mr-2 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
                    <span>{prompt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
