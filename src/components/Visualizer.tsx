import React, { useEffect, useRef } from 'react';
import { Zap, CloudUpload, Disc, Play, Activity } from 'lucide-react';
import { audioEngine } from '../audioEngine';

interface VisualizerProps {
  isPlaying: boolean;
  onNeuralImprov: () => void;
  onSaveToCloud: () => void;
  currentChordName: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  isPlaying,
  onNeuralImprov,
  onSaveToCloud,
  currentChordName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let hue = 160;

    const render = () => {
      if (!canvas) return;
      const width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 600);
      const height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 160);

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const analyserData = audioEngine.getAnalyserData();
      const bars = 48;
      const barWidth = width / bars;
      const dataLen = analyserData.length || 64;

      // Draw subtle grid lines
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let y = height * 0.25; y < height; y += height * 0.25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i < bars; i++) {
        const dataIdx = Math.floor((i / bars) * dataLen);
        const rawVal = analyserData[dataIdx];
        // Normalize dB value (-100 to 0) into 0..1 range
        const normalized = isPlaying
          ? Math.max(0.05, Math.min(1, (rawVal + 90) / 75))
          : 0.04 + Math.sin(Date.now() * 0.002 + i * 0.2) * 0.02;

        const barHeight = normalized * height * 0.88;
        const x = i * barWidth;
        const y = height - barHeight;

        // Gradient for each bar
        const gradient = ctx.createLinearGradient(0, height, 0, y);
        gradient.addColorStop(0, `hsla(${hue + i * 2.5}, 90%, 45%, 0.9)`);
        gradient.addColorStop(1, `hsla(${hue + i * 2.5 + 40}, 95%, 65%, 0.95)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Top rounded bar
        const radius = Math.min(3, barWidth * 0.3);
        ctx.roundRect(x + 2, y, barWidth - 4, barHeight, [radius, radius, 0, 0]);
        ctx.fill();

        // Glow tip
        if (isPlaying && normalized > 0.4) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y + 2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      hue = (hue + 0.3) % 360;
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-3 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
              }`}
            />
            <span className="text-xs font-mono text-slate-300 font-semibold">
              Live AI Performance Spectrum & Neural Morph
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800">
            Chord: {currentChordName}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-neural-improv"
            onClick={onNeuralImprov}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-950/40 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Neural Improv</span>
          </button>
          <button
            id="btn-save-cloud"
            onClick={onSaveToCloud}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950/40 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Save to Vault</span>
          </button>
        </div>
      </div>

      {/* Canvas Visualizer with Vinyl Animation */}
      <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Subtle spinning vinyl overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <Disc
            className={`w-24 h-24 text-emerald-400 ${
              isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
};
