'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useCarStore, CARS } from '@/store/useCarStore';

export function CarViewer() {
  const { selectedCarId, carColor } = useCarStore();
  const activeCar = CARS.find((c) => c.id === selectedCarId);
  const groupRef = useRef<THREE.Group>(null!);
  
  if (!activeCar) return null;

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* We use React key to force re-mount when car changes, avoiding stale gltf state */}
      <Center key={activeCar.id}>
         <CarModel url={activeCar.path} carColor={carColor} name={activeCar.name} />
      </Center>
    </group>
  );
}

function CarModel({ url, carColor, name }: { url: string; carColor: string; name: string }) {
  // If the user hasn't downloaded the model yet, this will fail in console but keep the app alive
  const { scene } = useGLTF(url, true, true, (error) => {
    console.error(`Please download the car model and place it at ${url}`);
  });

  // Apply paint color dynamically
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Clone material so we don't accidentally mutate the cached global material
          child.material = child.material.clone();
          const mat = child.material as THREE.MeshStandardMaterial;
          const matName = mat.name.toLowerCase();
          
          // Try to intelligently find the body paint material based on common Sketchfab naming conventions
          if (
            matName.includes('body') || 
            matName.includes('paint') || 
            matName.includes('shell') || 
            matName.includes('exterior') ||
            matName.includes('color')
          ) {
             mat.color = new THREE.Color(carColor);
             mat.roughness = 0.2; // Shiny!
             mat.metalness = 0.7; // Metallic car paint
          }
        }
      });
    }
  }, [scene, carColor]);

  // Rotate slowly
  useFrame(() => {
    if (scene) {
      scene.rotation.y += 0.003;
    }
  });

  return (
    <>
      <primitive object={scene} />
      <Html position={[0, 3, 0]} center className="pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white shadow-2xl transition-all">
          <h3 className="font-bold tracking-wider uppercase text-sm">{name}</h3>
        </div>
      </Html>
    </>
  );
}
