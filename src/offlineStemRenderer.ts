import * as Tone from 'tone';
import { Patterns, TrackType } from './types';
import { audioBufferToWavBlob } from './wavExporter';
import { CHORD_PROGRESSIONS, ChordProgressionId, DRUM_KITS, DrumKitId } from './soundOptions';

export async function renderTrackToWav(
  track: TrackType,
  patterns: Patterns,
  tempo: number,
  swing: number,
  progressionId: ChordProgressionId = 'd_minor_ethereal',
  kitId: DrumKitId = 'garage_vinyl',
  bars: number = 2
): Promise<Blob> {
  const secondsPerBeat = 60 / tempo;
  const totalSeconds = bars * 4 * secondsPerBeat + 2.0; // 2 bars + 2s reverb tail

  const buffer = await Tone.Offline(async () => {
    const progression = CHORD_PROGRESSIONS.find((p) => p.id === progressionId) || CHORD_PROGRESSIONS[0];
    const kit = DRUM_KITS.find((k) => k.id === kitId) || DRUM_KITS[0];

    const masterReverb = new Tone.Reverb({ decay: 3.5, wet: 0.5 });
    await masterReverb.generate();
    masterReverb.toDestination();

    const masterDelay = new Tone.PingPongDelay({ delayTime: '8n.', feedback: 0.3, wet: 0.25 }).connect(masterReverb);
    const masterFilter = new Tone.Filter(5000, 'lowpass').connect(masterDelay);

    // 1. Drums
    if (track === 'drums') {
      const kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: kit.kickOctaves,
        envelope: { attack: 0.001, decay: kit.kickDecay, sustain: 0.01, release: 0.3 }
      }).connect(masterFilter);

      const snare = new Tone.NoiseSynth({
        noise: { type: kit.snareNoiseType },
        envelope: { attack: 0.005, decay: kit.snareDecay, sustain: 0, release: 0.1 }
      }).connect(masterFilter);

      const hat = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.07, release: 0.05 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000
      }).connect(masterFilter);
      hat.volume.value = -10;

      const stepDuration = secondsPerBeat / 4;
      for (let s = 0; s < 32; s++) {
        if (patterns.drums[s] === 1) {
          const swingOffset = s % 2 === 1 ? swing * 0.04 : 0;
          const time = s * stepDuration + swingOffset;
          if (s % 8 === 0 || s === 14 || s === 22) {
            kick.triggerAttackRelease(kit.kickPitch, '8n', time, 0.9);
          } else if (s % 8 === 4 || s === 12 || s === 28) {
            snare.triggerAttackRelease('16n', time, 0.8);
          } else {
            hat.triggerAttackRelease('32n', time, 0.45);
          }
        }
      }
    }

    // 2. Bass
    if (track === 'bass') {
      const bass = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        filter: { Q: 3, type: 'lowpass', rolloff: -24 },
        envelope: { attack: 0.04, decay: 0.3, sustain: 0.4, release: 0.6 }
      }).connect(masterFilter);
      bass.volume.value = 0;

      const stepDuration = secondsPerBeat / 4;
      for (let s = 0; s < 32; s++) {
        if (patterns.bass[s] === 1) {
          const time = s * stepDuration;
          const chordIdx = Math.floor(s / 8) % progression.chords.length;
          const note = progression.bassNotes[(Math.floor(s / 4) + chordIdx) % progression.bassNotes.length];
          bass.triggerAttackRelease(note, '8n', time, 0.9);
        }
      }
    }

    // 3. Chords / Pads
    if (track === 'chords') {
      const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.3, decay: 1.5, sustain: 0.7, release: 2.0 }
      }).connect(masterReverb);
      pad.volume.value = -3;

      const stepDuration = secondsPerBeat / 4;
      for (let s = 0; s < 32; s++) {
        if (patterns.chords[s] === 1) {
          const time = s * stepDuration;
          const chordIdx = Math.floor(s / 8) % progression.chords.length;
          const voicing = progression.chords[chordIdx].notes;
          pad.triggerAttackRelease(voicing, '2n', time, 0.7);
        }
      }
    }

    // 4. Glitch / FX
    if (track === 'fx') {
      const fx = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.05 }
      }).connect(masterDelay);

      const stepDuration = secondsPerBeat / 4;
      for (let s = 0; s < 32; s++) {
        if (patterns.fx[s] === 1) {
          const time = s * stepDuration;
          fx.triggerAttackRelease('32n', time, 0.6);
        }
      }
    }

    // 5. Vocals
    if (track === 'vocals') {
      const vocal = new Tone.Synth({
        oscillator: { type: 'triangle' },
        portamento: 0.08,
        envelope: { attack: 0.03, decay: 0.25, sustain: 0.2, release: 0.45 }
      }).connect(masterDelay);
      vocal.volume.value = -2;

      const stepDuration = secondsPerBeat / 4;
      for (let s = 0; s < 32; s++) {
        if (patterns.vocals[s] === 1) {
          const time = s * stepDuration;
          const chordIdx = Math.floor(s / 8) % progression.chords.length;
          const note = progression.vocalNotes[(s + chordIdx * 2) % progression.vocalNotes.length];
          vocal.triggerAttackRelease(note, '16n', time, 0.8);
        }
      }
    }
  }, totalSeconds);

  return audioBufferToWavBlob(buffer.get());
}
