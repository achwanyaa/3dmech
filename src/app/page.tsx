'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import { EngineViewer } from '@/components/EngineViewer';
import { useMechanicStore } from '@/store/useMechanicStore';

export default function MechanicsGuide() {
  const { focusedPart, isExploded, setFocusedPart, toggleExplodedView } = useMechanicStore();

  return (
    <div className="w-screen h-screen bg-slate-950 text-white font-sans overflow-hidden flex">
      
      {/* 3D Canvas Area */}
      <div className="flex-1 relative">
        <header className="absolute top-8 left-8 z-10 pointer-events-none">
          <h1 className="text-4xl font-black tracking-tight text-white/90 drop-shadow-md">
            V8 Engine <span className="text-blue-500">Masterclass</span>
          </h1>
          <p className="text-slate-400 mt-2">Click on parts to learn more. Drag to rotate.</p>
        </header>

        <Canvas camera={{ position: [5, 3, 8], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Suspense fallback={null}>
            <EngineViewer />
            <Environment preset="city" />
            <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4} />
          </Suspense>
          
          <OrbitControls 
            enablePan={false} 
            minDistance={3} 
            maxDistance={15}
            maxPolarAngle={Math.PI / 2 + 0.1} 
          />
        </Canvas>

        {/* Floating Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          <button 
            onClick={toggleExplodedView}
            className={`px-6 py-3 rounded-full font-bold transition-all shadow-lg ${isExploded ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'}`}
          >
            {isExploded ? 'Collapse Engine' : 'Explode View'}
          </button>
          
          {focusedPart !== 'none' && (
            <button 
              onClick={() => setFocusedPart('none')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full font-bold transition-all shadow-lg border border-slate-700"
            >
              Reset Focus
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
