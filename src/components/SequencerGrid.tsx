import React from 'react';
import { Sliders, RefreshCw, Trash2, Dices, Sparkles, Cpu } from 'lucide-react';
import { Patterns, TrackType } from '../types';

interface SequencerGridProps {
  patterns: Patterns;
  currentStep: number;
  mutationInterval: number;
  mutationCountdown: number;
  onToggleStep: (track: TrackType, stepIdx: number) => void;
  onClearTrack: (track: TrackType) => void;
  onRandomizeTrack: (track: TrackType) => void;
  onClearAll: () => void;
  onMutateNow: () => void;
  onChangeMutationInterval: (val: number) => void;
}

interface TrackMeta {
  key: TrackType;
  label: string;
  sub: string;
  colorActive: string;
  colorRing: string;
  tagColor: string;
}

const TRACKS_META: TrackMeta[] = [
  {
    key: 'drums',
    label: '2-Step Percussion',
    sub: 'Kick / Snare / Ghost Hi-Hats',
    colorActive: 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
    colorRing: 'ring-emerald-400',
    tagColor: 'bg-emerald-500',
  },
  {
    key: 'bass',
    label: 'Sub Bassline',
    sub: '808 Deep Sub & Reese Notes',
    colorActive: 'bg-teal-500 text-slate-950 shadow-teal-500/30',
    colorRing: 'ring-teal-400',
    tagColor: 'bg-teal-500',
  },
  {
    key: 'chords',
    label: 'Atmospheric Pads',
    sub: 'Minor 9th Lush Ethereal Chords',
    colorActive: 'bg-cyan-500 text-slate-950 shadow-cyan-500/30',
    colorRing: 'ring-cyan-400',
    tagColor: 'bg-cyan-500',
  },
  {
    key: 'fx',
    label: 'Glitch / Stutter FX',
    sub: 'Granular Clicks & Tape Noise',
    colorActive: 'bg-indigo-500 text-slate-950 shadow-indigo-500/30',
    colorRing: 'ring-indigo-400',
    tagColor: 'bg-indigo-500',
  },
  {
    key: 'vocals',
    label: 'Vocal Chop Chants',
    sub: 'AI Duo Melodic Chants',
    colorActive: 'bg-rose-500 text-slate-950 shadow-rose-500/30',
    colorRing: 'ring-rose-400',
    tagColor: 'bg-rose-500',
  },
];

export const SequencerGrid: React.FC<SequencerGridProps> = ({
  patterns,
  currentStep,
  mutationInterval,
  mutationCountdown,
  onToggleStep,
  onClearTrack,
  onRandomizeTrack,
  onClearAll,
  onMutateNow,
  onChangeMutationInterval,
}) => {
  const stepCount = 32;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              32-Step Future Garage Sequencer Grid
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">
              2 Bars (32 16th-Notes) • Syncopated Polyphony
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Auto Mutate:</span>
            <select
              value={mutationInterval}
              onChange={(e) => onChangeMutationInterval(Number(e.target.value))}
              className="bg-transparent text-emerald-400 text-xs focus:outline-none cursor-pointer"
            >
              <option value="4" className="bg-slate-900 text-slate-200">Every 4 Bars</option>
              <option value="8" className="bg-slate-900 text-slate-200">Every 8 Bars</option>
              <option value="16" className="bg-slate-900 text-slate-200">Every 16 Bars</option>
            </select>
          </div>

          <button
            onClick={onMutateNow}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-slate-700 transition flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Mutate Step</span>
          </button>

          <button
            onClick={onClearAll}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-mono border border-slate-700 transition flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Grid</span>
          </button>
        </div>
      </div>

      {/* Grid Rows */}
      <div className="space-y-4">
        {TRACKS_META.map((track) => {
          const pattern = patterns[track.key];

          return (
            <div key={track.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${track.tagColor}`} />
                  <span className="font-bold text-slate-200">{track.label}</span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">({track.sub})</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <button
                    onClick={() => onRandomizeTrack(track.key)}
                    title={`Randomize ${track.label}`}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition"
                  >
                    <Dices className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onClearTrack(track.key)}
                    title={`Clear ${track.label}`}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 32 Step Buttons */}
              <div className="grid grid-cols-16 md:grid-cols-32 gap-1 bg-slate-950 p-2 rounded-xl border border-slate-800/90 shadow-inner overflow-x-auto">
                {Array.from({ length: stepCount }).map((_, stepIdx) => {
                  const isActive = pattern[stepIdx] === 1;
                  const isCurrent = stepIdx === currentStep;
                  const isBarBeat = stepIdx % 4 === 0;
                  const isBarBoundary = stepIdx % 16 === 0;

                  return (
                    <button
                      key={stepIdx}
                      id={`step-${track.key}-${stepIdx}`}
                      onClick={() => onToggleStep(track.key, stepIdx)}
                      className={`h-8 rounded-lg font-mono text-[9px] font-semibold transition-all flex flex-col items-center justify-center relative ${
                        isActive
                          ? `${track.colorActive} shadow-md scale-[0.98]`
                          : isBarBeat
                          ? 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-t border-slate-700/60'
                          : 'bg-slate-950 text-slate-600 hover:bg-slate-900 border border-slate-900'
                      } ${
                        isCurrent
                          ? 'ring-2 ring-white scale-105 z-10 shadow-lg shadow-white/20'
                          : ''
                      }`}
                      title={`Step ${stepIdx + 1}`}
                    >
                      <span>{stepIdx + 1}</span>
                      {isActive && (
                        <span className="w-1 h-1 rounded-full bg-slate-950 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Autonomous Neural Evolution: Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            Next Mutation in: <strong className="text-emerald-400">{mutationCountdown}s</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
