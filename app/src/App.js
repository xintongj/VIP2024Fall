// App.js
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleAnimation from './components/ParticleAnimation';
import SpeechToText from './components/SpeechToText';
import './styles.css';

function App() {
    const [particleColor, setParticleColor] = useState(0x00ffff); // Default color
    const [shape, setShape] = useState("Icosahedron");

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
          <button onClick={() => setShape("Icosahedron")}>1</button>
          <button onClick={() => setShape("Box")}>2</button>
          <button onClick={() => setShape("Cone")}>3</button>
          <button onClick={() => setShape("Torus")}>4</button>
          <button onClick={() => setShape("Blob")}>5</button>
        </div>
      </div>
    );
  }
  
  export default App;