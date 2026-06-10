'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useExplorerStore } from '@/store/useExplorerStore'

export function HeartModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { currentStructure, selectStructure } = useExplorerStore()
  
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { camera, controls } = useThree()

  // Anatomy Data (similar to PoC)
  const structures = useMemo(() => ({
    'left-ventricle': { color: '#dc2626' },
    'right-ventricle': { color: '#991b1b' },
    'left-atrium': { color: '#ef4444' },
    'right-atrium': { color: '#f87171' },
    'aorta': { color: '#fca5a5' },
    'pulmonary-artery': { color: '#60a5fa' }
  }), [])

  // Procedural Paths
  const aortaPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, 0.66, 0.36),
    new THREE.Vector3(-0.14, 1.36, 0.26),
    new THREE.Vector3(-0.44, 1.72, 0.02),
    new THREE.Vector3(-1.02, 1.56, -0.14),
    new THREE.Vector3(-1.36, 0.95, -0.24),
    new THREE.Vector3(-1.52, 0.2, -0.2),
  ]), [])

  const pulmonaryPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.46, 0.56, 0.53),
    new THREE.Vector3(0.46, 1.16, 0.43),
    new THREE.Vector3(0.22, 1.56, 0.26),
    new THREE.Vector3(-0.18, 1.64, 0.10),
    new THREE.Vector3(-0.54, 1.52, -0.04),
  ]), [])

  const svcPath = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.70, 2.12, -0.14),
    new THREE.Vector3(0.68, 1.66, -0.14),
    new THREE.Vector3(0.60, 1.30, -0.12),
  ]), [])

  const coronaryPaths = useMemo(() => [
    new THREE.CatmullRomCurve3([[0,.72,1.42],[-.38,.32,1.46],[-.90,-.20,1.10],[-1.18,-.68,.60],[-.90,-1.18,.22]].map(([a,b,c]) => new THREE.Vector3(a,b,c))),
    new THREE.CatmullRomCurve3([[.22,.62,1.36],[.68,.10,1.06],[1.20,-.34,.66],[1.30,-.84,.22],[1.0,-1.24,.02]].map(([a,b,c]) => new THREE.Vector3(a,b,c))),
    new THREE.CatmullRomCurve3([[-.38,.32,1.46],[-.88,.06,.86],[-1.34,-.14,.26],[-1.24,-.44,-.24],[-.80,-.74,-.44]].map(([a,b,c]) => new THREE.Vector3(a,b,c)))
  ], [])

  const coronaryColors = ['#ff9999', '#ffaaaa', '#ff8888']

  const pvPaths = useMemo(() => [
    new THREE.CatmullRomCurve3([[-0.68, 1.02,-1.10],[-0.54,.90,-.58],[-0.44,.88,-.44]].map(([a,b,c]) => new THREE.Vector3(a,b,c))),
    new THREE.CatmullRomCurve3([[-0.64, 0.66,-1.10],[-0.52,.66,-.58],[-0.44,.70,-.42]].map(([a,b,c]) => new THREE.Vector3(a,b,c))),
    new THREE.CatmullRomCurve3([[-0.24, 1.02,-1.10],[-0.36,.90,-.58],[-0.42,.88,-.40]].map(([a,b,c]) => new THREE.Vector3(a,b,c))),
    new THREE.CatmullRomCurve3([[-0.20, 0.66,-1.10],[-0.32,.66,-.58],[-0.40,.70,-.36]].map(([a,b,c]) => new THREE.Vector3(a,b,c))),
  ], [])

  const bodyGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.58, 64, 64)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const ny = (y + 1.58) / 3.16
      const taper = 0.78 + ny * 0.22
      const pFlatten = z < 0 ? 1 + z * 0.1 : 1
      pos.setXYZ(i, x * taper * pFlatten, y * 0.875, z * taper * 0.9)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // Heartbeat animation
  let beatCycle = 0
  useFrame((state, delta) => {
    if (!groupRef.current) return
    beatCycle += Math.min(delta, 0.05) * 1.32 // ~79 bpm
    if (beatCycle > Math.PI * 2) beatCycle -= Math.PI * 2
    const t = beatCycle / (Math.PI * 2)
    let s = 1.0
    if (t < 0.07) s = 1 + Math.sin(t / 0.07 * Math.PI) * 0.038
    else if (t < 0.14) s = 1 + Math.sin((t - 0.07) / 0.07 * Math.PI) * 0.018
    groupRef.current.scale.setScalar(s)
  })

  // Event handlers
  const handlePointerOver = (e: any, id: string) => {
    e.stopPropagation()
    setHoveredId(id)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut = (e: any) => {
    e.stopPropagation()
    setHoveredId(null)
    document.body.style.cursor = 'default'
  }
  const handleClick = (e: any, id: string) => {
    e.stopPropagation()
    // Select the structure in the global store
    const name = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    selectStructure({ id, name, level: 'region' })
  }

  // Material builder helper
  const getMaterial = (id: string, baseHex: string, opts: any = {}) => {
    const col = new THREE.Color(baseHex)
    let emissiveHex = col.clone().multiplyScalar(0.22).getHex()
    let emissiveIntensity = 1

    if (currentStructure?.id === id) {
      emissiveHex = new THREE.Color('#ff6b6b').getHex()
      emissiveIntensity = 1.3
    } else if (hoveredId === id) {
      emissiveHex = new THREE.Color('#ffffff').getHex()
      emissiveIntensity = 0.28
    }

    return (
      <meshPhysicalMaterial
        color={col}
        emissive={emissiveHex}
        emissiveIntensity={emissiveIntensity}
        roughness={opts.r ?? 0.45}
        metalness={opts.m ?? 0.08}
        transparent={opts.t ?? false}
        opacity={opts.o ?? 1}
      />
    )
  }

  // Effect to animate camera when selection changes
  useEffect(() => {
    if (currentStructure) {
      // Find the mesh and zoom to it
      // For a proper implementation, we would store refs to meshes and compute world pos
      // Here we just do a simple camera shift as a placeholder
      if (controls && typeof (controls as any).target !== 'undefined') {
        // Stop auto-rotate during selection focus
        ;(controls as any).autoRotate = false
      }
    } else {
      // Reset camera
      if (controls) {
        ;(controls as any).autoRotate = true
      }
    }
  }, [currentStructure, controls])

  return (
    <group ref={groupRef} rotation={[0.12, 0, -0.28]}>
      {/* Body */}
      <mesh geometry={bodyGeo} receiveShadow castShadow>
        {getMaterial('body', '#560e0e', { r: 0.62, m: 0.04 })}
      </mesh>

      {/* Chambers */}
      <mesh 
        position={[-0.44, -0.46, 0.56]} 
        receiveShadow castShadow
        onPointerOver={(e) => handlePointerOver(e, 'left-ventricle')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'left-ventricle')}
      >
        <sphereGeometry args={[0.84, 32, 32]} />
        {getMaterial('left-ventricle', '#dc2626', { r: 0.28 })}
      </mesh>

      <mesh 
        position={[0.56, -0.36, 0.46]} 
        receiveShadow castShadow
        onPointerOver={(e) => handlePointerOver(e, 'right-ventricle')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'right-ventricle')}
      >
        <sphereGeometry args={[0.66, 32, 32]} />
        {getMaterial('right-ventricle', '#991b1b', { r: 0.28 })}
      </mesh>

      <mesh 
        position={[-0.50, 0.80, -0.22]} 
        receiveShadow castShadow
        onPointerOver={(e) => handlePointerOver(e, 'left-atrium')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'left-atrium')}
      >
        <sphereGeometry args={[0.53, 32, 32]} />
        {getMaterial('left-atrium', '#ef4444', { r: 0.32 })}
      </mesh>

      <mesh 
        position={[0.56, 0.80, -0.12]} 
        receiveShadow castShadow
        onPointerOver={(e) => handlePointerOver(e, 'right-atrium')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'right-atrium')}
      >
        <sphereGeometry args={[0.47, 32, 32]} />
        {getMaterial('right-atrium', '#f87171', { r: 0.32 })}
      </mesh>

      {/* Aorta */}
      <mesh 
        receiveShadow castShadow
        onPointerOver={(e) => handlePointerOver(e, 'aorta')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'aorta')}
      >
        <tubeGeometry args={[aortaPath, 32, 0.24, 12, false]} />
        {getMaterial('aorta', '#fca5a5', { r: 0.28, m: 0.18 })}
      </mesh>

      {/* Pulmonary Artery */}
      <mesh 
        receiveShadow castShadow
        onPointerOver={(e) => handlePointerOver(e, 'pulmonary-artery')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'pulmonary-artery')}
      >
        <tubeGeometry args={[pulmonaryPath, 26, 0.17, 10, false]} />
        {getMaterial('pulmonary-artery', '#60a5fa', { r: 0.28, m: 0.12 })}
      </mesh>

      {/* Coronary Arteries (decorative) */}
      {coronaryPaths.map((path, i) => (
        <mesh key={`coronary-${i}`}>
          <tubeGeometry args={[path, 40, 0.04, 6, false]} />
          <meshPhysicalMaterial 
            color={coronaryColors[i]} 
            roughness={0.2} 
            metalness={0.28} 
            emissive={new THREE.Color(coronaryColors[i]).multiplyScalar(0.18)} 
          />
        </mesh>
      ))}

      {/* Superior Vena Cava */}
      <mesh>
        <tubeGeometry args={[svcPath, 12, 0.15, 10, false]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.46} />
      </mesh>

      {/* Pulmonary Veins */}
      {pvPaths.map((path, i) => (
        <mesh key={`pv-${i}`}>
          <tubeGeometry args={[path, 12, 0.10, 8, false]} />
          <meshPhysicalMaterial color="#dc2626" roughness={0.42} transparent opacity={0.82} />
        </mesh>
      ))}
    </group>
  )
}
