import { useEffect, useRef } from 'react';
import { Tone } from '@/pages/Index';

export const useAudioSynthesis = (tones: Tone[], enabled: boolean, masterFrequency: number = 220) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Stop all audio when disabled
      if (audioContextRef.current) {
        audioContextRef.current.suspend();
      }
      return;
    }

    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.setValueAtTime(0.1, audioContextRef.current.currentTime); // Master volume
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // Clean up existing oscillators that are no longer needed
    const currentToneIds = new Set(tones.filter(tone => tone.enabled).map(tone => tone.id));
    oscillatorsRef.current.forEach((oscillator, id) => {
      if (!currentToneIds.has(id)) {
        oscillator.stop();
        oscillatorsRef.current.delete(id);
        gainNodesRef.current.delete(id);
      }
    });

    // Create or update oscillators for each enabled tone
    tones.forEach(tone => {
      if (!tone.enabled) return;

      let oscillator = oscillatorsRef.current.get(tone.id);
      let gainNode = gainNodesRef.current.get(tone.id);

      if (!oscillator && audioContextRef.current && masterGainRef.current) {
        // Create new oscillator and gain node
        oscillator = audioContextRef.current.createOscillator();
        gainNode = audioContextRef.current.createGain();

        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(masterGainRef.current);
        
        oscillator.start();
        
        oscillatorsRef.current.set(tone.id, oscillator);
        gainNodesRef.current.set(tone.id, gainNode);
      }

      if (oscillator && gainNode && audioContextRef.current) {
        // Use master frequency as base instead of fixed 220Hz
        const audioFrequency = masterFrequency * tone.frequency;
        
        oscillator.frequency.setValueAtTime(audioFrequency, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(tone.amplitude * 0.1, audioContextRef.current.currentTime);
      }
    });

  }, [tones, enabled, masterFrequency]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
};
