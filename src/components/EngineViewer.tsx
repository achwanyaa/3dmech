'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useMechanicStore } from '@/store/useMechanicStore';
import { Model as V8Model } from '@/components/V8EngineModel';

export function EngineViewer() {
  const { focusedPart, isExploded, setFocusedPart } = useMechanicStore();
  const groupRef = useRef<THREE.Group>(null!);
  const originalPositions = useRef(new Map<THREE.Object3D, THREE.Vector3>());
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Initialize original positions for the explosion animation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.parent === groupRef.current || child.parent?.parent === groupRef.current) {
           if (!originalPositions.current.has(child)) {
             originalPositions.current.set(child, child.position.clone());
           }
        }
      });
    }
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth overall rotation
    if (focusedPart === 'none') {
      groupRef.current.rotation.y += 0.002;
    }

    // Exploded view animation by traversing immediate children/groups and pushing them outwards
    groupRef.current.traverse((child) => {
      const orig = originalPositions.current.get(child);
      if (orig) {
        // To explode, we push the part outwards relative to the center
        // If it's already far, we push it further. If it's central, it stays relatively central.
        const explodeVector = orig.clone().normalize().multiplyScalar(5);
        const targetPos = isExploded ? orig.clone().add(explodeVector) : orig;
        child.position.lerp(targetPos, 0.05);
      }
      
      // Highlight focused part
      if (child instanceof THREE.Mesh) {
        // Reset emissive for all
        if (child.material && 'emissive' in child.material) {
           const mat = child.material as THREE.MeshStandardMaterial;
           mat.emissive = mat.emissive || new THREE.Color(0x000000);
           
           if (focusedPart === child.name || hoveredPart === child.name) {
             mat.emissive.lerp(new THREE.Color('#3b82f6'), 0.1);
           } else {
             mat.emissive.lerp(new THREE.Color('#000000'), 0.1);
           }
        }
      }
    });
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, -2, 0]}
      scale={0.5} // Scale down the massive engine model
      onClick={(e) => {
        e.stopPropagation();
        setFocusedPart(e.object.name);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredPart(e.object.name);
      }}
      onPointerOut={(e) => {
        setHoveredPart(null);
      }}
    >
      <V8Model />
      
      {focusedPart !== 'none' && (
        <Html position={[0, 5, 0]} center className="pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-blue-500 w-64 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <h3 className="font-bold text-blue-400 capitalize">{focusedPart.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-gray-300 mt-1">Inspecting exact technical component of the V8 block.</p>
          </div>
        </Html>
      )}
    </group>
  );
}
