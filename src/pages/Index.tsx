
import React, { useState, useCallback } from 'react';
import { WaveformVisualization } from '@/components/WaveformVisualization';
import { TonePanel } from '@/components/TonePanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudioSynthesis } from '@/hooks/useAudioSynthesis';

export interface Tone {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  enabled: boolean;
}

const Index = () => {
  const [tones, setTones] = useState<Tone[]>([{
    id: '1',
    frequency: 1,
    amplitude: 1,
    phase: 0,
    enabled: true
  }, {
    id: '2',
    frequency: 2,
    amplitude: 1,
    phase: 0,
    enabled: true
  }]);
  const [isAnimated, setIsAnimated] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [masterFrequency, setMasterFrequency] = useState(220);

  // Add audio synthesis
  useAudioSynthesis(tones, soundEnabled, masterFrequency);

  const addTone = useCallback(() => {
    if (tones.length >= 4) return;

    const newTone: Tone = {
      id: Date.now().toString(),
      frequency: 1,
      amplitude: 1,
      phase: 0,
      enabled: true
    };
    setTones(prev => [...prev, newTone]);
  }, [tones.length]);

  const removeTone = useCallback((id: string) => {
    setTones(prev => prev.filter(tone => tone.id !== id));
  }, []);

  const updateTone = useCallback((id: string, updates: Partial<Tone>) => {
    setTones(prev => prev.map(tone => tone.id === id ? {
      ...tone,
      ...updates
    } : tone));
  }, []);

  const clearAll = useCallback(() => {
    setTones([]);
  }, []);

  const setJamesPreset = useCallback(() => {
    setTones([{
      id: '1',
      frequency: 1,
      amplitude: 1,
      phase: 0,
      enabled: true
    }, {
      id: '2',
      frequency: 3,
      amplitude: 1,
      phase: 0,
      enabled: true
    }]);
    setIsAnimated(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 md:mb-4">
            Slincology Explorer
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-2">
            Wave Mode Visualization - See how different modes combine
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Waveform Visualization */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="bg-slate-800/50 border-slate-700 p-3 md:p-6">
              {/* Controls Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                <h2 className="text-xl md:text-2xl font-semibold text-cyan-400">Wave Pattern</h2>
                
                {/* Main Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Wave Type Toggle */}
                  <div className="flex items-center justify-center gap-2 bg-slate-700/30 rounded-lg p-2">
                    <Label className="text-slate-300 text-sm">Standing</Label>
                    <Switch checked={isAnimated} onCheckedChange={setIsAnimated} />
                    <Label className="text-slate-300 text-sm">Traveling</Label>
                  </div>
                  
                  {/* Speed Control */}
                  <div className="flex items-center gap-2 bg-slate-700/30 rounded-lg p-2 min-w-0">
                    <Label className="text-slate-300 text-sm whitespace-nowrap">Speed</Label>
                    <Slider 
                      value={[animationSpeed]} 
                      onValueChange={value => setAnimationSpeed(value[0])} 
                      min={0.1} 
                      max={3} 
                      step={0.1} 
                      className="w-16 sm:w-20" 
                    />
                    <span className="text-slate-300 text-xs w-8">{animationSpeed.toFixed(1)}x</span>
                  </div>
                  
                  {/* Sound Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    <span className="hidden sm:inline">Sound</span>
                  </Button>
                </div>
              </div>
              
              {/* Master Frequency Control */}
              {soundEnabled && (
                <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-4">
                    <Label className="text-slate-300 text-sm whitespace-nowrap">Master Freq:</Label>
                    <Slider
                      value={[masterFrequency]}
                      onValueChange={value => setMasterFrequency(value[0])}
                      min={110}
                      max={880}
                      step={10}
                      className="flex-1 max-w-xs"
                    />
                    <span className="text-slate-300 text-sm w-12">{masterFrequency}Hz</span>
                  </div>
                </div>
              )}
              
              <WaveformVisualization tones={tones} isAnimated={isAnimated} animationSpeed={animationSpeed} />
            </Card>
          </div>

          {/* Tone Controls */}
          <div className="order-1 lg:order-2">
            <Card className="bg-slate-800/50 border-slate-700 p-3 md:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                <h2 className="text-xl md:text-2xl font-semibold text-cyan-400">Wave Modes</h2>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={setJamesPreset} className="bg-purple-600 hover:bg-purple-700" size="sm">
                    James
                  </Button>
                  <Button onClick={addTone} className="bg-cyan-600 hover:bg-cyan-700" size="sm" disabled={tones.length >= 4}>
                    Add Mode
                  </Button>
                  <Button onClick={clearAll} variant="destructive" size="sm">
                    Clear All
                  </Button>
                </div>
              </div>
              <TonePanel tones={tones} onUpdateTone={updateTone} onRemoveTone={removeTone} />
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 md:mt-16 text-center space-y-2 md:space-y-4">
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Slinky Bro. inc.
          </div>
          <div className="text-slate-400 text-sm">
            The Slinky was invented by Richard James in 1943
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
