// GenerateParticles.js
import React, { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

// Helper function to generate points for the sphere
const PointsCube = (n, dri, l, dro) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const inout = (Math.random() - 0.5) * l;
    const lim = inout >= 0 ? dro : dri;
    const rand = l + Math.pow(Math.random(), 6) * lim * inout;
    const x = (Math.random() - 0.5);
    const y = (Math.random() - 0.5);
    const z = (Math.random() - 0.5);
    const particle = new THREE.Vector3(x, y + 0.1, z);
    pts.push(particle.multiplyScalar(rand));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(pts);
  return geometry;
};

// GenerateParticles component
const GenerateCube = ({ particleColor }) => {
  const { clock } = useThree(); // Correctly accessing clock here
  const pointsRef = useRef();

  const noise3D = useMemo(() => new createNoise3D(), []);

  const particlesGeometry = useMemo(() => {
    const length = 20;
    const numParticles = 40000; // Adjust the number of particles
    const innerDifference = 1; // Adjust inner difference
    const outerDifference = 1; // Adjust outer difference
    return PointsCube(numParticles, innerDifference, length, outerDifference);
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

export default GenerateCube;
