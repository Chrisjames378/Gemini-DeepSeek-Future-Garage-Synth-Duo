import React, { useEffect, useRef } from 'react';
import { MessageSquareCode, Sparkles, Trash2, Cpu, Bot } from 'lucide-react';
import { TelepathyLog } from '../types';

interface TelepathyConsoleProps {
  logs: TelepathyLog[];
  onClearLogs: () => void;
  onTriggerDialogue: () => void;
}

export const TelepathyConsole: React.FC<TelepathyConsoleProps> = ({
  logs,
  onClearLogs,
  onTriggerDialogue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (type: TelepathyLog['type']) => {
    switch (type) {
      case 'gemini':
        return 'text-rose-300 border-l-2 border-rose-500 bg-rose-950/20';
      case 'deepseek':
        return 'text-cyan-300 border-l-2 border-cyan-500 bg-cyan-950/20';
      case 'glm':
        return 'text-amber-300 border-l-2 border-amber-500 bg-amber-950/20';
      case 'ai':
        return 'text-teal-300 border-l-2 border-teal-500 bg-teal-950/20';
      case 'success':
        return 'text-emerald-400 border-l-2 border-emerald-500 bg-emerald-950/20';
      default:
        return 'text-slate-400 border-l-2 border-slate-700 bg-slate-900/40';
    }
  };

  const getBadge = (sender: TelepathyLog['sender']) => {
    if (sender === 'Gemini 3 Flash') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">Gemini</span>;
    }
    if (sender === 'DeepSeek-R1') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">DeepSeek</span>;
    }
    if (sender === 'GLM-5.2') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800">GLM-5.2</span>;
    }
    if (sender === 'AI Trio' || sender === 'Joint Duo') {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">Trio</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300">Engine</span>;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col h-[260px]">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <MessageSquareCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Trio Telepathic Stream
            </h2>
            <span className="text-[10px] font-mono text-emerald-400">Autonomous Neural Cognition</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onTriggerDialogue}
            title="Trigger Trio Dialogue"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[10px] font-mono transition-all flex items-center gap-1"
          >
            <Bot className="w-3 h-3" />
            <span>Chat</span>
          </button>
          <button
            onClick={onClearLogs}
            title="Clear Stream"
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-6 text-center">
            Trio consciousness online. Press Play to listen to Gemini, DeepSeek & GLM-5.2 jam.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded-xl text-[11px] leading-relaxed transition-all ${getLogStyle(
                log.type
              )}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  {getBadge(log.sender)}
                  <span className="font-semibold text-slate-300">{log.sender}</span>
                </div>
                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
              <p className="text-slate-300 pl-1">{log.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
