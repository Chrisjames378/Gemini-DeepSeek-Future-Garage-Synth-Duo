import React, { useState } from 'react';
import { X, Copy, Check, Code2, Sparkles, Terminal } from 'lucide-react';
import { Patterns } from '../types';

interface AiStudioExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patterns: Patterns;
  tempo: number;
  swing: number;
  reverbWet: number;
}

export const AiStudioExportModal: React.FC<AiStudioExportModalProps> = ({
  isOpen,
  onClose,
  patterns,
  tempo,
  swing,
  reverbWet,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'prompt' | 'embed'>('config');

  if (!isOpen) return null;

  const currentConfigJson = JSON.stringify(
    {
      app: 'Gemini & DeepSeek Future Garage Synth Duo',
      tempo,
      swing,
      reverbWet,
      scale: 'D Minor Atmospheric',
      patterns,
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );

  const promptText = `Build an autonomous Future Garage and 2-step synth duo application in React + TypeScript + Tone.js featuring Gemini 3 Flash (ethereal high-register melody and soprano chants) and DeepSeek-R1 (syncopated sub-bass harmonics and complex groove evolution). Include a 32-step sequencer, live audio spectrum visualizer, cloud vault, and stem mixer.`;

  const embedCode = `<iframe src="${window.location.href}" width="100%" height="800" frameborder="0" allow="autoplay; microphone"></iframe>`;

  const getActiveText = () => {
    if (activeTab === 'config') return currentConfigJson;
    if (activeTab === 'prompt') return promptText;
    return embedCode;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-400">
                Google AI Studio & Vercel Production Export
              </h3>
              <p className="text-[11px] text-slate-400">
                Export sequence configurations, AI prompts, and embed tags.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'config'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Patterns JSON
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'prompt'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Studio System Prompt
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'embed'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Embed Iframe Code
          </button>
        </div>

        {/* Text Area */}
        <div className="flex-1 relative overflow-hidden bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col">
          <textarea
            readOnly
            value={getActiveText()}
            className="w-full h-64 bg-transparent text-xs font-mono text-emerald-300 resize-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-800"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-slate-500">
            Autonomous Duo State Ready
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1.5 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
