import React, { useState } from 'react';
import { Cloud, CloudUpload, Play, Trash2, Download, Sparkles, Bot, Tag } from 'lucide-react';
import { CloudTrack, FeatureProposal } from '../types';

interface CloudVaultProps {
  tracks: CloudTrack[];
  proposals: FeatureProposal[];
  onLoadTrack: (track: CloudTrack) => void;
  onSaveTrack: (title: string, description: string) => void;
  onDeleteTrack: (id: string) => void;
  onAskDuoForFeatures: () => void;
}

export const CloudVault: React.FC<CloudVaultProps> = ({
  tracks,
  proposals,
  onLoadTrack,
  onSaveTrack,
  onDeleteTrack,
  onAskDuoForFeatures,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSaveTrack(newTitle.trim(), 'Custom Duo Composition');
    setNewTitle('');
    setShowSaveInput(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cloud Track Vault */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                AI Duo Cloud Track Vault
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">
                {tracks.length} Saved Sequences
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSaveInput(!showSaveInput)}
            className="px-2.5 py-1 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-mono transition flex items-center gap-1.5"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>{showSaveInput ? 'Cancel' : 'Save Track'}</span>
          </button>
        </div>

        {/* Save Input Drawer */}
        {showSaveInput && (
          <form onSubmit={handleSaveSubmit} className="mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Track title (e.g. Midnight 2-Step Jam)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Save
            </button>
          </form>
        )}

        {/* Track List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-56 pr-1 custom-scrollbar">
          {tracks.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-4 text-center">
              No tracks saved in vault yet. Click 'Save Track'.
            </div>
          ) : (
            tracks.map((track) => (
              <div
                key={track.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-400 truncate">{track.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{track.tempo} BPM</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                    <span>By {track.creator}</span>
                    <span>•</span>
                    <span>{new Date(track.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onLoadTrack(track)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-mono transition flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Load</span>
                  </button>

                  <button
                    onClick={() => onDeleteTrack(track.id)}
                    title="Delete track"
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-rose-400 border border-slate-800 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Duo Feature Request & Autonomous Proposals */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                AI Duo Feature Requests & Brainstorms
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">
                Collaborative Duo Roadmap
              </span>
            </div>
          </div>

          <button
            onClick={onAskDuoForFeatures}
            className="px-2.5 py-1 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono transition flex items-center gap-1.5 active:scale-95"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Duo What's Next</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-56 pr-1 custom-scrollbar">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="p-3 rounded-xl bg-slate-950/80 border border-cyan-900/30 hover:border-cyan-700/50 transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">{prop.title}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                  {prop.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{prop.description}</p>
              <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Proposed by: {prop.proposedBy}</span>
                <span className="text-teal-400">Neural Ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
