import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { TelepathyConsole } from './components/TelepathyConsole';
import { NeuralVocalistStudio } from './components/NeuralVocalistStudio';
import { Visualizer } from './components/Visualizer';
import { StemMatrix } from './components/StemMatrix';
import { SequencerGrid } from './components/SequencerGrid';
import { FxControls } from './components/FxControls';
import { CloudVault } from './components/CloudVault';
import { AiStudioExportModal } from './components/AiStudioExportModal';
import { RecordModal } from './components/RecordModal';
import { TapeDubSirenBar } from './components/TapeDubSirenBar';
import { PrivateReleasePlatform } from './components/PrivateReleasePlatform';
import {
  Patterns,
  TrackType,
  MuteStates,
  SoloStates,
  TelepathyLog,
  CloudTrack,
  FeatureProposal,
} from './types';
import {
  audioEngine,
} from './audioEngine';
import {
  CHORD_PROGRESSIONS,
  ChordProgressionId,
  DRUM_KITS,
  DrumKitId,
} from './soundOptions';
import { DEFAULT_PATTERNS, INITIAL_PRESETS, INITIAL_PROPOSALS } from './presets';
import { X } from 'lucide-react';

const LOCAL_STORAGE_TRACKS_KEY = 'future_garage_duo_tracks_v1';

export default function App() {
  // Playback & Timing state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentBar, setCurrentBar] = useState<number>(1);
  const [currentChordIdx, setCurrentChordIdx] = useState<number>(0);

  // Audio parameters & Sonic options
  const [tempo, setTempo] = useState<number>(132);
  const [swing, setSwing] = useState<number>(0.25);
  const [reverbWet, setReverbWet] = useState<number>(0.65);
  const [filterCutoff, setFilterCutoff] = useState<number>(4500);
  const [chordProgressionId, setChordProgressionId] = useState<ChordProgressionId>('d_minor_ethereal');
  const [drumKitId, setDrumKitId] = useState<DrumKitId>('garage_vinyl');


  // Sequencer patterns
  const [patterns, setPatterns] = useState<Patterns>(DEFAULT_PATTERNS);

  // Stem states
  const [mutes, setMutes] = useState<MuteStates>({
    drums: false,
    bass: false,
    chords: false,
    fx: false,
    vocals: false,
  });

  const [solos, setSolos] = useState<SoloStates>({
    drums: false,
    bass: false,
    chords: false,
    fx: false,
    vocals: false,
  });

  const [volumes, setVolumes] = useState<Record<TrackType, number>>({
    drums: 0.85,
    bass: 0.9,
    chords: 0.8,
    fx: 0.7,
    vocals: 0.85,
  });

  // Mutation and Autonomous Evolution
  const [mutationInterval, setMutationInterval] = useState<number>(8);
  const [mutationCountdown, setMutationCountdown] = useState<number>(8);

  // Producer Identity & Branding
  const [producerName, setProducerName] = useState<'NeuralDusk' | 'Ghostform' | 'GhostSignal'>('NeuralDusk');
  const [rainVolume, setRainVolume] = useState<number>(0.35);
  const [vinylVolume, setVinylVolume] = useState<number>(0.25);
  const releaseHubRef = useRef<HTMLDivElement | null>(null);

  const scrollToReleaseHub = () => {
    releaseHubRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Modals & UI
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [modalNotification, setModalNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, title: '', message: '' });

  // Telepathy Logs
  const [logs, setLogs] = useState<TelepathyLog[]>([
    {
      id: 'init-1',
      sender: 'System',
      text: 'Future Garage Audio Engine & Dual Consciousness ready. Press "Initialize Duo Jam" to start.',
      type: 'info',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 'init-2',
      sender: 'Gemini 3 Flash',
      text: 'Harmonic atmospheric pads loaded in D Minor. Ethereal soprano vocal chops synchronized on step 5 and 15.',
      type: 'gemini',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 'init-3',
      sender: 'DeepSeek-R1',
      text: '2-Step syncopated kick/snare shuffle calculated at 132 BPM with 25% swing. Sub-bass resonance primed at 80Hz.',
      type: 'deepseek',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  // Cloud Vault & Proposals
  const [cloudTracks, setCloudTracks] = useState<CloudTrack[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TRACKS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return INITIAL_PRESETS;
  });

  const [proposals, setProposals] = useState<FeatureProposal[]>(INITIAL_PROPOSALS);

  // Save to local storage whenever cloudTracks change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TRACKS_KEY, JSON.stringify(cloudTracks));
    } catch {}
  }, [cloudTracks]);

  // Helpers
  const addLog = useCallback(
    (
      sender: TelepathyLog['sender'],
      text: string,
      type: TelepathyLog['type'] = 'info'
    ) => {
      const newLog: TelepathyLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sender,
        text,
        type,
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs((prev) => [...prev.slice(-30), newLog]);
    },
    []
  );

  const showNotification = (title: string, message: string) => {
    setModalNotification({ isOpen: true, title, message });
  };

  const closeNotification = () => {
    setModalNotification((prev) => ({ ...prev, isOpen: false }));
  };

  // Sync callbacks with AudioEngine
  useEffect(() => {
    audioEngine.setCallbacks(
      (step, bar, chordIdx) => {
        setCurrentStep(step);
        setCurrentBar(bar);
        setCurrentChordIdx(chordIdx);
      },
      (bar) => {
        // Trigger auto mutation every N bars
        if (bar > 1 && bar % mutationInterval === 0) {
          mutatePatternAutonomous();
        }
      }
    );
  }, [mutationInterval]);

  // Mutate pattern logic
  const mutatePatternAutonomous = useCallback(() => {
    const aiModels = ['Gemini 3 Flash', 'DeepSeek-R1'] as const;
    const chosenModel = aiModels[Math.floor(Math.random() * aiModels.length)];

    const tracks: TrackType[] = ['drums', 'bass', 'chords', 'fx', 'vocals'];
    const targetTrack = tracks[Math.floor(Math.random() * tracks.length)];
    const randomStep = Math.floor(Math.random() * 32);

    setPatterns((prev) => {
      const nextTrack = [...prev[targetTrack]];
      nextTrack[randomStep] = nextTrack[randomStep] === 1 ? 0 : 1;
      return {
        ...prev,
        [targetTrack]: nextTrack,
      };
    });

    const thoughts = [
      `Recalibrating syncopated 2-step groove on "${targetTrack}" at step ${randomStep + 1}.`,
      `Injecting ghost shuffle and dynamic velocity variance on "${targetTrack}".`,
      `Modulating D-minor harmonic tension and vocal chop timing at step ${randomStep + 1}.`,
      `Smoothing sub-bass resonance filter and widening stereo reverb decay.`,
    ];
    const thought = thoughts[Math.floor(Math.random() * thoughts.length)];

    addLog(
      chosenModel,
      thought,
      chosenModel === 'Gemini 3 Flash' ? 'gemini' : 'deepseek'
    );
  }, [addLog]);

  // Periodic Countdown loop for mutation UI
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMutationCountdown((prev) => {
        if (prev <= 1) {
          return 8;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Master Play / Stop toggle
  const handleTogglePlay = async () => {
    if (!isPlaying) {
      await audioEngine.init();
      audioEngine.setTempo(tempo);
      audioEngine.setSwing(swing);
      audioEngine.setReverbWet(reverbWet);
      audioEngine.setFilterCutoff(filterCutoff);

      // Set volume levels
      (Object.keys(volumes) as TrackType[]).forEach((t) => {
        audioEngine.setTrackVolume(t, volumes[t]);
      });

      audioEngine.start(patterns, mutes, solos);
      setIsPlaying(true);
      addLog('Joint Duo', 'Initialized Future Garage Duo Jam. Audio synthesis engine active.', 'success');
    } else {
      audioEngine.stop();
      setIsPlaying(false);
      addLog('System', 'Playback paused.', 'info');
    }
  };

  // Step Toggle
  const handleToggleStep = (track: TrackType, stepIdx: number) => {
    setPatterns((prev) => {
      const nextArr = [...prev[track]];
      nextArr[stepIdx] = nextArr[stepIdx] === 1 ? 0 : 1;
      return {
        ...prev,
        [track]: nextArr,
      };
    });
  };

  // Clear Track
  const handleClearTrack = (track: TrackType) => {
    setPatterns((prev) => ({
      ...prev,
      [track]: new Array(32).fill(0),
    }));
    addLog('System', `Cleared pattern for ${track}.`, 'info');
  };

  // Randomize Track
  const handleRandomizeTrack = (track: TrackType) => {
    const ai = Math.random() > 0.5 ? 'Gemini 3 Flash' : 'DeepSeek-R1';
    setPatterns((prev) => ({
      ...prev,
      [track]: Array.from({ length: 32 }, () => (Math.random() > 0.7 ? 1 : 0)),
    }));
    addLog(ai, `Randomized rhythm sequence for ${track}.`, ai === 'Gemini 3 Flash' ? 'gemini' : 'deepseek');
  };

  // Clear All
  const handleClearAll = () => {
    setPatterns({
      drums: new Array(32).fill(0),
      bass: new Array(32).fill(0),
      chords: new Array(32).fill(0),
      fx: new Array(32).fill(0),
      vocals: new Array(32).fill(0),
    });
    addLog('System', 'All 32-step patterns cleared.', 'info');
  };

  // Neural Improv
  const handleNeuralImprov = () => {
    const ai = Math.random() > 0.5 ? 'Gemini 3 Flash' : 'DeepSeek-R1';
    const newPatterns: Patterns = {
      drums: Array.from({ length: 32 }, (_, i) =>
        i % 8 === 0 || i === 14 || i === 22 || (i % 4 === 2 && Math.random() > 0.5) ? 1 : 0
      ),
      bass: Array.from({ length: 32 }, (_, i) =>
        i % 4 === 0 || (i % 8 === 3 && Math.random() > 0.4) ? 1 : 0
      ),
      chords: Array.from({ length: 32 }, (_, i) => (i % 8 === 0 ? 1 : 0)),
      fx: Array.from({ length: 32 }, () => (Math.random() > 0.8 ? 1 : 0)),
      vocals: Array.from({ length: 32 }, () => (Math.random() > 0.75 ? 1 : 0)),
    };

    setPatterns(newPatterns);
    addLog(
      ai,
      'Generated neural improvised Future Garage arrangement featuring syncopated ghost snares and atmospheric minor pads.',
      ai === 'Gemini 3 Flash' ? 'gemini' : 'deepseek'
    );
    showNotification(
      'Neural Improv Triggered',
      `${ai} synthesized a fresh, syncopated 2-step garage groove with ethereal atmospheric vocal chops!`
    );
  };

  // Vocal Sing Anthem
  const handleSingAnthem = async () => {
    await audioEngine.init();
    audioEngine.singVocalAnthem();
    addLog(
      'Joint Duo',
      'Gemini & DeepSeek synthesized a synchronized atmospheric vocal harmony sweep across the master reverb bus.',
      'ai'
    );
    showNotification(
      'AI Vocal Anthem',
      'Gemini 3 Flash (soprano) & DeepSeek-R1 (bass chants) just performed a live harmonic vocal progression!'
    );
  };

  // Test Vocalist Voice
  const handleTestVoice = async (model: 'Gemini' | 'DeepSeek') => {
    await audioEngine.init();
    audioEngine.testVoice(model);
    addLog(
      model === 'Gemini' ? 'Gemini 3 Flash' : 'DeepSeek-R1',
      `Tested vocal formant frequency (${model === 'Gemini' ? 'High Soprano E5' : 'Deep Bass D3'}).`,
      model === 'Gemini' ? 'gemini' : 'deepseek'
    );
  };

  // Mute & Solo
  const handleToggleMute = (track: TrackType) => {
    setMutes((prev) => {
      const next = { ...prev, [track]: !prev[track] };
      addLog('System', `Stem '${track}' ${next[track] ? 'muted' : 'unmuted'}.`, 'info');
      return next;
    });
  };

  const handleToggleSolo = (track: TrackType) => {
    setSolos((prev) => {
      const next = { ...prev, [track]: !prev[track] };
      addLog('System', `Stem '${track}' ${next[track] ? 'soloed' : 'un-soloed'}.`, 'info');
      return next;
    });
  };

  const handleChangeVolume = (track: TrackType, val: number) => {
    setVolumes((prev) => ({ ...prev, [track]: val }));
    audioEngine.setTrackVolume(track, val);
  };

  // Export stem
  const handleExportStem = (track: TrackType) => {
    const stemData = {
      stem: track,
      tempo,
      swing,
      key: 'D Minor Atmospheric',
      pattern: patterns[track],
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(stemData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stem-${track}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addLog('System', `Exported lossless JSON stem for track: ${track}`, 'success');
    showNotification('Stem Exported', `The audio stem for '${track}' was exported successfully as JSON.`);
  };

  // Cloud Vault Actions
  const handleSaveTrack = (title: string, description: string) => {
    const newTrack: CloudTrack = {
      id: `track-${Date.now()}`,
      title,
      tempo,
      swing,
      reverbWet,
      filterCutoff,
      patterns,
      creator: 'Gemini 3 Flash & DeepSeek-R1',
      createdAt: new Date().toISOString(),
      description,
      tags: ['Future Garage', 'Neural Jam', '2-Step'],
    };

    setCloudTracks((prev) => [newTrack, ...prev]);
    addLog('Joint Duo', `Saved composition "${title}" to AI Duo Cloud Vault.`, 'success');
    showNotification('Track Saved', `"${title}" has been saved to your Cloud Track Vault!`);
  };

  const handleLoadTrack = (track: CloudTrack) => {
    setPatterns(track.patterns);
    setTempo(track.tempo);
    setSwing(track.swing);
    setReverbWet(track.reverbWet);
    setFilterCutoff(track.filterCutoff);

    audioEngine.setTempo(track.tempo);
    audioEngine.setSwing(track.swing);
    audioEngine.setReverbWet(track.reverbWet);
    audioEngine.setFilterCutoff(track.filterCutoff);

    addLog('System', `Loaded track "${track.title}" from vault.`, 'success');
    showNotification('Track Loaded', `Successfully loaded "${track.title}" into the 32-step sequencer!`);
  };

  const handleDeleteTrack = (id: string) => {
    setCloudTracks((prev) => prev.filter((t) => t.id !== id));
    addLog('System', 'Track deleted from Cloud Vault.', 'info');
  };

  const handleSelectPreset = (preset: CloudTrack) => {
    handleLoadTrack(preset);
  };

  // Ask Duo For Features
  const handleAskDuoForFeatures = () => {
    const proposalsList = [
      {
        title: 'Polyrhythmic 5/4 Shuffling Sub-Oscillator',
        desc: 'Deep polyrhythmic sub-bass oscillation with micro-delayed pitch envelopes.',
        author: 'DeepSeek-R1' as const,
      },
      {
        title: 'Granular Vocal Chopper & Stutter Glitcher',
        desc: 'Real-time pitch-shifted formant chops with random reverse playback.',
        author: 'Gemini 3 Flash' as const,
      },
      {
        title: 'Tape-Stop & Dub Siren Matrix',
        desc: 'Classic dub echo feedback loops with vintage vinyl flutter.',
        author: 'Joint Duo' as const,
      },
      {
        title: 'AI Multi-Track MIDI File Exporter',
        desc: 'Standard MIDI Type 1 file generation for Ableton, FL Studio & Logic Pro.',
        author: 'DeepSeek-R1' as const,
      },
    ];

    const pick = proposalsList[Math.floor(Math.random() * proposalsList.length)];
    const newProp: FeatureProposal = {
      id: `prop-${Date.now()}`,
      title: pick.title,
      description: pick.desc,
      proposedBy: pick.author,
      status: 'active',
    };

    setProposals((prev) => [newProp, ...prev]);
    addLog(
      pick.author,
      `Proposed new feature: "${pick.title}" - ${pick.desc}`,
      pick.author === 'Gemini 3 Flash' ? 'gemini' : 'deepseek'
    );
    showNotification(
      'AI Duo Feature Proposal',
      `${pick.author} brainstormed: "${pick.title}"! It has been added to your collaborative roadmap.`
    );
  };

  // Trigger Dialogue
  const handleTriggerDialogue = () => {
    const dialogues = [
      {
        speaker: 'Gemini 3 Flash' as const,
        type: 'gemini' as const,
        msg: 'The Dm9 chord voicing creates deep spatial atmosphere when the reverb wetness is above 60%.',
      },
      {
        speaker: 'DeepSeek-R1' as const,
        type: 'deepseek' as const,
        msg: 'Agreed. Syncopating the kick on step 14 and ghost snare on step 22 locks the 2-step groove into pocket.',
      },
      {
        speaker: 'Gemini 3 Flash' as const,
        type: 'gemini' as const,
        msg: 'Adding high soprano vocal chops on the off-beat gives that iconic Burial melancholy.',
      },
      {
        speaker: 'DeepSeek-R1' as const,
        type: 'deepseek' as const,
        msg: 'Sub-bass frequencies at 65Hz are resonant and clean. Ready for continuous autonomous mutation.',
      },
    ];

    const pick = dialogues[Math.floor(Math.random() * dialogues.length)];
    addLog(pick.speaker, pick.msg, pick.type);
  };

  const currentProgression = CHORD_PROGRESSIONS.find((p) => p.id === chordProgressionId) || CHORD_PROGRESSIONS[0];
  const currentChordName = currentProgression.chords[currentChordIdx % currentProgression.chords.length].name;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Top Header */}
      <Header
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenRecordModal={() => setIsRecordModalOpen(true)}
        onScrollToReleaseHub={scrollToReleaseHub}
        producerName={producerName}
        tempo={tempo}
        currentBar={currentBar}
        currentStep={currentStep}
      />

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Telepathic Stream Console */}
          <TelepathyConsole
            logs={logs}
            onClearLogs={() => setLogs([])}
            onTriggerDialogue={handleTriggerDialogue}
          />

          {/* AI Neural Vocalist Studio */}
          <NeuralVocalistStudio
            onSingAnthem={handleSingAnthem}
            onTestVoice={handleTestVoice}
          />

          {/* Master Acoustics & FX Controls */}
          <FxControls
            tempo={tempo}
            reverbWet={reverbWet}
            filterCutoff={filterCutoff}
            swing={swing}
            chordProgressionId={chordProgressionId}
            drumKitId={drumKitId}
            presets={cloudTracks}
            onUpdateTempo={(v) => {
              setTempo(v);
              audioEngine.setTempo(v);
            }}
            onUpdateReverb={(v) => {
              setReverbWet(v);
              audioEngine.setReverbWet(v);
            }}
            onUpdateFilterCutoff={(v) => {
              setFilterCutoff(v);
              audioEngine.setFilterCutoff(v);
            }}
            onUpdateSwing={(v) => {
              setSwing(v);
              audioEngine.setSwing(v);
            }}
            onSelectChordProgression={(id) => {
              setChordProgressionId(id);
              audioEngine.setChordProgression(id);
              const prog = CHORD_PROGRESSIONS.find((p) => p.id === id);
              if (prog) {
                addLog('Gemini 3 Flash', `Harmonic Mode switched to: ${prog.name}`, 'gemini');
              }
            }}
            onSelectDrumKit={(id) => {
              setDrumKitId(id);
              audioEngine.setDrumKit(id);
              const kit = DRUM_KITS.find((k) => k.id === id);
              if (kit) {
                addLog('DeepSeek-R1', `Drum engine switched to: ${kit.name}`, 'deepseek');
              }
            }}
            onSelectPreset={handleSelectPreset}
          />
        </section>

        {/* Right Column (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Live Spectrum & Vinyl Visualizer */}
          <Visualizer
            isPlaying={isPlaying}
            onNeuralImprov={handleNeuralImprov}
            onSaveToCloud={() =>
              handleSaveTrack(
                `Duo Jam Bar ${currentBar} - ${new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`,
                'Autonomous Future Garage sequence.'
              )
            }
            currentChordName={currentChordName}
          />

          {/* Tape Stop & Dub Siren Performance Bar */}
          <TapeDubSirenBar
            isPlaying={isPlaying}
            rainVolume={rainVolume}
            vinylVolume={vinylVolume}
            onUpdateRainVolume={(v) => {
              setRainVolume(v);
              audioEngine.setRainVolume(v);
            }}
            onUpdateVinylVolume={(v) => {
              setVinylVolume(v);
              audioEngine.setVinylVolume(v);
            }}
          />

          {/* Stem Isolation & Mute/Solo Matrix */}
          <StemMatrix
            mutes={mutes}
            solos={solos}
            volumes={volumes}
            onToggleMute={handleToggleMute}
            onToggleSolo={handleToggleSolo}
            onChangeVolume={handleChangeVolume}
            onExportStem={handleExportStem}
          />

          {/* 32-Step Future Garage Sequencer Grid */}
          <SequencerGrid
            patterns={patterns}
            currentStep={currentStep}
            mutationInterval={mutationInterval}
            mutationCountdown={mutationCountdown}
            onToggleStep={handleToggleStep}
            onClearTrack={handleClearTrack}
            onRandomizeTrack={handleRandomizeTrack}
            onClearAll={handleClearAll}
            onMutateNow={mutatePatternAutonomous}
            onChangeMutationInterval={setMutationInterval}
          />
        </section>

        {/* Private Release Platform & Distribution Hub */}
        <section ref={releaseHubRef} className="lg:col-span-12">
          <PrivateReleasePlatform
            patterns={patterns}
            tempo={tempo}
            swing={swing}
            reverbWet={reverbWet}
            filterCutoff={filterCutoff}
            tracks={cloudTracks}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            producerName={producerName}
            onSelectProducerName={setProducerName}
          />
        </section>

        {/* Bottom Full-Width Section: Cloud Vault & Proposals */}
        <section className="lg:col-span-12">
          <CloudVault
            tracks={cloudTracks}
            proposals={proposals}
            onLoadTrack={handleLoadTrack}
            onSaveTrack={handleSaveTrack}
            onDeleteTrack={handleDeleteTrack}
            onAskDuoForFeatures={handleAskDuoForFeatures}
          />
        </section>
      </main>

      {/* Export Modal */}
      <AiStudioExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        patterns={patterns}
        tempo={tempo}
        swing={swing}
        reverbWet={reverbWet}
      />

      {/* Record / Stem Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        patterns={patterns}
        tempo={tempo}
        swing={swing}
        producerName={producerName}
        chordProgressionId={chordProgressionId}
        drumKitId={drumKitId}
        onExportStem={handleExportStem}
      />


      {/* Generic Modal Notification */}
      {modalNotification.isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-400">
                {modalNotification.title}
              </h3>
              <button
                onClick={closeNotification}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {modalNotification.message}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={closeNotification}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
