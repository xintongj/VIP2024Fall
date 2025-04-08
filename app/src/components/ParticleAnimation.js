// ParticleAnimation.js

import React from 'react';
import GenerateSphere from './GenerateSphere';
import GenerateCube from './GenerateCube';
import GeneratePyramid from './GeneratePyramid';
import GenerateBlob from "./GenerateBlob";

const ParticleAnimation = ({ particleColor, shape}) => {
  if (shape === "sphere") {
    return (
      <GenerateSphere particleColor={particleColor} />
    );
  } else if (shape === "cube") {
    return (
      <GenerateCube particleColor={particleColor} />
    );
  } else if (shape === "pyramid") {
    return (
      <GeneratePyramid particleColor={particleColor} />
    );
  } else if (shape == "blob") {
    return (
      <GenerateBlob particleColor={particleColor} />
    )
  }
};

export default ParticleAnimation;
