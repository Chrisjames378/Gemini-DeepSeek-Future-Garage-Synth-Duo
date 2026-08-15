import * as Tone from 'tone';
import { Patterns, TrackType } from './types';
import { CHORD_PROGRESSIONS, ChordProgressionId, DRUM_KITS, DrumKitId } from './soundOptions';

export class FutureGarageAudioEngine {
  private initialized: boolean = false;
  public isPlaying: boolean = false;
  private currentStep: number = 0;
  private currentBar: number = 0;
  private currentChordIdx: number = 0;

  // Sound Options State
  private currentProgressionId: ChordProgressionId = 'd_minor_ethereal';
  private currentDrumKitId: DrumKitId = 'garage_vinyl';

  // Nodes & FX
  private masterGain!: Tone.Gain;
  private masterLimiter!: Tone.Limiter;
  private reverb!: Tone.Reverb;
  private delay!: Tone.PingPongDelay;
  private masterFilter!: Tone.Filter;
  public analyser!: Tone.Analyser;

  // Channel Gains
  private gains: Record<TrackType, Tone.Gain> = {} as any;

  // Synths
  private kickSynth!: Tone.MembraneSynth;
  private snareSynth!: Tone.NoiseSynth;
  private hatSynth!: Tone.MetalSynth;
  private bassSynth!: Tone.MonoSynth;
  private polySynth!: Tone.PolySynth;
  private fxNoiseSynth!: Tone.NoiseSynth;
  private vocalSynth!: Tone.Synth;
  private vinylNoise!: Tone.Noise;
  private vinylFilter!: Tone.Filter;
  private vinylGain!: Tone.Gain;

  // Dub Siren & Foley
  private dubSirenOsc!: Tone.Oscillator;
  private dubSirenLfo!: Tone.LFO;
  private dubSirenGain!: Tone.Gain;
  private dubSirenDelay!: Tone.FeedbackDelay;
  private rainNoise!: Tone.Noise;
  private rainFilter!: Tone.Filter;
  private rainGain!: Tone.Gain;
  private isTapeStopped: boolean = false;
  private originalTempo: number = 132;

  // Callbacks
  private onStepCallback?: (step: number, bar: number, chordIdx: number) => void;
  private onBarCallback?: (bar: number) => void;

  constructor() {
    // Lazy setup on user gesture
  }

  public async init() {
    if (this.initialized) return;

    await Tone.start();

    // Master chain
    this.masterLimiter = new Tone.Limiter(-0.5).toDestination();
    this.masterGain = new Tone.Gain(0.9).connect(this.masterLimiter);

    this.analyser = new Tone.Analyser('fft', 64);
    this.masterGain.connect(this.analyser);

    // Spatial FX
    this.reverb = new Tone.Reverb({
      decay: 4.5,
      preDelay: 0.04,
      wet: 0.65
    }).connect(this.masterGain);
    await this.reverb.generate();

    this.delay = new Tone.PingPongDelay({
      delayTime: '8n.',
      feedback: 0.35,
      wet: 0.3
    }).connect(this.reverb);

    this.masterFilter = new Tone.Filter({
      frequency: 4500,
      type: 'lowpass',
      rolloff: -24
    }).connect(this.delay);

    // Track Gain Nodes
    const tracks: TrackType[] = ['drums', 'bass', 'chords', 'fx', 'vocals'];
    tracks.forEach((track) => {
      this.gains[track] = new Tone.Gain(0.85);
    });

    // 1. Drums
    this.kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 5,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.35, sustain: 0.01, release: 0.4 }
    }).connect(this.gains.drums);

    this.snareSynth = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.005, decay: 0.18, sustain: 0, release: 0.1 }
    }).connect(this.gains.drums);

    this.hatSynth = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.08, release: 0.05 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).connect(this.gains.drums);
    this.hatSynth.volume.value = -12;

    this.gains.drums.connect(this.masterFilter);

    // 2. Sub Bass
    this.bassSynth = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: { Q: 3, type: 'lowpass', rolloff: -24 },
      envelope: { attack: 0.04, decay: 0.3, sustain: 0.4, release: 0.6 },
      filterEnvelope: { attack: 0.02, decay: 0.4, sustain: 0.2, release: 0.5, baseFrequency: 80, octaves: 2.5 }
    }).connect(this.gains.bass);
    this.bassSynth.volume.value = -2;
    this.gains.bass.connect(this.masterFilter);

    // 3. Atmospheric Chord Pads
    this.polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.35, decay: 1.5, sustain: 0.65, release: 2.2 }
    }).connect(this.gains.chords);
    this.polySynth.volume.value = -4;
    this.gains.chords.connect(this.reverb);

    // 4. Glitch / Texture FX
    this.fxNoiseSynth = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.05 }
    }).connect(this.gains.fx);
    this.fxNoiseSynth.volume.value = -8;
    this.gains.fx.connect(this.delay);

    // Vinyl Crackle texture
    this.vinylFilter = new Tone.Filter(2000, 'bandpass');
    this.vinylGain = new Tone.Gain(0.04).connect(this.masterGain);
    this.vinylNoise = new Tone.Noise('pink').connect(this.vinylFilter);
    this.vinylFilter.connect(this.vinylGain);

    // 5. Vocal Synth (Chants & Chops)
    this.vocalSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      portamento: 0.08,
      envelope: { attack: 0.03, decay: 0.25, sustain: 0.2, release: 0.45 }
    }).connect(this.gains.vocals);
    this.vocalSynth.volume.value = -3;
    this.gains.vocals.connect(this.delay);

    // 6. Rain Foley & Atmospheric Night Weather Layer
    this.rainFilter = new Tone.Filter({
      frequency: 1400,
      type: 'lowpass',
      rolloff: -12
    });
    this.rainGain = new Tone.Gain(0.08).connect(this.reverb);
    this.rainNoise = new Tone.Noise('brown').connect(this.rainFilter);
    this.rainFilter.connect(this.rainGain);

    // 7. Dub Siren Synth
    this.dubSirenDelay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.6,
      wet: 0.7
    }).connect(this.reverb);

    this.dubSirenGain = new Tone.Gain(0).connect(this.dubSirenDelay);
    this.dubSirenLfo = new Tone.LFO({
      frequency: 3.5,
      min: 440,
      max: 1200,
      type: 'sawtooth'
    });
    this.dubSirenOsc = new Tone.Oscillator(600, 'sine').connect(this.dubSirenGain);
    this.dubSirenLfo.connect(this.dubSirenOsc.frequency);
    this.dubSirenOsc.start();
    this.dubSirenLfo.start();

    Tone.Transport.bpm.value = 132;
    Tone.Transport.swing = 0.25;
    Tone.Transport.swingSubdivision = '16n';

    this.initialized = true;
  }

  public setChordProgression(id: ChordProgressionId) {
    this.currentProgressionId = id;
    this.currentChordIdx = 0;
  }

  public getChordProgression(): ChordProgressionId {
    return this.currentProgressionId;
  }

  public setDrumKit(kitId: DrumKitId) {
    this.currentDrumKitId = kitId;
    const kit = DRUM_KITS.find((k) => k.id === kitId) || DRUM_KITS[0];
    if (this.initialized) {
      this.kickSynth.octaves = kit.kickOctaves;
      this.kickSynth.envelope.decay = kit.kickDecay;
      this.snareSynth.noise.type = kit.snareNoiseType;
      this.snareSynth.envelope.decay = kit.snareDecay;
    }
  }

  public getDrumKit(): DrumKitId {
    return this.currentDrumKitId;
  }

  public setCallbacks(
    onStep: (step: number, bar: number, chordIdx: number) => void,
    onBar: (bar: number) => void
  ) {
    this.onStepCallback = onStep;
    this.onBarCallback = onBar;
  }

  public start(patterns: Patterns, mutes: Record<TrackType, boolean>, solos: Record<TrackType, boolean>) {
    if (!this.initialized) return;

    this.isPlaying = true;
    try {
      this.vinylNoise.start();
      this.rainNoise.start();
    } catch {}

    Tone.Transport.cancel();
    this.currentStep = 0;
    this.currentBar = 1;
    this.currentChordIdx = 0;

    Tone.Transport.scheduleRepeat((time) => {
      this.tick(time, patterns, mutes, solos);
    }, '16n');

    Tone.Transport.start();
  }

  public stop() {
    this.isPlaying = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
    try {
      this.vinylNoise.stop();
      this.rainNoise.stop();
    } catch {}
    this.currentStep = 0;
  }

  private isTrackAudible(track: TrackType, mutes: Record<TrackType, boolean>, solos: Record<TrackType, boolean>): boolean {
    const anySolo = Object.values(solos).some(Boolean);
    if (anySolo) {
      return solos[track] === true;
    }
    return !mutes[track];
  }

  private tick(
    time: number,
    patterns: Patterns,
    mutes: Record<TrackType, boolean>,
    solos: Record<TrackType, boolean>
  ) {
    const step = this.currentStep;
    const stepCount = 32;
    const progression = CHORD_PROGRESSIONS.find((p) => p.id === this.currentProgressionId) || CHORD_PROGRESSIONS[0];
    const kit = DRUM_KITS.find((k) => k.id === this.currentDrumKitId) || DRUM_KITS[0];

    // 1. Drums Step
    if (this.isTrackAudible('drums', mutes, solos) && patterns.drums[step] === 1) {
      if (step % 8 === 0 || step === 14 || step === 22) {
        // Kick punch
        this.kickSynth.triggerAttackRelease(kit.kickPitch, '8n', time, 0.9);
      } else if (step % 8 === 4 || step === 12 || step === 28) {
        // Snare / Rimshot
        this.snareSynth.triggerAttackRelease('16n', time, 0.75);
      } else {
        // Ghost Hat Shuffle
        this.hatSynth.triggerAttackRelease('32n', time, 0.45);
      }
    }

    // 2. Sub Bass Step
    if (this.isTrackAudible('bass', mutes, solos) && patterns.bass[step] === 1) {
      const noteIdx = (Math.floor(step / 4) + this.currentChordIdx) % progression.bassNotes.length;
      const note = progression.bassNotes[noteIdx];
      this.bassSynth.triggerAttackRelease(note, '8n', time, 0.85);
    }

    // 3. Atmospheric Chord Pads
    if (this.isTrackAudible('chords', mutes, solos) && patterns.chords[step] === 1) {
      const voicing = progression.chords[this.currentChordIdx % progression.chords.length].notes;
      this.polySynth.triggerAttackRelease(voicing, '2n', time, 0.6);
    }

    // 4. Glitch / Stutter FX
    if (this.isTrackAudible('fx', mutes, solos) && patterns.fx[step] === 1) {
      this.fxNoiseSynth.triggerAttackRelease('32n', time, 0.5);
    }

    // 5. Vocal Chops
    if (this.isTrackAudible('vocals', mutes, solos) && patterns.vocals[step] === 1) {
      const randomNote = progression.vocalNotes[(step + this.currentChordIdx * 2) % progression.vocalNotes.length];
      this.vocalSynth.triggerAttackRelease(randomNote, '16n', time, 0.7);
    }

    // Notify UI
    if (this.onStepCallback) {
      this.onStepCallback(step, this.currentBar, this.currentChordIdx);
    }

    // Progress step
    this.currentStep = (this.currentStep + 1) % stepCount;
    if (this.currentStep === 0) {
      this.currentBar++;
      this.currentChordIdx = (this.currentChordIdx + 1) % progression.chords.length;
      if (this.onBarCallback) {
        this.onBarCallback(this.currentBar);
      }
    }
  }

  public singVocalAnthem() {
    if (!this.initialized) return;
    const now = Tone.now();
    const progression = CHORD_PROGRESSIONS.find((p) => p.id === this.currentProgressionId) || CHORD_PROGRESSIONS[0];
    progression.vocalNotes.forEach((note, idx) => {
      this.vocalSynth.triggerAttackRelease(note, '8n', now + idx * 0.18, 0.75);
    });
  }

  public testVoice(model: 'Gemini' | 'DeepSeek') {
    if (!this.initialized) return;
    if (model === 'Gemini') {
      this.vocalSynth.triggerAttackRelease('E5', '4n', undefined, 0.8);
    } else {
      this.vocalSynth.triggerAttackRelease('D3', '4n', undefined, 0.85);
    }
  }

  public setTempo(bpm: number) {
    if (Tone.Transport) {
      Tone.Transport.bpm.rampTo(bpm, 0.2);
    }
  }

  public setSwing(swingVal: number) {
    if (Tone.Transport) {
      Tone.Transport.swing = swingVal;
    }
  }

  public setReverbWet(wet: number) {
    if (this.reverb) {
      this.reverb.wet.rampTo(wet, 0.1);
    }
  }

  public setFilterCutoff(freq: number) {
    if (this.masterFilter) {
      this.masterFilter.frequency.rampTo(freq, 0.1);
    }
  }

  public setTrackVolume(track: TrackType, volumeVal: number) {
    if (this.gains[track]) {
      this.gains[track].gain.rampTo(volumeVal, 0.05);
    }
  }

  public triggerDubSiren() {
    if (!this.initialized) return;
    const now = Tone.now();
    this.dubSirenGain.gain.cancelScheduledValues(now);
    this.dubSirenGain.gain.setValueAtTime(0, now);
    this.dubSirenGain.gain.linearRampToValueAtTime(0.28, now + 0.1);
    this.dubSirenGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
  }

  public toggleTapeStop(duration: number = 1.2): boolean {
    if (!this.initialized || !this.isPlaying) return false;
    if (!this.isTapeStopped) {
      this.isTapeStopped = true;
      this.originalTempo = Tone.Transport.bpm.value;
      // Ramp tempo down to mimic tape motor slowing down
      Tone.Transport.bpm.rampTo(20, duration);
      // Also drag master filter down
      this.masterFilter.frequency.rampTo(200, duration);
      
      // Auto recover after duration + 0.3s
      setTimeout(() => {
        if (this.isPlaying) {
          Tone.Transport.bpm.rampTo(this.originalTempo, 0.4);
          this.masterFilter.frequency.rampTo(4500, 0.4);
        }
        this.isTapeStopped = false;
      }, (duration + 0.4) * 1000);
      return true;
    }
    return false;
  }

  public setRainVolume(val: number) {
    if (this.rainGain) {
      this.rainGain.gain.rampTo(val * 0.18, 0.1);
    }
  }

  public setVinylVolume(val: number) {
    if (this.vinylGain) {
      this.vinylGain.gain.rampTo(val * 0.12, 0.1);
    }
  }

  public getAnalyserData(): Float32Array {
    if (!this.analyser) return new Float32Array(32);
    return this.analyser.getValue() as Float32Array;
  }
}

export const audioEngine = new FutureGarageAudioEngine();

