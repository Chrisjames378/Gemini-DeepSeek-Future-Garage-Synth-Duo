import React, { useState, useRef, useEffect } from 'react';
import {
  Youtube,
  Radio,
  Disc3,
  Download,
  Share2,
  Copy,
  Check,
  Play,
  Pause,
  Video,
  Sparkles,
  GitBranch,
  Terminal,
  ExternalLink,
  Layers,
  Music2,
  FileCode2,
  ShieldCheck,
  Film,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User as UserIcon,
  Globe,
} from 'lucide-react';
import { Patterns, TrackType, CloudTrack } from '../types';
import { audioEngine } from '../audioEngine';
import { generateMidiFile } from '../midiExporter';
import {
  createGoogleDocFromReadme,
  googleSignIn,
  logout,
  initAuth,
  CreatedGoogleDoc,
} from '../googleDocsService';
import { README_CONTENT } from '../readmeData';
import { User } from 'firebase/auth';

interface PrivateReleasePlatformProps {
  patterns: Patterns;
  tempo: number;
  swing: number;
  reverbWet: number;
  filterCutoff: number;
  tracks: CloudTrack[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  producerName: 'NeuralDusk' | 'Ghostform' | 'GhostSignal';
  onSelectProducerName: (name: 'NeuralDusk' | 'Ghostform' | 'GhostSignal') => void;
}

export const PrivateReleasePlatform: React.FC<PrivateReleasePlatformProps> = ({
  patterns,
  tempo,
  swing,
  reverbWet,
  filterCutoff,
  tracks,
  isPlaying,
  onTogglePlay,
  producerName,
  onSelectProducerName,
}) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'soundcloud' | 'bandcamp' | 'midi' | 'github' | 'docs'>('youtube');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Track metadata state
  const [releaseTitle, setReleaseTitle] = useState('Midnight Echoes in D Minor');
  const [subgenre, setSubgenre] = useState('Atmospheric Future Garage / Burial Wave');
  const [releaseNote, setReleaseNote] = useState(
    'Synthesized live using neural trio consciousness (Gemini 3 Flash, DeepSeek-R1 & GLM-5.2) with 2-step syncopation, tape saturation, and minor 9th pads.'
  );

  // Google Docs Sync state
  const [docsUser, setDocsUser] = useState<User | null>(null);
  const [isDocsAuthLoading, setIsDocsAuthLoading] = useState(false);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [createdDoc, setCreatedDoc] = useState<CreatedGoogleDoc | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = initAuth(
      (user) => setDocsUser(user),
      () => setDocsUser(null)
    );
    return () => unsub();
  }, []);

  const handleDocsSignIn = async () => {
    setIsDocsAuthLoading(true);
    setDocError(null);
    try {
      const res = await googleSignIn();
      if (res?.user) setDocsUser(res.user);
    } catch (e: any) {
      setDocError(e?.message || 'Google Auth Failed');
    } finally {
      setIsDocsAuthLoading(false);
    }
  };

  const handleCreateDocFromRelease = async () => {
    setIsCreatingDoc(true);
    setDocError(null);
    try {
      const doc = await createGoogleDocFromReadme(
        `Ghostform - ${releaseTitle} • Release Liner Notes & Technical Spec`,
        README_CONTENT
      );
      setCreatedDoc(doc);
    } catch (e: any) {
      setDocError(e?.message || 'Failed to create Google Doc');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // YouTube Visualizer Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visualizerTheme, setVisualizerTheme] = useState<'midnight' | 'cyber' | 'amber' | 'rain'>('midnight');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // MIDI Export feedback
  const [midiExported, setMidiExported] = useState(false);

  // Animate YouTube Visualizer Canvas
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const data = audioEngine.getAnalyserData();

      // Clear with background theme
      if (visualizerTheme === 'midnight') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#030712');
        grad.addColorStop(0.5, '#042f2e');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
      } else if (visualizerTheme === 'cyber') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
      } else if (visualizerTheme === 'amber') {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1c1917');
        grad.addColorStop(0.5, '#451a03');
        grad.addColorStop(1, '#0c0a09');
        ctx.fillStyle = grad;
      } else {
        // Rain theme
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#082f49');
        grad.addColorStop(0.5, '#0c4a6e');
        grad.addColorStop(1, '#030712');
        ctx.fillStyle = grad;
      }
      ctx.fillRect(0, 0, width, height);

      // Draw subtle orbital audio rings
      const centerX = width / 2;
      const centerY = height / 2 - 20;
      const avgAmp = data.length > 0
        ? data.slice(0, 20).reduce((acc, v) => acc + Math.abs(v < 0 ? (v + 100) / 100 : v), 0) / 20
        : 0.2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80 + avgAmp * 40, 0, Math.PI * 2);
      ctx.strokeStyle = visualizerTheme === 'amber' ? 'rgba(251, 146, 60, 0.25)' : 'rgba(45, 212, 191, 0.25)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner pulsating neon core
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45 + avgAmp * 25, 0, Math.PI * 2);
      ctx.fillStyle = visualizerTheme === 'amber' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(20, 184, 166, 0.15)';
      ctx.fill();
      ctx.restore();

      // Draw Frequency Spectrum Bars (symmetric mirror)
      const numBars = 48;
      const barWidth = 6;
      const spacing = 4;
      const totalWidth = numBars * (barWidth + spacing);
      const startX = (width - totalWidth) / 2;

      for (let i = 0; i < numBars; i++) {
        const val = data[i % data.length];
        const normalized = Math.min(Math.max((val + 100) / 80, 0.08), 1.2);
        const barHeight = normalized * 110;

        const x = startX + i * (barWidth + spacing);
        const y = height - 90 - barHeight;

        // Gradient for bars
        const barGrad = ctx.createLinearGradient(x, y + barHeight, x, y);
        if (visualizerTheme === 'amber') {
          barGrad.addColorStop(0, '#f59e0b');
          barGrad.addColorStop(1, '#fbbf24');
        } else if (visualizerTheme === 'cyber') {
          barGrad.addColorStop(0, '#6366f1');
          barGrad.addColorStop(1, '#a855f7');
        } else {
          barGrad.addColorStop(0, '#0d9488');
          barGrad.addColorStop(1, '#2dd4bf');
        }

        ctx.fillStyle = barGrad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Mirror reflection
        ctx.fillStyle = visualizerTheme === 'amber' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(45, 212, 191, 0.15)';
        ctx.fillRect(x, height - 85, barWidth, barHeight * 0.25);
      }

      // Draw Producer Brand Watermark & Track Title
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`GHOSTFORM • ${releaseTitle}`, centerX, 45);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText(
        `Artist: Ghostform (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2) • Producer: NeuralDusk • ${tempo} BPM`,
        centerX,
        70
      );
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [visualizerTheme, producerName, releaseTitle, tempo]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadMidi = () => {
    const { blob, filename } = generateMidiFile(patterns, tempo, `Ghostform - ${releaseTitle} (Prod. by NeuralDusk)`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setMidiExported(true);
    setTimeout(() => setMidiExported(false), 3000);
  };

  const startVisualizerRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideoUrl(videoUrl);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);

      // Auto stop after 10 seconds of high-fidelity capture
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecordingVideo(false);
        }
      }, 10000);
    } catch (err) {
      console.error('Error starting video capture:', err);
    }
  };

  const stopVisualizerRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
    }
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-6">
      {/* Producer Persona Identity Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-950/60 relative overflow-hidden shrink-0">
            <Radio className="w-7 h-7 text-slate-950" />
            <div className="absolute inset-0 bg-white/10 opacity-30 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                NeuralDusk Studio • Release Distribution Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Producer Vault
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Featuring Artist: <strong className="text-teal-300">Ghostform</strong> (Autonomous Gemini 3 Flash × DeepSeek-R1) • Instant export for YouTube, SoundCloud, Bandcamp & DAW MIDI.
            </p>
          </div>
        </div>

        {/* Roles Badge & Credits */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-2xl flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-mono font-bold">
            Producer: NeuralDusk
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-mono font-bold">
            Artist: Ghostform
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'youtube'
              ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Youtube className="w-4 h-4 text-rose-400" />
          <span>YouTube Visualizer Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('soundcloud')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'soundcloud'
              ? 'bg-amber-950/80 border border-amber-800 text-amber-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-400" />
          <span>SoundCloud Dispatcher</span>
        </button>

        <button
          onClick={() => setActiveTab('bandcamp')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bandcamp'
              ? 'bg-cyan-950/80 border border-cyan-800 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Disc3 className="w-4 h-4 text-cyan-400" />
          <span>Bandcamp EP Release</span>
        </button>

        <button
          onClick={() => setActiveTab('midi')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'midi'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Music2 className="w-4 h-4 text-emerald-400" />
          <span>DAW Multi-Track MIDI (.mid)</span>
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'github'
              ? 'bg-indigo-950/80 border border-indigo-800 text-indigo-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4 text-indigo-400" />
          <span>GitHub Push & Deploy</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'docs'
              ? 'bg-blue-950/80 border border-blue-800 text-blue-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Google Docs (README)</span>
        </button>
      </div>

      {/* Release Title & Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono">
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">Track Title</label>
          <input
            type="text"
            value={releaseTitle}
            onChange={(e) => setReleaseTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">Subgenre Tag</label>
          <input
            type="text"
            value={subgenre}
            onChange={(e) => setSubgenre(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">DAW / Master Tempo</label>
          <div className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-emerald-400 font-bold flex justify-between items-center">
            <span>{tempo} BPM</span>
            <span className="text-slate-400 font-normal">D Minor Atmospheric</span>
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">Live Studio Production Domain</label>
          <a
            href="https://neuraldusk.ai.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/80 rounded-lg px-2.5 py-1 text-cyan-300 font-bold flex justify-between items-center transition"
          >
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              neuraldusk.ai.studio
            </span>
            <ExternalLink className="w-3 h-3 text-cyan-400 opacity-70" />
          </a>
        </div>
      </div>

      {/* TAB 1: YOUTUBE VISUALIZER STUDIO */}
      {activeTab === 'youtube' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">Aesthetic Visual Theme:</span>
              {(['midnight', 'cyber', 'amber', 'rain'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setVisualizerTheme(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition ${
                    visualizerTheme === t
                      ? 'bg-rose-950 border border-rose-700 text-rose-300 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePlay}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause Audio' : 'Play Live Audio'}</span>
              </button>

              {!isRecordingVideo ? (
                <button
                  onClick={startVisualizerRecording}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-950 active:scale-95"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Capture 10s YouTube Video Clip</span>
                </button>
              ) : (
                <button
                  onClick={stopVisualizerRecording}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 animate-pulse"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Recording Video (Auto 10s)...</span>
                </button>
              )}
            </div>
          </div>

          {/* Canvas Screen */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black aspect-video max-h-[380px] w-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Download Captured Video Output */}
          {recordedVideoUrl && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  YouTube 1080p Visualizer Clip Ready for Download!
                </span>
              </div>
              <a
                href={recordedVideoUrl}
                download={`ghostform-${releaseTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-visualizer.webm`}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .WEBM Video</span>
              </a>
            </div>
          )}

          {/* YouTube Video Description Template */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5" />
                Ready-to-Paste YouTube Video Description & SEO Tags
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    `🎵 Track: Ghostform - ${releaseTitle}\nProduced by: NeuralDusk\nArtist: Ghostform (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2)\nGenre: ${subgenre}\nTempo: ${tempo} BPM • Key: D Minor Atmospheric\nOfficial Studio: https://neuraldusk.ai.studio\n\nEngineered on Google AI Studio with Eve Agent runtime.\nDownload Lossless Stems & MIDI: https://neuraldusk.ai.studio\n\n#Ghostform #NeuralDusk #GLM5 #FutureGarage #Burial #2Step #ElectronicMusic #DeepBass`,
                    'yt-desc'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition flex items-center gap-1 border border-slate-700"
              >
                {copiedKey === 'yt-desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'yt-desc' ? 'Copied Description' : 'Copy Description'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
{`🎵 Track: Ghostform - ${releaseTitle} (Official Audio Visualizer)
Artist: Ghostform (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2)
Produced by: NeuralDusk
Genre: ${subgenre} • ${tempo} BPM • Key: D Minor Atmospheric
Live Studio: https://neuraldusk.ai.studio

Co-Produced with the autonomous neural trio engine (Gemini 3 Flash, DeepSeek-R1 & GLM-5.2).

Tags: #Ghostform #NeuralDusk #GLM5 #FutureGarage #Burial #2Step #NightDrive #Atmospheric #ElectronicMusic`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: SOUNDCLOUD DISPATCHER */}
      {activeTab === 'soundcloud' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  SoundCloud Metadata & Tag Dispatcher
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Optimized for the SoundCloud Underground Bass & Future Garage algorithm.
                </p>
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    `Artist: Ghostform\nTitle: ${releaseTitle}\nProducer: NeuralDusk\nStudio: https://neuraldusk.ai.studio\nGenre: Electronic\nTags: ghostform, neuraldusk, future garage, 2step, burial, atmospheric, deep sub, gemini, deepseek, glm5\nDescription: Produced by NeuralDusk. Performance by Ghostform (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2). Live Studio: https://neuraldusk.ai.studio\n${releaseNote}`,
                    'sc-meta'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                {copiedKey === 'sc-meta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sc-meta' ? 'Copied SoundCloud Data' : 'Copy All SoundCloud Metadata'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px]">Track Artist & Title</span>
                <div className="bg-slate-900 p-2.5 rounded-lg text-slate-200 border border-slate-800 font-bold">
                  Ghostform - {releaseTitle} (Prod. by NeuralDusk)
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px]">Primary Genre & Producer</span>
                <div className="bg-slate-900 p-2.5 rounded-lg text-slate-200 border border-slate-800">
                  Electronic • Future Garage • Prod. NeuralDusk • https://neuraldusk.ai.studio
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <span className="text-slate-400 text-[10px]">Algorithmic Hashtags & Custom Tags</span>
                <div className="bg-slate-900 p-2.5 rounded-lg text-amber-300 border border-slate-800 font-mono">
                  #ghostform #neuraldusk #futuregarage #2step #burial #ambient #atmospheric #gemini #deepseek #glm5 #dusk #nightdrive
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <span className="text-slate-400 text-[10px]">SoundCloud Track Description & Credits</span>
                <textarea
                  rows={3}
                  value={releaseNote}
                  onChange={(e) => setReleaseNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BANDCAMP EP RELEASE */}
      {activeTab === 'bandcamp' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Disc3 className="w-4 h-4" />
                  Bandcamp Digital Album / EP Packaging
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Complete liner notes, credit breakdown, and high-res digital release packaging.
                </p>
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    `ALBUM: Ghostform - The Dusk Archives Vol. 1\nTRACK: ${releaseTitle}\nARTIST: Ghostform (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2)\nPRODUCED BY: NeuralDusk\nSTUDIO DOMAIN: https://neuraldusk.ai.studio\nMASTERED AT: 24-bit Atmospheric Studio\nLINER NOTES: ${releaseNote}\n\nIncludes lossless multi-track stems + MIDI files.`,
                    'bc-pack'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                {copiedKey === 'bc-pack' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bc-pack' ? 'Copied Bandcamp Package' : 'Copy Liner Notes'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-3">
              <div className="flex justify-between items-center text-cyan-300 font-bold border-b border-slate-800 pb-2">
                <span>Album: Ghostform - The Dusk Archives Vol. 1</span>
                <span>Release Type: Digital EP + Stems</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                <strong className="text-slate-200">Liner Notes: </strong>
                Recorded in nocturnal isolation. Produced by <strong className="text-emerald-400">NeuralDusk</strong>. Performed by the autonomous neural trio <strong className="text-purple-400">Ghostform</strong> (Gemini 3 Flash × DeepSeek-R1 × GLM-5.2). Studio: <a href="https://neuraldusk.ai.studio" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">https://neuraldusk.ai.studio</a>. {releaseNote}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <div>Producer: <span className="text-emerald-300 font-bold">NeuralDusk</span></div>
                <div>Artist: <span className="text-purple-300 font-bold">Ghostform</span></div>
                <div>BPM: <span className="text-emerald-400">{tempo}</span></div>
                <div>Key: <span className="text-cyan-400">D Minor</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DAW MULTI-TRACK MIDI (.MID) EXPORT */}
      {activeTab === 'midi' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Type-1 Multi-Track Standard MIDI (.mid) Exporter
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Directly export all 5 tracks (Drums, Bass, Chords, FX, Vocals) into standard MIDI format for Ableton Live, FL Studio, Logic Pro, and Cubase.
                </p>
              </div>

              <button
                id="btn-download-midi"
                onClick={handleDownloadMidi}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-950 active:scale-95"
              >
                {midiExported ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
                <span>{midiExported ? 'MIDI File Generated & Downloaded!' : 'Download Multi-Track .MID File'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="font-bold text-emerald-400">Track 1: Drums</div>
                <div className="text-[10px] text-slate-400 mt-1">Channel 10 (GM Kick, Snare, Ghost Hats)</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="font-bold text-teal-400">Track 2: Bass</div>
                <div className="text-[10px] text-slate-400 mt-1">Channel 2 (Sub Bass Glide D1-F1-A1)</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="font-bold text-cyan-400">Track 3: Pads</div>
                <div className="text-[10px] text-slate-400 mt-1">Channel 3 (Minor 9th Polyphonic Voicings)</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="font-bold text-rose-400">Track 4: Vocals</div>
                <div className="text-[10px] text-slate-400 mt-1">Channel 4 (Soprano & Bass Vocal Chops)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GITHUB PUSH & DEPLOYMENT HUB */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  GitHub Repository Push & Deployment Center
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Commands and automated configuration to push your synth studio to your GitHub account.
                </p>
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    `git init\ngit add .\ngit commit -m "feat: ${producerName} Future Garage Synth Duo with YouTube Visualizer and MIDI export"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/${producerName.toLowerCase()}-future-garage.git\ngit push -u origin main`,
                    'git-cmd'
                  )
                }
                className="px-3.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                {copiedKey === 'git-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'git-cmd' ? 'Copied Git Commands' : 'Copy All Git CLI Commands'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 space-y-3">
              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Run in your local terminal to push to GitHub:</span>
              </div>
              <pre className="text-[11px] text-emerald-400 bg-slate-950 p-3 rounded-lg border border-slate-800/80 overflow-x-auto">
{`# 1. Initialize local repository
git init
git add .
git commit -m "feat: ${producerName} Future Garage Synth Studio"

# 2. Link your remote GitHub repo
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/${producerName.toLowerCase()}-future-garage.git

# 3. Push and deploy
git push -u origin main`}
              </pre>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cloud Ready: Vercel, Netlify, and Cloud Run production build configured.</span>
              </div>
              <span className="text-teal-400 font-bold">100% Standalone Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GOOGLE DOCS SYNC (README & LINER NOTES) */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Google Docs Documentation & README Sync
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Export project README.md, sound design specs, and track liner notes to a new Google Doc in your Google Drive.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {docsUser ? (
                  <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-800/80 px-3 py-1 rounded-xl text-xs text-blue-300 font-mono">
                    <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>{docsUser.displayName || docsUser.email}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleDocsSignIn}
                    disabled={isDocsAuthLoading}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5"
                  >
                    {isDocsAuthLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                    <span>Sign in with Google</span>
                  </button>
                )}

                <button
                  onClick={handleCreateDocFromRelease}
                  disabled={isCreatingDoc}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-950 active:scale-95 disabled:opacity-50"
                >
                  {isCreatingDoc ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  <span>{isCreatingDoc ? 'Creating Google Doc...' : 'Export README to Google Docs'}</span>
                </button>
              </div>
            </div>

            {createdDoc && (
              <div className="p-4 bg-emerald-950/80 rounded-xl border border-emerald-800 flex items-center justify-between flex-wrap gap-3 text-xs font-mono animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Google Doc Created: <strong>{createdDoc.title}</strong></span>
                </div>
                <a
                  href={createdDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Open in Google Docs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {docError && (
              <div className="p-3 bg-rose-950/80 rounded-xl border border-rose-800 flex items-center gap-2 text-xs font-mono text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{docError}</span>
              </div>
            )}

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Live README.md Content Preview:
              </div>
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">
                {README_CONTENT}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
