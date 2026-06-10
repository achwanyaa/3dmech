'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { Suspense, ReactNode } from 'react'
import { RealisticHeart } from './RealisticHeart'

interface Canvas3DProps {
  children?: ReactNode
}

export function Canvas3D({ children }: Canvas3DProps) {
  return (
    <div className="w-full h-full relative bg-[#040609]">
      <Canvas shadows camera={{ position: [0, 0.5, 9.5], fov: 45 }}>
        <color attach="background" args={['#040609']} />
        <fogExp2 attach="fog" args={['#040609', 0.055]} />
        
        <Suspense fallback={null}>
          {/* Lighting from PoC */}
          <ambientLight color="#1a0812" intensity={3.5} />
          <directionalLight color="#ffcca0" intensity={4.5} position={[4, 7, 6]} castShadow />
          <directionalLight color="#5577ff" intensity={2} position={[-5, 2, 4]} />
          <directionalLight color="#cc2000" intensity={3} position={[0, -5, -6]} />
          
          <pointLight color="#ff1800" intensity={10} distance={4.5} position={[0, -0.2, 0.3]} />
          <pointLight color="#ff6644" intensity={3} distance={5} position={[-0.3, 1.8, 0.5]} />
          
          {/* Stars */}
          <Stars radius={140} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />
          
          {children}
          
          {!children && <RealisticHeart />}
          
          <OrbitControls 
            makeDefault 
            enableDamping 
            dampingFactor={0.06} 
            minDistance={3.5} 
            maxDistance={22} 
            autoRotate
            autoRotateSpeed={0.45}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
