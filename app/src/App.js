// App.js
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleAnimation from './components/ParticleAnimation';
import SpeechToText from './components/SpeechToText';
import './styles.css';

function App() {
    const [particleColor, setParticleColor] = useState(0x00ffff); // Default color
    const [shape, setShape] = useState("sphere");

    return (
      <div>
        <h1>Voice Visualizer</h1>
        <SpeechToText setParticleColor={setParticleColor} />

        <div className="main-content">
          <Canvas camera={{ position: [0, 0, 30], fov: 75 }}> {/* Adjust camera position as needed */}
            <ParticleAnimation particleColor={particleColor} shape={shape} />
          </Canvas>
        </div>

        <div className="shape_buttons">
          <button onClick={() => setShape("sphere")}>Sphere</button>
          <button onClick={() => setShape("cube")}>Cube</button>
          <button onClick={() => setShape("pyramid")}>Pyramid</button>
          <button onClick={() => setShape("blob")}>Blob</button>
        </div>
      </div>
    );
  }
  
  export default App;