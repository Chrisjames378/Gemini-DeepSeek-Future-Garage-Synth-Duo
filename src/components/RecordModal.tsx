import React, { useState } from 'react';
import { X, Download, FileAudio, Check, Music2, Radio, Sliders, Disc3, Loader2 } from 'lucide-react';
import { Patterns, TrackType } from '../types';
import { generateMidiFile } from '../midiExporter';
import { renderTrackToWav } from '../offlineStemRenderer';
import { ChordProgressionId, DrumKitId } from '../soundOptions';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patterns: Patterns;
  tempo: number;
  swing: number;
  producerName?: string;
  chordProgressionId?: ChordProgressionId;
  drumKitId?: DrumKitId;
  onExportStem: (track: TrackType) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  patterns,
  tempo,
  swing,
  producerName = 'NeuralDusk',
  chordProgressionId = 'd_minor_ethereal' as ChordProgressionId,
  drumKitId = 'garage_vinyl' as DrumKitId,
  onExportStem,
}) => {
  const [downloadedAll, setDownloadedAll] = useState(false);
  const [midiDownloaded, setMidiDownloaded] = useState(false);
  const [renderingTrack, setRenderingTrack] = useState<TrackType | null>(null);

  if (!isOpen) return null;

  const tracks: { key: TrackType; name: string; desc: string; color: string }[] = [
    { key: 'drums', name: '2-Step Percussion Stem', desc: 'Syncopated kick, snare, ghost shuffle hats', color: 'text-emerald-400' },
    { key: 'bass', name: 'Sub Bassline Stem', desc: '808 sub frequencies and Reese glide notes', color: 'text-teal-400' },
    { key: 'chords', name: 'Atmospheric Pads Stem', desc: 'Minor 9th ethereal lush spatial chords', color: 'text-cyan-400' },
    { key: 'fx', name: 'Glitch / Stutter FX Stem', desc: 'Granular white noise and tape crackle', color: 'text-indigo-400' },
    { key: 'vocals', name: 'Vocal Chop Chants Stem', desc: 'Formant AI duo soprano and bass chants', color: 'text-rose-400' },
  ];

  const handleDownloadWavStem = async (track: TrackType) => {
    try {
      setRenderingTrack(track);
      const safeProgression: ChordProgressionId = (chordProgressionId || 'd_minor_ethereal') as ChordProgressionId;
      const safeDrumKit: DrumKitId = (drumKitId || 'garage_vinyl') as DrumKitId;
      const wavBlob = await renderTrackToWav(track, patterns, tempo, swing, safeProgression, safeDrumKit, 2);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ghostform-${track}-stem-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to render WAV stem:', err);
    } finally {
      setRenderingTrack(null);
    }
  };

  const handleExportMidi = () => {
    const safeProgression: ChordProgressionId = (chordProgressionId || 'd_minor_ethereal') as ChordProgressionId;
    const { blob, filename } = generateMidiFile(
      patterns,
      tempo,
      `Ghostform - Future Garage Session (Prod. by ${producerName})`,
      safeProgression
    );

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
      project: `Ghostform Future Garage Synth Studio`,
      artist: 'Ghostform (Gemini 3 Flash × DeepSeek-R1)',
      producer: producerName,
      tempo,
      swing,
      chordProgression: chordProgressionId,
      drumKit: drumKitId,
      patterns,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(fullProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghostform-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadedAll(true);
    setTimeout(() => setDownloadedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-cyan-400">
                Stem Isolation, Lossless .WAV & MIDI Package
              </h3>
              <p className="text-[11px] text-slate-400">
                Render offline 16-bit .WAV audio stems, Type-1 MIDI files, and pattern JSON for your DAW.
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
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
          {tracks.map((track) => (
            <div
              key={track.key}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 flex-wrap"
            >
              <div>
                <span className={`text-xs font-mono font-bold ${track.color}`}>
                  {track.name}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">{track.desc}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={renderingTrack !== null}
                  onClick={() => handleDownloadWavStem(track.key)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-mono transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {renderingTrack === track.key ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Rendering .WAV...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Render .WAV</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onExportStem(track.key)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-mono transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Stem .JSON</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Full Project & MIDI Export */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            <span>Arrangement: 32 Steps (2 Bars Offline Render)</span>
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

