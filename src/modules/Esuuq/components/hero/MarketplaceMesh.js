import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const AnimatedPlane = () => {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();

  // Create a grid of points
  const { positions, initialZ } = useMemo(() => {
    const size = 50;
    const segments = 40;
    const pos = [];
    const z = [];
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * size;
        const y = (j / segments - 0.5) * size;
        pos.push(x, y, 0);
        z.push(0);
      }
    }
    return { positions: new Float32Array(pos), initialZ: new Float32Array(z) };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const positionAttribute = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);

      // 1. Continuous Life: Subtle waves
      const wave = Math.sin(x * 0.2 + t) * 0.5 + Math.sin(y * 0.2 + t) * 0.5;

      // 2. Mouse Interaction: Multi-axis depth
      // Calculate distance from mouse to vertex
      const mouseX = mouse.x * viewport.width / 2;
      const mouseY = mouse.y * viewport.height / 2;
      const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
      
      // Magnetic warp effect
      const proximity = Math.max(0, 5 - dist * 0.5);
      const finalZ = wave + (proximity * 1.5);

      positionAttribute.setZ(i, finalZ);
    }
    positionAttribute.needsUpdate = true;

    // 3. Camera Tilt: The whole scene leans with the mouse
    meshRef.current.rotation.x = -Math.PI / 3 + (mouse.y * 0.1);
    meshRef.current.rotation.y = mouse.x * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  );
};

const MarketplaceMesh = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, #39A170 0%, #2D825A 100%)' // Tonal Green Base
    }}>
      <Canvas camera={{ position: [0, -10, 15], fov: 45 }}>
        <fog attach="fog" args={['#39A170', 10, 25]} />
        <ambientLight intensity={0.5} />
        <AnimatedPlane />
      </Canvas>
      {/* Visual Scrim for Text Contrast */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '40%',
        background: 'linear-gradient(to top, rgba(45, 130, 90, 1), transparent)',
        zIndex: 1
      }} />
    </div>
  );
};

export default MarketplaceMesh;