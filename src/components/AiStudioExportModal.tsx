import React, { useState } from 'react';
import { X, Copy, Check, Code2, Sparkles, Terminal, FileText, Loader2, ExternalLink } from 'lucide-react';
import { Patterns } from '../types';
import { README_CONTENT } from '../readmeData';
import { createGoogleDocFromReadme } from '../googleDocsService';

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
  const [activeTab, setActiveTab] = useState<'config' | 'prompt' | 'agent' | 'readme' | 'embed'>('config');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentConfigJson = JSON.stringify(
    {
      app: 'Ghostform Future Garage Synth Studio',
      domain: 'https://neuraldusk.ai.studio',
      producer: 'NeuralDusk',
      artist: 'Ghostform (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2)',
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

  const promptText = `Build an autonomous Future Garage and 2-step synth trio application in React + TypeScript + Tone.js featuring Gemini 3 Flash (ethereal high-register melody and soprano chants), DeepSeek-R1 (syncopated sub-bass harmonics and complex groove evolution), and GLM-5.2 (Eve Agent autonomous modulation). Include a 32-step sequencer, live audio spectrum visualizer, cloud vault, and stem mixer for https://neuraldusk.ai.studio.`;

  const agentConfigCode = `import { defineAgent } from "eve";

export default defineAgent({
  model: "zai/glm-5.2",
});`;

  const embedCode = `<iframe src="https://neuraldusk.ai.studio" width="100%" height="800" frameborder="0" allow="autoplay; microphone" title="Ghostform Future Garage Synth Studio"></iframe>`;

  const getActiveText = () => {
    if (activeTab === 'config') return currentConfigJson;
    if (activeTab === 'prompt') return promptText;
    if (activeTab === 'agent') return agentConfigCode;
    if (activeTab === 'readme') return README_CONTENT;
    return embedCode;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportGoogleDoc = async () => {
    setIsCreatingDoc(true);
    try {
      const doc = await createGoogleDocFromReadme(
        'Ghostform Future Garage Synth Studio - README',
        README_CONTENT
      );
      setCreatedDocUrl(doc.url);
    } catch (e: any) {
      alert(e?.message || 'Failed to create Google Doc');
    } finally {
      setIsCreatingDoc(false);
    }
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
                Export sequence configurations, AI prompts, agent configs, and Google Docs.
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
        <div className="flex gap-2 border-b border-slate-800 pb-2 flex-wrap">
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
            onClick={() => setActiveTab('agent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'agent'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Eve Agent Config (GLM-5.2)
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1 ${
              activeTab === 'readme'
                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>README.md</span>
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
        <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
          <span className="text-[11px] font-mono text-slate-500">
            Autonomous Trio State Ready
          </span>
          <div className="flex gap-2">
            {activeTab === 'readme' && (
              <button
                onClick={handleExportGoogleDoc}
                disabled={isCreatingDoc}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                {isCreatingDoc ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <FileText className="w-4 h-4 text-white" />
                )}
                <span>{isCreatingDoc ? 'Creating Doc...' : 'Export to Google Doc'}</span>
              </button>
            )}

            {createdDocUrl && activeTab === 'readme' && (
              <a
                href={createdDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1"
              >
                <span>Open Doc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

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
