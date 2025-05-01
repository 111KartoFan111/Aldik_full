import React, { useRef, useState, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./Itachi.css";
import "./Itachi3d.css";

const ItachiModel = ({ isVisible }) => {
  const gltf = useLoader(GLTFLoader, "/akatsuki.github.io/models/itachi/scene.gltf");
  const itachiRef = useRef();

  useFrame(() => {
    if (itachiRef.current && isVisible) {
      itachiRef.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={itachiRef} object={gltf.scene} scale={1.4} position={[0, -0.4, 0]} />;
};

const Itachi = () => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section className="itachi-container" ref={containerRef}>
      {isVisible && (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <ItachiModel isVisible={isVisible} />
          <OrbitControls enableZoom={false} enableRotate={false} />
        </Canvas>
      )}
    </section>
  );
};

export default Itachi;