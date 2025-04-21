// ParticleAnimation.js

import React from 'react';
import GenerateSphere from './GenerateSphere';
import GenerateCube from './GenerateCube';
import GeneratePyramid from './GeneratePyramid';

// new shapes
import GenerateObject from './GenerateObject';

const ParticleAnimation = ({ particleColor, shape }) => {
  return (
    <GenerateObject particleColor={particleColor} ObjectShape={ shape } />
  )
}

export default ParticleAnimation;
