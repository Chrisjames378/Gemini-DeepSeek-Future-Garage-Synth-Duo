import React from 'react';
import { Sliders, Waves, Compass, Disc3, Sparkles, Music4, Drum } from 'lucide-react';
import { CloudTrack } from '../types';
import { CHORD_PROGRESSIONS, ChordProgressionId, DRUM_KITS, DrumKitId } from '../soundOptions';

interface FxControlsProps {
  tempo: number;
  reverbWet: number;
  filterCutoff: number;
  swing: number;
  chordProgressionId: ChordProgressionId;
  drumKitId: DrumKitId;
  presets: CloudTrack[];
  onUpdateTempo: (val: number) => void;
  onUpdateReverb: (val: number) => void;
  onUpdateFilterCutoff: (val: number) => void;
  onUpdateSwing: (val: number) => void;
  onSelectChordProgression: (id: ChordProgressionId) => void;
  onSelectDrumKit: (id: DrumKitId) => void;
  onSelectPreset: (preset: CloudTrack) => void;
}

export const FxControls: React.FC<FxControlsProps> = ({
  tempo,
  reverbWet,
  filterCutoff,
  swing,
  chordProgressionId,
  drumKitId,
  presets,
  onUpdateTempo,
  onUpdateReverb,
  onUpdateFilterCutoff,
  onUpdateSwing,
  onSelectChordProgression,
  onSelectDrumKit,
  onSelectPreset,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-teal-950/80 border border-teal-800 text-teal-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Master Acoustics & Sonic Engines
            </h3>
            <span className="text-[10px] font-mono text-teal-400">Atmospheric Space, Harmonics & Kits</span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs font-mono">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <select
            onChange={(e) => {
              const selected = presets.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            className="bg-transparent text-cyan-300 text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
            defaultValue=""
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">
              Select Preset...
            </option>
            {presets.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Harmonic Mode & Drum Kit Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Chord Progression Selector */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Music4 className="w-3.5 h-3.5" />
              Harmonic Chord Mode
            </span>
            <span className="text-[10px] text-slate-400">
              {CHORD_PROGRESSIONS.find((p) => p.id === chordProgressionId)?.keyLabel}
            </span>
          </div>
          <select
            value={chordProgressionId}
            onChange={(e) => onSelectChordProgression(e.target.value as ChordProgressionId)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {CHORD_PROGRESSIONS.map((prog) => (
              <option key={prog.id} value={prog.id} className="bg-slate-900 text-slate-200">
                {prog.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            {CHORD_PROGRESSIONS.find((p) => p.id === chordProgressionId)?.description}
          </p>
        </div>

        {/* Drum Kit Selector */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Drum className="w-3.5 h-3.5" />
              Drum Sample Engine
            </span>
            <span className="text-[10px] text-slate-400">2-Step Acoustics</span>
          </div>
          <select
            value={drumKitId}
            onChange={(e) => onSelectDrumKit(e.target.value as DrumKitId)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {DRUM_KITS.map((kit) => (
              <option key={kit.id} value={kit.id} className="bg-slate-900 text-slate-200">
                {kit.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            {DRUM_KITS.find((k) => k.id === drumKitId)?.character}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">

        {/* Tempo BPM */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Tempo (BPM)</span>
            <span className="font-bold text-emerald-400">{tempo} BPM</span>
          </div>
          <input
            id="slider-tempo"
            type="range"
            min="110"
            max="145"
            value={tempo}
            onChange={(e) => onUpdateTempo(Number(e.target.value))}
            className="w-full mt-2.5 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>110 Chill</span>
            <span>132 Garage</span>
            <span>145 Fast</span>
          </div>
        </div>

        {/* Reverb Space */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Reverb Space</span>
            <span className="font-bold text-teal-400">{Math.round(reverbWet * 100)}% Wet</span>
          </div>
          <input
            id="slider-reverb"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={reverbWet}
            onChange={(e) => onUpdateReverb(parseFloat(e.target.value))}
            className="w-full mt-2.5 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>Dry</span>
            <span>Cavern</span>
            <span>Cathedral</span>
          </div>
        </div>

        {/* Master Low-Pass Filter */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Master LP Filter</span>
            <span className="font-bold text-cyan-400">
              {filterCutoff >= 1000 ? `${(filterCutoff / 1000).toFixed(1)} kHz` : `${filterCutoff} Hz`}
            </span>
          </div>
          <input
            id="slider-filter"
            type="range"
            min="600"
            max="12000"
            step="200"
            value={filterCutoff}
            onChange={(e) => onUpdateFilterCutoff(Number(e.target.value))}
            className="w-full mt-2.5 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>Sub Lows</span>
            <span>Warmth</span>
            <span>Open Air</span>
          </div>
        </div>

        {/* 2-Step Swing */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>2-Step Swing</span>
            <span className="font-bold text-indigo-400">{Math.round(swing * 100)}%</span>
          </div>
          <input
            id="slider-swing"
            type="range"
            min="0"
            max="0.6"
            step="0.05"
            value={swing}
            onChange={(e) => onUpdateSwing(parseFloat(e.target.value))}
            className="w-full mt-2.5 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>Straight</span>
            <span>Syncopated</span>
            <span>Burial Shuffle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
