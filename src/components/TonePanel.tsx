
import React from 'react';
import { ToneControl } from '@/components/ToneControl';
import { Tone } from '@/pages/Index';

interface TonePanelProps {
  tones: Tone[];
  onUpdateTone: (id: string, updates: Partial<Tone>) => void;
  onRemoveTone: (id: string) => void;
}

export const TonePanel: React.FC<TonePanelProps> = ({ tones, onUpdateTone, onRemoveTone }) => {
  if (tones.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No tones added yet.</p>
        <p className="text-sm mt-2">Click "Add Tone" to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {tones.map((tone, index) => (
        <ToneControl
          key={tone.id}
          tone={tone}
          index={index}
          onUpdate={(updates) => onUpdateTone(tone.id, updates)}
          onRemove={() => onRemoveTone(tone.id)}
        />
      ))}
    </div>
  );
};
