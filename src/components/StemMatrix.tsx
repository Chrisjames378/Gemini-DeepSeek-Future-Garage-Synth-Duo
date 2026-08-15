import React from 'react';
import { SlidersHorizontal, Download, Volume2, VolumeX, Mic, Activity, Radio } from 'lucide-react';
import { TrackType, MuteStates, SoloStates } from '../types';

interface StemMatrixProps {
  mutes: MuteStates;
  solos: SoloStates;
  volumes: Record<TrackType, number>;
  onToggleMute: (track: TrackType) => void;
  onToggleSolo: (track: TrackType) => void;
  onChangeVolume: (track: TrackType, val: number) => void;
  onExportStem: (track: TrackType) => void;
}

interface StemMeta {
  key: TrackType;
  label: string;
  sub: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
}

const STEMS_META: StemMeta[] = [
  {
    key: 'drums',
    label: '2-Step Drums',
    sub: 'Kick, Snare, Ghost Hats',
    badgeColor: 'bg-emerald-500',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-900/40',
  },
  {
    key: 'bass',
    label: 'Sub Bassline',
    sub: '808 Sub & Reese Glide',
    badgeColor: 'bg-teal-500',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-900/40',
  },
  {
    key: 'chords',
    label: 'Atmospheric Pads',
    sub: 'Minor 9th Lush Spatial',
    badgeColor: 'bg-cyan-500',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-900/40',
  },
  {
    key: 'fx',
    label: 'Glitch & Crackle',
    sub: 'Granular Stutter & Noise',
    badgeColor: 'bg-indigo-500',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-900/40',
  },
  {
    key: 'vocals',
    label: 'Vocal Chants',
    sub: 'Ethereal AI Chops',
    badgeColor: 'bg-rose-500',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-900/40',
  },
];

export const StemMatrix: React.FC<StemMatrixProps> = ({
  mutes,
  solos,
  volumes,
  onToggleMute,
  onToggleSolo,
  onChangeVolume,
  onExportStem,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Duo Stem Isolation & Mix Matrix
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Solo / Mute / Level Stems</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          5 Autonomous Stereo Channels
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {STEMS_META.map((stem) => {
          const isMuted = mutes[stem.key];
          const isSolo = solos[stem.key];

          return (
            <div
              key={stem.key}
              className={`bg-slate-950/80 border ${stem.borderColor} rounded-xl p-3 flex flex-col justify-between transition-all ${
                isSolo
                  ? 'ring-2 ring-cyan-500/80 shadow-lg shadow-cyan-950/50'
                  : isMuted
                  ? 'opacity-60 grayscale-[30%]'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${stem.textColor} flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${stem.badgeColor}`} />
                    {stem.label}
                  </span>
                  <button
                    onClick={() => onExportStem(stem.key)}
                    title={`Export ${stem.label} Stem`}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{stem.sub}</p>
              </div>

              {/* Volume Slider */}
              <div className="my-2.5">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                  <span>Gain</span>
                  <span>{Math.round(volumes[stem.key] * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volumes[stem.key]}
                  onChange={(e) => onChangeVolume(stem.key, parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Mute & Solo Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  id={`btn-mute-${stem.key}`}
                  onClick={() => onToggleMute(stem.key)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                    isMuted
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                <button
                  id={`btn-solo-${stem.key}`}
                  onClick={() => onToggleSolo(stem.key)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    isSolo
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  Solo
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
