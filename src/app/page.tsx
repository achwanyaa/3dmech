'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { CarViewer } from '@/components/CarViewer';
import { useCarStore, CATEGORIES, CARS } from '@/store/useCarStore';

// Simple predefined colors for the paint picker
const COLORS = [
  '#ffffff', // White
  '#000000', // Black
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#eab308', // Yellow
  '#22c55e', // Green
  '#a855f7', // Purple
  '#64748b', // Slate
];

export default function CarShowroom() {
  const { 
    selectedCategory, 
    selectedCarId, 
    carColor, 
    setSelectedCategory, 
    setSelectedCarId, 
    setCarColor 
  } = useCarStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeCars = CARS.filter(c => c.category === selectedCategory);
  const activeCarDetails = CARS.find(c => c.id === selectedCarId);

  // Prevent hydration errors
  if (!mounted) return null;

  return (
    <div className="w-screen h-screen bg-slate-950 text-white font-sans overflow-hidden flex">
      
      {/* Sidebar Navigation */}
      <div className="w-80 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-10 shadow-2xl">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AUTO<span className="text-white">SHOWROOM</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Premium 3D Vehicle Interactive Guide.</p>
        </div>

        {/* Categories */}
        <div className="px-4 py-2 flex-1 overflow-y-auto space-y-1">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-4">Categories</p>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center justify-between ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {category}
              {selectedCategory === category && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />}
            </button>
          ))}

          {/* Cars in Category */}
          <div className="mt-8 mb-4 border-t border-slate-800 pt-6">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Available Models</p>
            <div className="space-y-2">
              {activeCars.map(car => (
                <button
                  key={car.id}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm border ${
                    selectedCarId === car.id 
                      ? 'bg-slate-800 border-slate-600 text-white' 
                      : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{car.name}</div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-1">{car.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Account / Paywall CTA placeholder */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20">
            <p className="text-xs text-amber-500 font-bold uppercase tracking-widest">Digital Access</p>
            <p className="text-sm text-slate-300 mt-1">Unlock all 10 premium 3D models with a single pass.</p>
            <button className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/20">
              Purchase Pass
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-950">
        
        {/* Dynamic Header */}
        <header className="absolute top-8 left-8 z-10 pointer-events-none">
          <h2 className="text-5xl font-black tracking-tight text-white drop-shadow-lg">
            {activeCarDetails?.name || 'Select a Car'}
          </h2>
          <p className="text-blue-400 font-medium text-lg mt-1 tracking-wide uppercase">
            {activeCarDetails?.category}
          </p>
        </header>

        {/* Paint Customizer */}
        <div className="absolute top-8 right-8 z-10 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Custom Paint</p>
          <div className="flex flex-col gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setCarColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  carColor === color ? 'border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* The 3D World */}
        <Canvas camera={{ position: [6, 2, 6], fov: 40 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <directionalLight position={[-10, 10, -10]} intensity={1} />
          
          <Suspense fallback={null}>
            <CarViewer />
            {/* High quality studio environment */}
            <Environment preset="studio" />
            <ContactShadows position={[0, -1.01, 0]} opacity={0.7} scale={15} blur={2.5} far={4} resolution={1024} color="#000000" />
          </Suspense>
          
          <OrbitControls 
            enablePan={false} 
            minDistance={4} 
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the floor
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
      
    </div>
  );
}
