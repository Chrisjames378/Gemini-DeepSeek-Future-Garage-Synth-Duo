import React, { useState } from 'react';
import { X, Download, FileAudio, Check, Music2, Radio, Sliders, Disc3 } from 'lucide-react';
import { Patterns, TrackType } from '../types';
import { generateMidiFile } from '../midiExporter';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patterns: Patterns;
  tempo: number;
  swing: number;
  producerName?: string;
  onExportStem: (track: TrackType) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  patterns,
  tempo,
  swing,
  producerName = 'NeuralDusk',
  onExportStem,
}) => {
  const [downloadedAll, setDownloadedAll] = useState(false);
  const [midiDownloaded, setMidiDownloaded] = useState(false);

  if (!isOpen) return null;

  const tracks: { key: TrackType; name: string; desc: string; color: string }[] = [
    { key: 'drums', name: '2-Step Percussion Stem', desc: 'Syncopated kick, snare, ghost shuffle hats', color: 'text-emerald-400' },
    { key: 'bass', name: 'Sub Bassline Stem', desc: '808 sub frequencies and Reese glide notes', color: 'text-teal-400' },
    { key: 'chords', name: 'Atmospheric Pads Stem', desc: 'Minor 9th ethereal lush spatial chords', color: 'text-cyan-400' },
    { key: 'fx', name: 'Glitch / Stutter FX Stem', desc: 'Granular white noise and tape crackle', color: 'text-indigo-400' },
    { key: 'vocals', name: 'Vocal Chop Chants Stem', desc: 'Formant AI duo soprano and bass chants', color: 'text-rose-400' },
  ];

  const handleExportMidi = () => {
    const { blob, filename } = generateMidiFile(patterns, tempo, `${producerName} - Future Garage Session`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setMidiDownloaded(true);
    setTimeout(() => setMidiDownloaded(false), 2500);
  };

  const handleExportAllStems = () => {
    const fullProject = {
      project: `${producerName} Future Garage Synth Studio`,
      tempo,
      swing,
      key: 'D Minor Atmospheric (Dm9 - Am9 - Bbmaj9 - Gm9)',
      patterns,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(fullProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${producerName.toLowerCase()}-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadedAll(true);
    setTimeout(() => setDownloadedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-cyan-400">
                Stem Isolation & DAW MIDI Package
              </h3>
              <p className="text-[11px] text-slate-400">
                Export lossless multi-track stems, Type-1 MIDI files, and pattern JSON for your DAW.
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

        {/* Stem List */}
        <div className="space-y-2.5">
          {tracks.map((track) => (
            <div
              key={track.key}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div>
                <span className={`text-xs font-mono font-bold ${track.color}`}>
                  {track.name}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">{track.desc}</p>
              </div>

              <button
                onClick={() => onExportStem(track.key)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-mono transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Stem</span>
              </button>
            </div>
          ))}
        </div>

        {/* Full Project & MIDI Export */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            <span>Arrangement: 32 Steps (2 Bars)</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleExportMidi}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-950"
            >
              {midiDownloaded ? <Check className="w-4 h-4 text-white" /> : <Music2 className="w-4 h-4" />}
              <span>{midiDownloaded ? 'MIDI Exported!' : 'Export Multi-Track .MID'}</span>
            </button>

            <button
              onClick={handleExportAllStems}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-1.5 active:scale-95"
            >
              {downloadedAll ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
              <span>{downloadedAll ? 'JSON Exported!' : 'Export All (.JSON)'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
