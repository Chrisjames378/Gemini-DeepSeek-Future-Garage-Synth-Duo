import { Patterns, CloudTrack } from './types';

export const DEFAULT_PATTERNS: Patterns = {
  drums: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  bass:  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
  chords:[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  fx:    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
  vocals:[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
};

export const INITIAL_PRESETS: CloudTrack[] = [
  {
    id: 'preset-1',
    title: 'Burial Nocturne (Atmospheric 2-Step)',
    tempo: 132,
    swing: 0.3,
    reverbWet: 0.75,
    filterCutoff: 4200,
    creator: 'Gemini 3 Flash & DeepSeek-R1',
    createdAt: new Date().toISOString(),
    description: 'Iconic South London future garage sound with ghost snares and ethereal vocal chops.',
    tags: ['Future Garage', 'Burial Style', 'Atmospheric', '2-Step'],
    patterns: {
      drums: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
      bass:  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
      chords:[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      fx:    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
      vocals:[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
    }
  },
  {
    id: 'preset-2',
    title: 'Neon Rain (Melodic Glitch Chillout)',
    tempo: 128,
    swing: 0.2,
    reverbWet: 0.82,
    filterCutoff: 3800,
    creator: 'Gemini 3 Flash',
    createdAt: new Date().toISOString(),
    description: 'Slow-burning nocturnal ambient pad textures paired with syncopated glitch percussions.',
    tags: ['Melodic', 'Downtempo', 'Glitch', 'Lush Pads'],
    patterns: {
      drums: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      bass:  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      chords:[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      fx:    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
      vocals:[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  {
    id: 'preset-3',
    title: 'DeepSeek Sub-Harmonic Matrix (Deep 140)',
    tempo: 138,
    swing: 0.35,
    reverbWet: 0.6,
    filterCutoff: 5200,
    creator: 'DeepSeek-R1',
    createdAt: new Date().toISOString(),
    description: 'Heavy sub-bass resonance, fast polyrhythmic rimshots and crisp hi-hat stutters.',
    tags: ['Sub Heavy', 'Polyrhythmic', 'Deep Bass', 'Fast Garage'],
    patterns: {
      drums: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
      bass:  [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
      chords:[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      fx:    [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      vocals:[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0]
    }
  },
  {
    id: 'preset-4',
    title: 'GLM-5.2 Analog Tape Resonance (Nocturnal Dub)',
    tempo: 134,
    swing: 0.28,
    reverbWet: 0.7,
    filterCutoff: 4600,
    creator: 'GLM-5.2 (Eve Agent)',
    createdAt: new Date().toISOString(),
    description: 'Analog tape saturation, mid-range vocoder chant layers, vinyl crackle and syncopated off-beat chords.',
    tags: ['Analog Warmth', 'GLM-5.2', 'Tape Dub', 'Future Garage'],
    patterns: {
      drums: [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
      bass:  [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
      chords:[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      fx:    [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      vocals:[0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0]
    }
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop-1',
    title: 'Neural Vocalist Studio with 3-Part AI Harmony Choir',
    description: 'Dynamic multi-octave soprano (Gemini), deep baritone (DeepSeek), and analog tenor (GLM-5.2) vocal engine.',
    proposedBy: 'AI Trio' as const,
    status: 'integrated' as const
  },
  {
    id: 'prop-2',
    title: 'Autonomous Bar-Based Mutation Matrix',
    description: 'Self-evolving sequencer logic shifting syncopation every 4, 8, or 16 bars.',
    proposedBy: 'DeepSeek-R1' as const,
    status: 'integrated' as const
  },
  {
    id: 'prop-3',
    title: 'Atmospheric Granular Tape-Stop & Reverb Decay',
    description: 'Instant stutter freeze and deep cathedral spatial diffusion.',
    proposedBy: 'Gemini 3 Flash' as const,
    status: 'integrated' as const
  },
  {
    id: 'prop-4',
    title: 'Eve Agent Architecture & ZAI GLM-5.2 Master Bus',
    description: 'Autonomous agent runtime integration for automated master sound design and pattern balancing.',
    proposedBy: 'GLM-5.2' as const,
    status: 'integrated' as const
  }
];
