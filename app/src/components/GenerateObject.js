import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useThree, useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader } from '../shaders/vertexShader.ts';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';


const fragmentShader = `
    uniform vec3 u_color;
    void main() {
        gl_FragColor = vec4(u_color, 1.0);
    }
`;

const GenerateObject = ({ particleColor, ObjectShape }) => {
    const meshRef = useRef();
    const { clock } = useThree();
  
    const uniforms = useMemo(() => ({
      u_time: { value: 0.0 },
      u_color: { value: new THREE.Color(particleColor || 0xffffff) }
    }), [particleColor]);
  
    const material = useMemo(() => new THREE.ShaderMaterial({
      wireframe: true,
      uniforms,
      vertexShader,
      fragmentShader,
    }), [uniforms]);

    // for imported obj files
    const [blobGeometry, setCustomGeometry] = useState(null);

    useEffect(() => {
        if (ObjectShape === "Blob") {
            const loader = new OBJLoader();
            loader.load(
                '/models/blob.obj',
                (obj) => {
                    const geometry = obj.children[0].geometry;
                    geometry.center();
                    geometry.scale(6.0, 6.0, 6.0);
                    setCustomGeometry(geometry);
                },
                undefined,
                (error) => {
                    console.error('Error loading OBJ file:', error);
                }
            );
        }
    }, [ObjectShape, blobGeometry]);

    const geometry = useMemo(() => {
        switch (ObjectShape) {
          case "Icosahedron":
            return new THREE.IcosahedronGeometry(15, 6);
          case "Box":
            return new THREE.BoxGeometry(20, 20, 20);
          case "Cone":
            return new THREE.ConeGeometry(10, 25, 50);
          case "Torus":
            return new THREE.TorusGeometry(10, 3, 16, 100);
          case "Blob":
            return blobGeometry || new THREE.IcosahedronGeometry(15, 6);
          default:
            return new THREE.IcosahedronGeometry(15, 6);
        }
      }, [ObjectShape]);
  
    useFrame(() => {
      uniforms.u_time.value = clock.getElapsedTime();
  
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }
    });
  
    return (
      <mesh ref={meshRef} geometry={geometry} material={material} />
    );
  };

export default GenerateObject;