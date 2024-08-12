import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Background3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const currentMountRef = mountRef.current;

    // Scene, camera, renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create a gradient background
    const gradientTexture = new THREE.CanvasTexture(createGradientCanvas());
    scene.background = gradientTexture;

    // Create a galaxy of particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 15000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.003,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - width / 2) / 200;
      mouseY = (event.clientY - height / 2) / 200;
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;

      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("mousemove", onDocumentMouseMove);
        if (currentMountRef) {
          currentMountRef.removeChild(renderer.domElement);
        }
      };
    }, []);

  // PURPLE GRADIENT
  //   const createGradientCanvas = () => {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = 2;
  //     canvas.height = 2;

  //     const context = canvas.getContext('2d');
  //     const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  //     gradient.addColorStop(0, '#000000');  // Black at the top
  //     gradient.addColorStop(1, '#2C0A3F');  // Dark purple at the bottom

  //     context.fillStyle = gradient;
  //     context.fillRect(0, 0, canvas.width, canvas.height);

  //     return canvas;
  //   };

  // BLUE GRADIENT
  const createGradientCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;

    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0F2027"); // Dark blue-gray at the top
    gradient.addColorStop(0.5, "#203A43"); // Mid-tone blue-gray
    gradient.addColorStop(1, "#2C5364"); // Lighter blue-gray at the bottom

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;
  };

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default Background3D;
