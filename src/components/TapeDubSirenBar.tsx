import React, { useState } from 'react';
import { Volume2, Radio, CloudRain, Disc3, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { audioEngine } from '../audioEngine';

interface TapeDubSirenBarProps {
  isPlaying: boolean;
  rainVolume: number;
  vinylVolume: number;
  onUpdateRainVolume: (val: number) => void;
  onUpdateVinylVolume: (val: number) => void;
}

export const TapeDubSirenBar: React.FC<TapeDubSirenBarProps> = ({
  isPlaying,
  rainVolume,
  vinylVolume,
  onUpdateRainVolume,
  onUpdateVinylVolume,
}) => {
  const [tapeStopping, setTapeStopping] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);

  const handleTapeStop = () => {
    if (!isPlaying) return;
    setTapeStopping(true);
    audioEngine.toggleTapeStop(1.2);
    setTimeout(() => setTapeStopping(false), 1600);
  };

  const handleDubSiren = () => {
    setSirenActive(true);
    audioEngine.triggerDubSiren();
    setTimeout(() => setSirenActive(false), 2600);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Dub & Live Performance FX Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Dub Matrix & Foley
            </h4>
            <span className="text-[10px] font-mono text-amber-400">Sound System Performance</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-2">
          {/* Tape Stop Button */}
          <button
            id="btn-tape-stop"
            onClick={handleTapeStop}
            disabled={!isPlaying}
            title="Momentary Vinyl Motor Pitch Slowdown"
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
              tapeStopping
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-950 animate-pulse'
                : isPlaying
                ? 'bg-slate-950 hover:bg-rose-950/60 border-rose-900/80 text-rose-300 hover:text-rose-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{tapeStopping ? 'BRAKING...' : 'TAPE STOP'}</span>
          </button>

          {/* Dub Siren Button */}
          <button
            id="btn-dub-siren"
            onClick={handleDubSiren}
            title="Classic UK Garage / Dub Echo Siren"
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
              sirenActive
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-950 animate-pulse'
                : 'bg-slate-950 hover:bg-amber-950/60 border-amber-900/80 text-amber-300 hover:text-amber-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${sirenActive ? 'animate-spin' : ''}`} />
            <span>{sirenActive ? 'SIREN ECHO...' : 'DUB SIREN'}</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Foley Sliders (Rain & Vinyl) */}
      <div className="flex items-center gap-4 w-full md:w-auto bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
        {/* Rain Foley */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial">
          <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
              <span>Rain Foley</span>
              <span className="text-cyan-400 font-bold">{Math.round(rainVolume * 100)}%</span>
            </div>
            <input
              id="slider-rain"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={rainVolume}
              onChange={(e) => onUpdateRainVolume(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        <div className="w-[1px] h-6 bg-slate-800 hidden sm:block" />

        {/* Vinyl Crackle */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial">
          <Disc3 className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
              <span>Vinyl Crackle</span>
              <span className="text-amber-400 font-bold">{Math.round(vinylVolume * 100)}%</span>
            </div>
            <input
              id="slider-vinyl"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={vinylVolume}
              onChange={(e) => onUpdateVinylVolume(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
