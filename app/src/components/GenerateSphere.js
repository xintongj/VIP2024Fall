// GenerateParticles.js
import React, { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

// Helper function to generate points for the sphere
const PointsSphere = (n, dri, r, dro) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const inout = (Math.random() - 0.5) * 2;
    const lim = inout >= 0 ? dro : dri;
    const rand = r + Math.pow(Math.random(), 3) * lim * inout;
    const θ = Math.PI * 2 * Math.random();
    const φ = Math.acos(2 * Math.random() - 1);
    const ps = new THREE.Vector3(
      Math.cos(θ) * Math.sin(φ),
      Math.sin(θ) * Math.sin(φ),
      Math.cos(φ)
    );
    pts.push(ps.multiplyScalar(rand));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(pts);
  return geometry;
};

// GenerateParticles component
const GenerateSphere = ({ particleColor }) => {
  const { clock } = useThree(); // Correctly accessing clock here
  const pointsRef = useRef();

  const noise3D = useMemo(() => new createNoise3D(), []);

  const particlesGeometry = useMemo(() => {
    const radius = 15; // Adjust the radius of your sphere
    const numParticles = 20000; // Adjust the number of particles
    const innerDifference = 5; // Adjust inner difference
    const outerDifference = 5; // Adjust outer difference
    return PointsSphere(numParticles, innerDifference, radius, outerDifference);
  }, []);

  const particlesMaterial = useMemo(() => new THREE.PointsMaterial({
    color: particleColor || 0x000000, // Use particleColor prop, default is white
    size: 0.1,
  }), [particleColor]);

  useFrame(() => {
    // Ensure clock is accessed within the scope of useFrame
    const elapsedTime = clock.getElapsedTime();
    pointsRef.current.rotation.y = elapsedTime * 0.1;

    const noiseX = noise3D(elapsedTime * 0.1, 0, 0) * 2;
    const noiseY = noise3D(0, elapsedTime * 0.1, 0) * 2;
    const noiseZ = noise3D(0, 0, elapsedTime * 0.1) * 2;

    if (pointsRef.current) {
        pointsRef.current.position.set(noiseX, noiseY, noiseZ);
        pointsRef.current.rotation.y = elapsedTime * 0.1;
      }
  });

  return (
    <points ref={pointsRef} geometry={particlesGeometry} material={particlesMaterial} />
  );
};

export default GenerateSphere;
