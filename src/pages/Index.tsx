
import React, { useState, useCallback } from 'react';
import { WaveformVisualization } from '@/components/WaveformVisualization';
import { TonePanel } from '@/components/TonePanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface Tone {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  enabled: boolean;
}

const Index = () => {
  const [tones, setTones] = useState<Tone[]>([
    { id: '1', frequency: 1, amplitude: 1, phase: 0, enabled: true },
    { id: '2', frequency: 2, amplitude: 0.5, phase: 0, enabled: true },
    { id: '3', frequency: 3, amplitude: 0.3, phase: 0, enabled: true },
  ]);

  const addTone = useCallback(() => {
    const newTone: Tone = {
      id: Date.now().toString(),
      frequency: 1,
      amplitude: 0.5,
      phase: 0,
      enabled: true,
    };
    setTones(prev => [...prev, newTone]);
  }, []);

  const removeTone = useCallback((id: string) => {
    setTones(prev => prev.filter(tone => tone.id !== id));
  }, []);

  const updateTone = useCallback((id: string, updates: Partial<Tone>) => {
    setTones(prev => prev.map(tone => 
      tone.id === id ? { ...tone, ...updates } : tone
    ));
  }, []);

  const clearAll = useCallback(() => {
    setTones([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Slincology Explorer
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Interactive Fourier Transform Visualization - Combine sine waves to create complex waveforms
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Waveform Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Waveform Visualization</h2>
              <WaveformVisualization tones={tones} />
            </Card>
          </div>

          {/* Tone Controls */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-cyan-400">Tone Components</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={addTone}
                    className="bg-cyan-600 hover:bg-cyan-700"
                    size="sm"
                  >
                    Add Tone
                  </Button>
                  <Button 
                    onClick={clearAll}
                    variant="destructive"
                    size="sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <TonePanel 
                tones={tones}
                onUpdateTone={updateTone}
                onRemoveTone={removeTone}
              />
            </Card>

            {/* Info Panel */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">How to Use</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p>• Adjust frequency to change the pitch of each tone</p>
                <p>• Modify amplitude to control the volume</p>
                <p>• Change phase to shift the wave horizontally</p>
                <p>• Toggle tones on/off to see their individual contribution</p>
                <p>• The combined waveform shows the sum of all active tones</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
