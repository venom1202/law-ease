export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  BENGALI = 'Bengali',
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}

export interface GuideStep {
  step: number;
  title: string;
  description: string;
}

export interface RequiredDocument {
  name: string;
  description: string;
}

export interface SimplifiedResult {
  query: string;
  title: string;
  summary: string; // Main explanation or overview of the guide
  isGuide: boolean;
  steps?: GuideStep[];
  documents?: RequiredDocument[];
  sources: GroundingChunk[];
  visualAidUrl: string | null;
}
