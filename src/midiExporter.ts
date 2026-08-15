import MidiWriter from 'midi-writer-js';
import { Patterns, TrackType } from './types';
import { CHORD_VOICINGS, BASS_NOTES, VOCAL_NOTES } from './audioEngine';

export function generateMidiFile(
  patterns: Patterns,
  tempo: number = 132,
  trackTitle: string = 'NeuralDusk Future Garage Session'
): { blob: Blob; filename: string } {
  const tracks: any[] = [];

  // Track 1: 2-Step Drums (Channel 10 in General MIDI)
  const drumTrack = new MidiWriter.Track();
  drumTrack.setTempo(tempo);
  drumTrack.addTrackName(`${trackTitle} - 2-Step Drums`);

  // Step duration is 16th note ('16')
  for (let i = 0; i < 32; i++) {
    if (patterns.drums[i] === 1) {
      // 36 = Bass Drum 1 (C2), 38 = Snare 1 (D2), 42 = Closed Hi-Hat (F#2)
      let drumPitch = ['C2'];
      if (i % 8 === 0 || i === 14 || i === 22) {
        drumPitch = ['C2']; // Kick
      } else if (i % 8 === 4 || i === 12 || i === 28) {
        drumPitch = ['D2']; // Snare
      } else {
        drumPitch = ['F#2']; // Ghost Hat
      }
      drumTrack.addEvent(
        new MidiWriter.NoteEvent({
          pitch: drumPitch,
          duration: '16',
          velocity: 85,
        })
      );
    } else {
      drumTrack.addEvent(new MidiWriter.NoteEvent({ pitch: [], duration: '16', wait: '16' }));
    }
  }
  tracks.push(drumTrack);

  // Track 2: Sub Bassline (Channel 2)
  const bassTrack = new MidiWriter.Track();
  bassTrack.addTrackName(`${trackTitle} - Sub Bass`);
  for (let i = 0; i < 32; i++) {
    if (patterns.bass[i] === 1) {
      const note = BASS_NOTES[Math.floor(i / 4) % BASS_NOTES.length];
      bassTrack.addEvent(
        new MidiWriter.NoteEvent({
          pitch: [note],
          duration: '16',
          velocity: 95,
        })
      );
    } else {
      bassTrack.addEvent(new MidiWriter.NoteEvent({ pitch: [], duration: '16', wait: '16' }));
    }
  }
  tracks.push(bassTrack);

  // Track 3: Atmospheric Pads (Channel 3)
  const padTrack = new MidiWriter.Track();
  padTrack.addTrackName(`${trackTitle} - Lush Pads`);
  for (let i = 0; i < 32; i += 8) {
    if (patterns.chords[i] === 1 || patterns.chords[i + 1] === 1) {
      const chordIdx = Math.floor(i / 8) % CHORD_VOICINGS.length;
      const notes = CHORD_VOICINGS[chordIdx].notes;
      padTrack.addEvent(
        new MidiWriter.NoteEvent({
          pitch: notes,
          duration: '2', // Half note duration
          velocity: 70,
        })
      );
    } else {
      padTrack.addEvent(new MidiWriter.NoteEvent({ pitch: [], duration: '2', wait: '2' }));
    }
  }
  tracks.push(padTrack);

  // Track 4: Vocal Chop Chants (Channel 4)
  const vocalTrack = new MidiWriter.Track();
  vocalTrack.addTrackName(`${trackTitle} - Vocal Chops`);
  for (let i = 0; i < 32; i++) {
    if (patterns.vocals[i] === 1) {
      const note = VOCAL_NOTES[i % VOCAL_NOTES.length];
      vocalTrack.addEvent(
        new MidiWriter.NoteEvent({
          pitch: [note],
          duration: '16',
          velocity: 80,
        })
      );
    } else {
      vocalTrack.addEvent(new MidiWriter.NoteEvent({ pitch: [], duration: '16', wait: '16' }));
    }
  }
  tracks.push(vocalTrack);

  const write = new MidiWriter.Writer(tracks);
  const uint8Array = write.buildFile();
  const blob = new Blob([uint8Array], { type: 'audio/midi' });
  const filename = `${trackTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.mid`;

  return { blob, filename };
}
