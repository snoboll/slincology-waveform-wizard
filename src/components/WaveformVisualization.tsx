
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Tone } from '@/pages/Index';

interface WaveformVisualizationProps {
  tones: Tone[];
}

export const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({ tones }) => {
  const data = useMemo(() => {
    const points = 400;
    const maxLength = 4 * Math.PI; // Show rope length
    const step = maxLength / points;

    const result = [];
    
    for (let i = 0; i <= points; i++) {
      const x = i * step;
      const dataPoint: any = { x };
      
      // Calculate individual wave modes
      let combinedValue = 0;
      tones.forEach((tone, index) => {
        if (tone.enabled) {
          // For rope waves: sin(n * π * x / L) where n is the mode number
          const value = tone.amplitude * Math.sin((tone.frequency * Math.PI * x / maxLength) + tone.phase);
          dataPoint[`mode${index}`] = value;
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
    '#22c55e', // green
    '#3b82f6', // blue
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="x" 
            stroke="#9ca3af"
            tickFormatter={(value) => (value / Math.PI).toFixed(1) + 'π'}
            label={{ value: 'Position along rope', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9ca3af' } }}
          />
          <YAxis 
            stroke="#9ca3af" 
            domain={[-3, 3]}
            label={{ value: 'Displacement', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af' } }}
          />
          <Legend />
          
          {/* Individual wave mode lines */}
          {tones.map((tone, index) => 
            tone.enabled && (
              <Line
                key={`mode${index}`}
                type="monotone"
                dataKey={`mode${index}`}
                stroke={colors[index % colors.length]}
                strokeWidth={1}
                dot={false}
                name={`Mode ${index + 1} (${tone.frequency})`}
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
            name="Combined Wave"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
