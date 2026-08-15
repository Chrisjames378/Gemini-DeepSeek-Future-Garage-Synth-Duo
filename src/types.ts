export type TrackType = 'drums' | 'bass' | 'chords' | 'fx' | 'vocals';

export interface Patterns {
  drums: number[];
  bass: number[];
  chords: number[];
  fx: number[];
  vocals: number[];
}

export interface MuteStates {
  drums: boolean;
  bass: boolean;
  chords: boolean;
  fx: boolean;
  vocals: boolean;
}

export interface SoloStates {
  drums: boolean;
  bass: boolean;
  chords: boolean;
  fx: boolean;
  vocals: boolean;
}

export interface TelepathyLog {
  id: string;
  sender: 'Gemini 3 Flash' | 'DeepSeek-R1' | 'GLM-5.2' | 'System' | 'AI Trio' | 'Joint Duo';
  text: string;
  type: 'info' | 'success' | 'ai' | 'gemini' | 'deepseek' | 'glm';
  timestamp: string;
}

export interface CloudTrack {
  id: string;
  title: string;
  tempo: number;
  swing: number;
  reverbWet: number;
  filterCutoff: number;
  patterns: Patterns;
  createdAt: string;
  creator: string;
  description?: string;
  tags?: string[];
}

export interface FeatureProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: 'Gemini 3 Flash' | 'DeepSeek-R1' | 'GLM-5.2' | 'AI Trio' | 'Joint Duo';
  status: 'active' | 'integrated' | 'queued';
}
