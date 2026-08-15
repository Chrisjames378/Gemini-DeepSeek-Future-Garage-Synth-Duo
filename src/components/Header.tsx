import React from 'react';
import { Cpu, Play, Pause, Code, Download, Radio, Volume2, Music2, Share2 } from 'lucide-react';

interface HeaderProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenExportModal: () => void;
  onOpenRecordModal: () => void;
  onScrollToReleaseHub?: () => void;
  producerName: 'NeuralDusk' | 'GhostSignal';
  tempo: number;
  currentBar: number;
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenExportModal,
  onOpenRecordModal,
  onScrollToReleaseHub,
  producerName,
  tempo,
  currentBar,
  currentStep,
}) => {
  return (
    <header className="border-b border-slate-900 bg-slate-950/85 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-950/50 relative overflow-hidden">
          <Cpu className="w-5 h-5 text-slate-950" />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-extrabold tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {producerName.toUpperCase()} • FUTURE GARAGE SYNTH DUO
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              Duo Neural Live
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
            Gemini 3 Flash x DeepSeek-R1 • YouTube Visualizers • SoundCloud & Bandcamp Distribution • MIDI Multi-Track
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-slate-300">
          <span className="text-slate-500">POS:</span>
          <span className="text-emerald-400 font-bold">Bar {currentBar}</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">Step {currentStep + 1}/32</span>
          <span className="text-slate-600">|</span>
          <span className="text-teal-400">{tempo} BPM</span>
        </div>

        {onScrollToReleaseHub && (
          <button
            id="btn-nav-release-hub"
            onClick={onScrollToReleaseHub}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-950/80 to-purple-950/80 hover:from-rose-900 hover:to-purple-900 border border-rose-800/80 text-rose-300 font-mono text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Share2 className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Release Hub & Video</span>
            <span className="sm:hidden">Release</span>
          </button>
        )}

        <button
          id="btn-open-record"
          onClick={onOpenRecordModal}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 hover:text-cyan-300 font-mono text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export & MIDI</span>
          <span className="sm:hidden">Export</span>
        </button>

        <button
          id="btn-master-play"
          onClick={onTogglePlay}
          className={`px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-rose-950/50 ring-2 ring-rose-500/40'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-950/60'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Duo Jam</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Initialize Duo Jam</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
