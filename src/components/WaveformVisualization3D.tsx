
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Tone } from '@/pages/Index';

interface WaveformVisualization3DProps {
  tones: Tone[];
  isAnimated: boolean;
  animationSpeed: number;
  waveType: 'planar' | 'circular';
}

const WaveGeometry: React.FC<{
  tones: Tone[];
  isAnimated: boolean;
  animationSpeed: number;
  waveType: 'planar' | 'circular';
}> = ({ tones, isAnimated, animationSpeed, waveType }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (isAnimated) {
      timeRef.current += delta * animationSpeed;
    }
    
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.getAttribute('position');
      const positions = positionAttribute.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        
        let displacement = 0;
        
        tones.forEach(tone => {
          if (tone.enabled) {
            let value = 0;
            
            if (waveType === 'planar') {
              // Planar waves along X axis
              if (isAnimated) {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * x / 4) - (tone.frequency * timeRef.current) + tone.phase);
              } else {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * x / 4) + tone.phase) * Math.cos(tone.frequency * timeRef.current);
              }
            } else {
              // Circular waves from center
              const radius = Math.sqrt(x * x + z * z);
              if (isAnimated) {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * radius / 2) - (tone.frequency * timeRef.current) + tone.phase);
              } else {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * radius / 2) + tone.phase) * Math.cos(tone.frequency * timeRef.current);
              }
            }
            
            displacement += value;
          }
        });
        
        positions[i + 1] = displacement;
      }
      
      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(8, 8, 64, 64);
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial 
        color="#06b6d4" 
        wireframe={false}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const WaveLines: React.FC<{
  tones: Tone[];
  isAnimated: boolean;
  animationSpeed: number;
  waveType: 'planar' | 'circular';
}> = ({ tones, isAnimated, animationSpeed, waveType }) => {
  const linesRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (isAnimated) {
      timeRef.current += delta * animationSpeed;
    }
    
    if (linesRef.current) {
      linesRef.current.children.forEach((child, toneIndex) => {
        const line = child as THREE.Line;
        const geometry = line.geometry as THREE.BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');
        const positions = positionAttribute.array as Float32Array;
        const tone = tones[toneIndex];
        
        if (tone && tone.enabled) {
          for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            
            let value = 0;
            
            if (waveType === 'planar') {
              if (isAnimated) {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * x / 4) - (tone.frequency * timeRef.current) + tone.phase);
              } else {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * x / 4) + tone.phase) * Math.cos(tone.frequency * timeRef.current);
              }
            } else {
              const radius = Math.sqrt(x * x + z * z);
              if (isAnimated) {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * radius / 2) - (tone.frequency * timeRef.current) + tone.phase);
              } else {
                value = tone.amplitude * Math.sin((tone.frequency * Math.PI * radius / 2) + tone.phase) * Math.cos(tone.frequency * timeRef.current);
              }
            }
            
            positions[i + 1] = value + (toneIndex * 0.1);
          }
          
          positionAttribute.needsUpdate = true;
          line.visible = true;
        } else {
          line.visible = false;
        }
      });
    }
  });

  const lineGeometries = useMemo(() => {
    const colors = ['#ef4444', '#f97316', '#22c55e', '#3b82f6'];
    
    return tones.map((_, index) => {
      const points = [];
      const segments = waveType === 'circular' ? 128 : 64;
      
      if (waveType === 'planar') {
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * 8 - 4;
          points.push(new THREE.Vector3(x, 0, 0));
        }
      } else {
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const radius = 3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          points.push(new THREE.Vector3(x, 0, z));
        }
      }
      
      return {
        geometry: new THREE.BufferGeometry().setFromPoints(points),
        color: colors[index % colors.length]
      };
    });
  }, [tones.length, waveType]);

  return (
    <group ref={linesRef}>
      {lineGeometries.map((lineData, index) => (
        <primitive key={index} object={new THREE.Line(lineData.geometry, new THREE.LineBasicMaterial({ color: lineData.color }))} />
      ))}
    </group>
  );
};

export const WaveformVisualization3D: React.FC<WaveformVisualization3DProps> = ({ 
  tones, 
  isAnimated, 
  animationSpeed,
  waveType 
}) => {
  return (
    <div className="w-full h-96">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <WaveGeometry 
          tones={tones} 
          isAnimated={isAnimated} 
          animationSpeed={animationSpeed}
          waveType={waveType}
        />
        
        <WaveLines 
          tones={tones} 
          isAnimated={isAnimated} 
          animationSpeed={animationSpeed}
          waveType={waveType}
        />
        
        <Grid 
          args={[10, 10]} 
          position={[0, -0.01, 0]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor="#374151" 
          sectionSize={2} 
          sectionThickness={1} 
          sectionColor="#4b5563"
        />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};
