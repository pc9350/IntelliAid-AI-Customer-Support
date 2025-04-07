import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Background3D = () => {
  const mountRef = useRef(null);
  const [performanceMode, setPerformanceMode] = useState(false);

  // Detect device performance on component mount
  useEffect(() => {
    // Simple performance detection - can be expanded with more sophisticated checks
    const isLowEndDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Additional check for older browsers or slower devices
      const slowProcessor = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
      
      return isMobile || slowProcessor;
    };
    
    setPerformanceMode(isLowEndDevice());
  }, []);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const currentMountRef = mountRef.current;

    // Scene, camera, renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !performanceMode, // Disable antialiasing on low-end devices
      powerPreference: "high-performance" 
    });

    renderer.setSize(width, height);
    // Lower resolution on performance mode for better FPS
    if (performanceMode) {
      renderer.setPixelRatio(window.devicePixelRatio * 0.7); 
    }
    mountRef.current.appendChild(renderer.domElement);

    // Create a gradient background
    const gradientTexture = new THREE.CanvasTexture(createGradientCanvas());
    scene.background = gradientTexture;

    // Create a galaxy of particles
    const particlesGeometry = new THREE.BufferGeometry();
    // Reduce particle count on low-end devices
    const particlesCount = performanceMode ? 5000 : 15000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: performanceMode ? 0.005 : 0.003, // Larger particles for lower count
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

    // Mouse movement effect - reduced sensitivity on low-end devices
    let mouseX = 0;
    let mouseY = 0;
    const mouseSensitivity = performanceMode ? 250 : 200;

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - width / 2) / mouseSensitivity;
      mouseY = (event.clientY - height / 2) / mouseSensitivity;
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    // Animation loop with reduced frequency on low-end devices
    const rotationSpeed = performanceMode ? 0.0003 : 0.0005;
    let frameSkip = 0;
    const maxFrameSkip = performanceMode ? 2 : 0; // Skip frames on low-end devices

    const animate = () => {
      requestAnimationFrame(animate);

      // Skip frames on performance mode
      if (frameSkip < maxFrameSkip) {
        frameSkip++;
        return;
      }
      frameSkip = 0;

      particlesMesh.rotation.x += rotationSpeed;
      particlesMesh.rotation.y += rotationSpeed;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;

      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize with debouncing for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 250); // Debounce resize for better performance
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
  }, [performanceMode]);

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
      aria-hidden="true" // For accessibility
    />
  );
};

export default Background3D;
