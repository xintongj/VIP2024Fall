// App.js
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleAnimation from './components/ParticleAnimation';
import SpeechToText from './components/SpeechToText';
import './styles.css';

function App() {
    const [particleColor, setParticleColor] = useState(0x00ffff); // Default color
    return (
      <div>
        <h1>Voice Visualizer</h1>
        <SpeechToText setParticleColor={setParticleColor} />
        <div className="main-content">
          <Canvas camera={{ position: [0, 0, 30], fov: 75 }}> {/* Adjust camera position as needed */}
            <ParticleAnimation particleColor={particleColor} />
          </Canvas>
        </div>
      </div>
    );
  }
  
  export default App;