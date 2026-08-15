export type ChordProgressionId = 'd_minor_ethereal' | 'burial_f_minor' | 'hyperdub_c_sharp' | 'neo_soul_eb_minor';

export interface ChordProgression {
  id: ChordProgressionId;
  name: string;
  keyLabel: string;
  description: string;
  chords: { name: string; notes: string[] }[];
  bassNotes: string[];
  vocalNotes: string[];
}

export const CHORD_PROGRESSIONS: ChordProgression[] = [
  {
    id: 'd_minor_ethereal',
    name: 'D Minor Ethereal (Signature)',
    keyLabel: 'D Minor',
    description: 'The iconic 2-step dusk sound: Dm9, Am9, Bbmaj9, Gm9.',
    chords: [
      { name: 'Dm9 (Ethereal)', notes: ['D3', 'F3', 'A3', 'C4', 'E4'] },
      { name: 'Am9 (Nocturnal)', notes: ['A2', 'C3', 'E3', 'G3', 'B3'] },
      { name: 'Bbmaj9 (Melancholy)', notes: ['Bb2', 'D3', 'F3', 'A3', 'C4'] },
      { name: 'Gm9 (Deep Sub)', notes: ['G2', 'Bb2', 'D3', 'F3', 'A3'] },
      { name: 'Fmaj7#11 (Dusk)', notes: ['F2', 'A2', 'C3', 'E3', 'B3'] },
      { name: 'Cadd9 (Dawn)', notes: ['C3', 'E3', 'G3', 'D4'] },
    ],
    bassNotes: ['D1', 'D1', 'F1', 'G1', 'A1', 'D1', 'C1', 'Bb1', 'G1', 'A1', 'F1', 'D1'],
    vocalNotes: ['A4', 'C5', 'D5', 'F5', 'G5', 'E5', 'Bb4', 'A5'],
  },
  {
    id: 'burial_f_minor',
    name: 'Burial Nostalgia (F Minor)',
    keyLabel: 'F Minor',
    description: 'Heavy rainy night mood: Fm9, Dbmaj7#11, Bbm9, Eb9.',
    chords: [
      { name: 'Fm9 (Rain)', notes: ['F2', 'Ab2', 'C3', 'Eb3', 'G3'] },
      { name: 'Dbmaj9 (Streetlight)', notes: ['Db2', 'F2', 'Ab2', 'C3', 'Eb3'] },
      { name: 'Bbm9 (Fog)', notes: ['Bb1', 'Db2', 'F2', 'Ab2', 'C3'] },
      { name: 'Eb9 (Distant Glow)', notes: ['Eb2', 'G2', 'Bb2', 'Db3', 'F3'] },
    ],
    bassNotes: ['F1', 'F1', 'Ab1', 'Bb1', 'C2', 'Db1', 'Eb1', 'F1', 'Db1', 'C1', 'Ab1', 'F1'],
    vocalNotes: ['C5', 'Eb5', 'F5', 'Ab5', 'Bb5', 'G5', 'F5', 'Eb5'],
  },
  {
    id: 'hyperdub_c_sharp',
    name: 'Hyperdub Grime (C# Minor)',
    keyLabel: 'C# Minor',
    description: 'Dark, tense underground club energy: C#m9, Aadd9, F#m9, G#7b9.',
    chords: [
      { name: 'C#m9 (Tension)', notes: ['C#3', 'E3', 'G#3', 'B3', 'D#4'] },
      { name: 'Amaj9 (Echo)', notes: ['A2', 'C#3', 'E3', 'G#3', 'B3'] },
      { name: 'F#m9 (Sub Trench)', notes: ['F#2', 'A2', 'C#3', 'E3', 'G#3'] },
      { name: 'G#m7 (Afterhours)', notes: ['G#2', 'B2', 'D#3', 'F#3'] },
    ],
    bassNotes: ['C#1', 'C#1', 'E1', 'F#1', 'G#1', 'A1', 'F#1', 'C#1', 'B0', 'G#0', 'C#1', 'E1'],
    vocalNotes: ['G#4', 'B4', 'C#5', 'E5', 'F#5', 'D#5', 'C#5', 'B4'],
  },
  {
    id: 'neo_soul_eb_minor',
    name: 'Neo-Soul Garage (Eb Minor 11)',
    keyLabel: 'Eb Minor',
    description: 'Warm, jazzy, tape-saturated Rhodes voicings: Ebm11, Bmaj9, Abm9, Db13.',
    chords: [
      { name: 'Ebm11 (Velvet)', notes: ['Eb2', 'Gb2', 'Bb2', 'Db3', 'Ab3'] },
      { name: 'Bmaj9 (Warmth)', notes: ['B1', 'Eb2', 'Gb2', 'Bb2', 'Db3'] },
      { name: 'Abm9 (Midnight Soul)', notes: ['Ab1', 'B1', 'Eb2', 'Gb2', 'Bb2'] },
      { name: 'Db13 (Silky)', notes: ['Db2', 'F2', 'B2', 'Eb3', 'Bb3'] },
    ],
    bassNotes: ['Eb1', 'Eb1', 'Gb1', 'Ab1', 'Bb1', 'B1', 'Db1', 'Eb1', 'Ab0', 'Bb0', 'Eb1', 'Gb1'],
    vocalNotes: ['Bb4', 'Db5', 'Eb5', 'Gb5', 'Ab5', 'F5', 'Eb5', 'Db5'],
  },
];

export type DrumKitId = 'garage_vinyl' | 'lofi_acoustic' | 'crisp_click';

export interface DrumKit {
  id: DrumKitId;
  name: string;
  character: string;
  kickPitch: string;
  kickDecay: number;
  kickOctaves: number;
  snareNoiseType: 'pink' | 'white' | 'brown';
  snareDecay: number;
}

export const DRUM_KITS: DrumKit[] = [
  {
    id: 'garage_vinyl',
    name: 'Analog 808/909 Vinyl Kit',
    character: 'Warm tape saturation, heavy sub punch & analog pink noise snare',
    kickPitch: 'C1',
    kickDecay: 0.35,
    kickOctaves: 5,
    snareNoiseType: 'pink',
    snareDecay: 0.18,
  },
  {
    id: 'lofi_acoustic',
    name: 'Acoustic Lo-Fi Wood Snare',
    character: 'Organic round thud, wooden rimshots & vintage room ambience',
    kickPitch: 'B0',
    kickDecay: 0.22,
    kickOctaves: 3.5,
    snareNoiseType: 'brown',
    snareDecay: 0.12,
  },
  {
    id: 'crisp_click',
    name: 'Pitch-Shifted Garage Click Kit',
    character: 'Crisp high-transient clicks, snappy micro-rims & hyper-syncopated tops',
    kickPitch: 'D1',
    kickDecay: 0.16,
    kickOctaves: 6,
    snareNoiseType: 'white',
    snareDecay: 0.09,
  },
];
