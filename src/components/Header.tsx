import React, { useState } from 'react';
import { Cpu, Play, Pause, Code, Download, Radio, Volume2, Music2, Share2, FileText, Globe, ExternalLink, Check } from 'lucide-react';

interface HeaderProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenExportModal: () => void;
  onOpenRecordModal: () => void;
  onOpenGoogleDocsModal?: () => void;
  onScrollToReleaseHub?: () => void;
  producerName: 'NeuralDusk' | 'Ghostform' | 'GhostSignal';
  tempo: number;
  currentBar: number;
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenExportModal,
  onOpenRecordModal,
  onOpenGoogleDocsModal,
  onScrollToReleaseHub,
  producerName,
  tempo,
  currentBar,
  currentStep,
}) => {
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleCopyDomain = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('https://neuraldusk.ai.studio');
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

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
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm md:text-base font-extrabold tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              GHOSTFORM • FUTURE GARAGE
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              Produced by NeuralDusk
            </span>
            <a
              id="header-live-domain-badge"
              href="https://neuraldusk.ai.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-800 transition shadow-sm hover:scale-105"
              title="Connected to https://neuraldusk.ai.studio (Click to open or copy)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <Globe className="w-2.5 h-2.5 text-cyan-400" />
              <span>neuraldusk.ai.studio</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>
          <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
            Artist: Ghostform (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2) • Producer: NeuralDusk • Connected to <a href="https://neuraldusk.ai.studio" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">neuraldusk.ai.studio</a>
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

        {onOpenGoogleDocsModal && (
          <button
            id="btn-open-google-docs"
            onClick={onOpenGoogleDocsModal}
            className="px-3.5 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900/90 border border-blue-800 text-blue-300 font-mono text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Export README & Documentation to Google Docs"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Google Docs</span>
            <span className="sm:hidden">Docs</span>
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
              <span>Pause Trio Jam</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Initialize Trio Jam</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
