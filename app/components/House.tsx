"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Sky } from "three/examples/jsm/objects/Sky";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const House = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let mixer;

    const container = containerRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Sky (background đẹp hơn)
    const sky = new Sky();
    const uniforms = sky.material.uniforms;

    uniforms["turbidity"].value = 0;
    uniforms["rayleigh"].value = 3;
    uniforms["mieDirectionalG"].value = 0.7;
    uniforms["cloudElevation"].value = 1;
    uniforms["sunPosition"].value.set(-0.8, 0.19, 0.56);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromScene(sky).texture;

    scene.background = environment;
    scene.environment = environment;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    camera.position.set(5, 2, 8);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0.7, 0);
    controls.update();

    // Loaders
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/"); // 👈 DRACO files in public root

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/LittlestTokyo.glb", // 👈 Model file in public root
      (gltf) => {
        const model = gltf.scene;

        model.position.set(1, 1, 0);
        model.scale.set(0.01, 0.01, 0.01);

        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        animate();
      },
      undefined,
      (error) => console.error(error)
    );

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      controls.update();
      renderer.render(scene, camera);
    }

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export default House;