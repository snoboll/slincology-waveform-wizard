import React, { useState, useCallback } from 'react';
import { WaveformVisualization } from '@/components/WaveformVisualization';
import { WaveformVisualization3D } from '@/components/WaveformVisualization3D';
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
    amplitude: 0.5,
    phase: 0,
    enabled: true
  }]);
  const [isAnimated, setIsAnimated] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [masterFrequency, setMasterFrequency] = useState(220);
  const [is3DMode, setIs3DMode] = useState(false);
  const [waveType, setWaveType] = useState<'planar' | 'circular'>('planar');

  // Add audio synthesis
  useAudioSynthesis(tones, soundEnabled, masterFrequency);

  const addTone = useCallback(() => {
    if (tones.length >= 4) return; // Limit to 4 tones

    const newTone: Tone = {
      id: Date.now().toString(),
      frequency: 1,
      amplitude: 0.5,
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
      amplitude: 0.5,
      phase: 0,
      enabled: true
    }]);
    setIsAnimated(false); // Set to standing waves
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
            {is3DMode ? '3D Wave Visualization - Explore planar and circular wave patterns' : 'Rope Wave Visualization - See how different wave modes combine (1 = half wave, 2 = full wave, etc.)'}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Waveform Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-cyan-400">Wave Pattern</h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Label className="text-slate-300">2D</Label>
                    <Switch checked={is3DMode} onCheckedChange={setIs3DMode} />
                    <Label className="text-slate-300">3D</Label>
                  </div>
                  
                  {is3DMode && (
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-300">Planar</Label>
                      <Switch 
                        checked={waveType === 'circular'} 
                        onCheckedChange={(checked) => setWaveType(checked ? 'circular' : 'planar')} 
                      />
                      <Label className="text-slate-300">Circular</Label>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Label className="text-slate-300">Standing Waves</Label>
                    <Switch checked={isAnimated} onCheckedChange={setIsAnimated} />
                    <Label className="text-slate-300">Traveling Waves</Label>
                  </div>
                  <div className="flex items-center gap-3 min-w-32">
                    <Label className="text-slate-300 text-sm">Speed</Label>
                    <Slider 
                      value={[animationSpeed]} 
                      onValueChange={value => setAnimationSpeed(value[0])} 
                      min={0.1} 
                      max={3} 
                      step={0.1} 
                      className="w-20" 
                    />
                    <span className="text-slate-300 text-sm w-8">{animationSpeed.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="flex items-center gap-2"
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      Sound
                    </Button>
                  </div>
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
              
              {is3DMode ? (
                <WaveformVisualization3D 
                  tones={tones} 
                  isAnimated={isAnimated} 
                  animationSpeed={animationSpeed}
                  waveType={waveType}
                />
              ) : (
                <WaveformVisualization tones={tones} isAnimated={isAnimated} animationSpeed={animationSpeed} />
              )}
            </Card>
          </div>

          {/* Tone Controls */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-cyan-400">Wave Modes (Max 4)</h2>
                <div className="flex gap-2">
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
        <footer className="mt-16 text-center space-y-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
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
