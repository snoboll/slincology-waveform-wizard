
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tone } from '@/pages/Index';

interface ToneControlProps {
  tone: Tone;
  index: number;
  onUpdate: (updates: Partial<Tone>) => void;
  onRemove: () => void;
}

export const ToneControl: React.FC<ToneControlProps> = ({ tone, index, onUpdate, onRemove }) => {
  const colors = [
    'border-l-red-500',
    'border-l-orange-500', 
    'border-l-green-500',
    'border-l-blue-500',
  ];

  return (
    <Card className={`bg-slate-700/50 border-slate-600 border-l-4 ${colors[index % colors.length]} p-4`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-cyan-300">
          Mode {index + 1}
        </h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={tone.enabled}
            onCheckedChange={(enabled) => onUpdate({ enabled })}
          />
          <Button
            onClick={onRemove}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            ×
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Frequency Control - Whole numbers only */}
        <div>
          <Label className="text-sm text-slate-300 mb-2 block">
            Wave Mode: {tone.frequency} {tone.frequency === 1 ? '(half wave)' : tone.frequency === 2 ? '(full wave)' : `(${tone.frequency/2} waves)`}
          </Label>
          <Slider
            value={[tone.frequency]}
            onValueChange={(value) => onUpdate({ frequency: Math.round(value[0]) })}
            min={1}
            max={8}
            step={1}
            className="w-full"
          />
        </div>

        {/* Amplitude Control */}
        <div>
          <Label className="text-sm text-slate-300 mb-2 block">
            Amplitude: {tone.amplitude.toFixed(2)}
          </Label>
          <Slider
            value={[tone.amplitude]}
            onValueChange={(value) => onUpdate({ amplitude: value[0] })}
            min={0}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Phase Control */}
        <div>
          <Label className="text-sm text-slate-300 mb-2 block">
            Phase: {(tone.phase / Math.PI).toFixed(1)}π
          </Label>
          <Slider
            value={[tone.phase]}
            onValueChange={(value) => onUpdate({ phase: value[0] })}
            min={0}
            max={2 * Math.PI}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};
