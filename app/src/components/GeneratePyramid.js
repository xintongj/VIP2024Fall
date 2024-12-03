// GenerateParticles.js
import React, { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Helper function to generate points for the sphere
const PointsPyramid = (n, dri, height, dro) => {
  const pts = [];
  const baseSize = height;
  const layers = Math.floor(height * 5);

  // Generate points for each layer
  for (let i = 0; i < layers; i++) {
    const layerHeight = (i / layers) * height;
    const layerSize = baseSize * (1 - i / layers);

    // Number of particles per layer (approximate square grid)
    const particlesPerLayer = Math.floor(n / layers);
    for (let j = 0; j < particlesPerLayer; j++) {
      const x = (Math.random() - 0.5) * layerSize;
      const y = layerHeight - height / 2 + (Math.random() - 0.5) * 0.5;
      const z = (Math.random() - 0.5) * layerSize;
      const particle = new THREE.Vector3(x, y + 1, z);
      pts.push(particle.multiplyScalar(height));
    }
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(pts);
  return geometry;
};

// GenerateParticles component
const GeneratePyramid = ({ particleColor }) => {
  const { clock } = useThree(); // Correctly accessing clock here
  const pointsRef = useRef();

  const particlesGeometry = useMemo(() => {
    const length = 5;
    const numParticles = 30000; // Adjust the number of particles
    const innerDifference = 1; // Adjust inner difference
    const outerDifference = 1; // Adjust outer difference
    return PointsPyramid(numParticles, innerDifference, length, outerDifference);
  }, []);

  const particlesMaterial = useMemo(() => new THREE.PointsMaterial({
    color: particleColor || 0x000000, // Use particleColor prop, default is white
    size: 0.1,
  }), [particleColor]);

  useFrame(() => {
    // Ensure clock is accessed within the scope of useFrame
    const elapsedTime = clock.getElapsedTime();
    pointsRef.current.rotation.y = elapsedTime * 0.1;
  });

  return (
    <points ref={pointsRef} geometry={particlesGeometry} material={particlesMaterial} />
  );
};

export default GeneratePyramid;
