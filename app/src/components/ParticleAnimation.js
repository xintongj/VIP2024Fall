// ParticleAnimation.js

import React from 'react';
import GenerateParticles from './GenerateParticles';

const ParticleAnimation = ({ particleColor }) => {
  return (
    <GenerateParticles particleColor={particleColor} />
  );
};

export default ParticleAnimation;
