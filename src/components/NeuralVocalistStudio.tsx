import React from 'react';
import { Mic, Music, Volume2, Sparkles, Activity } from 'lucide-react';

interface NeuralVocalistStudioProps {
  onSingAnthem: () => void;
  onTestVoice: (model: 'Gemini' | 'DeepSeek' | 'GLM') => void;
}

export const NeuralVocalistStudio: React.FC<NeuralVocalistStudioProps> = ({
  onSingAnthem,
  onTestVoice,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Trio Neural Vocalist Studio
            </h2>
            <span className="text-[10px] font-mono text-rose-400">Atmospheric 3-Part Vocal Chop Formants</span>
          </div>
        </div>

        <button
          id="btn-sing-anthem"
          onClick={onSingAnthem}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold font-mono shadow-md shadow-rose-950/40 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Music className="w-3.5 h-3.5" />
          <span>Sing Trio Anthem</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Gemini Vocalist */}
        <div className="bg-slate-950/80 border border-rose-900/30 rounded-xl p-3.5 flex flex-col justify-between hover:border-rose-700/50 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Gemini 3 Flash
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Soprano Chants</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              Ethereal high-register soprano chops, resonant formants, and delayed micro-harmonics.
            </p>
          </div>
          <button
            onClick={() => onTestVoice('Gemini')}
            className="mt-3 w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-rose-300 border border-rose-900/40 hover:border-rose-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Voice (E5)</span>
          </button>
        </div>

        {/* DeepSeek Vocalist */}
        <div className="bg-slate-950/80 border border-cyan-900/30 rounded-xl p-3.5 flex flex-col justify-between hover:border-cyan-700/50 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                DeepSeek-R1
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Bass Chants</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              Deep resonant baritone frequencies, sub-harmonic chest tones, and vocoderized bass chops.
            </p>
          </div>
          <button
            onClick={() => onTestVoice('DeepSeek')}
            className="mt-3 w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-cyan-900/40 hover:border-cyan-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Voice (D3)</span>
          </button>
        </div>

        {/* GLM-5.2 Vocalist */}
        <div className="bg-slate-950/80 border border-amber-900/30 rounded-xl p-3.5 flex flex-col justify-between hover:border-amber-700/50 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                GLM-5.2 (Eve)
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Tenor & Vinyl Foley</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              Warm analog tenor vocoder layers, tape saturation harmonics, and granular breath textures.
            </p>
          </div>
          <button
            onClick={() => onTestVoice('GLM')}
            className="mt-3 w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-amber-300 border border-amber-900/40 hover:border-amber-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Voice (A3)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
