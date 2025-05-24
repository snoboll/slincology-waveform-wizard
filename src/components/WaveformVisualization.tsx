
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Tone } from '@/pages/Index';

interface WaveformVisualizationProps {
  tones: Tone[];
}

export const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({ tones }) => {
  const data = useMemo(() => {
    const points = 500;
    const maxTime = 4 * Math.PI; // Show 2 full periods of fundamental frequency
    const timeStep = maxTime / points;

    const result = [];
    
    for (let i = 0; i <= points; i++) {
      const t = i * timeStep;
      const dataPoint: any = { t };
      
      // Calculate individual tones
      let combinedValue = 0;
      tones.forEach((tone, index) => {
        if (tone.enabled) {
          const value = tone.amplitude * Math.sin(tone.frequency * t + tone.phase);
          dataPoint[`tone${index}`] = value;
          combinedValue += value;
        }
      });
      
      dataPoint.combined = combinedValue;
      result.push(dataPoint);
    }
    
    return result;
  }, [tones]);

  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="t" 
            stroke="#9ca3af"
            tickFormatter={(value) => (value / Math.PI).toFixed(1) + 'π'}
          />
          <YAxis stroke="#9ca3af" domain={[-3, 3]} />
          <Legend />
          
          {/* Individual tone lines */}
          {tones.map((tone, index) => 
            tone.enabled && (
              <Line
                key={`tone${index}`}
                type="monotone"
                dataKey={`tone${index}`}
                stroke={colors[index % colors.length]}
                strokeWidth={1}
                dot={false}
                name={`Tone ${index + 1} (f=${tone.frequency}Hz)`}
                strokeOpacity={0.6}
              />
            )
          )}
          
          {/* Combined waveform */}
          <Line
            type="monotone"
            dataKey="combined"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={false}
            name="Combined Waveform"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
