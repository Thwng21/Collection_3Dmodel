"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { CCDIKSolver } from "three/examples/jsm/animation/CCDIKSolver";

const Girl = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let IKSolver: CCDIKSolver | null = null;

    const OOI: any = {};

    // ================= SCENE =================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // ================= CAMERA =================
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);

    // ================= LIGHT =================
    const light = new THREE.AmbientLight(0xffffff, 2);
    scene.add(light);

    // ================= RENDERER =================
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // ================= CONTROLS =================
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.target.set(0, 1, 0);
    orbitControls.minDistance = 1;
    orbitControls.maxDistance = 5;

    const transformControls = new TransformControls(
      camera,
      renderer.domElement
    );

    // ❗ đúng cách add
    scene.add(transformControls.getHelper());

    transformControls.addEventListener(
      "mouseDown",
      () => (orbitControls.enabled = false)
    );
    transformControls.addEventListener(
      "mouseUp",
      () => (orbitControls.enabled = true)
    );

    // ================= LOAD MODEL =================
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/model/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/kira.glb",
      (gltf) => {
        const model = gltf.scene;

        // ================= CENTER MODEL =================
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += 1;

        // ================= GET OBJECT =================
        model.traverse((n: any) => {
          if (n.name === "target_hand_l") OOI.target = n;

          if (n.isSkinnedMesh) {
            OOI.kira = n;
          }
        });

        scene.add(model);

        // ================= IK =================
        if (OOI.kira && OOI.target) {
          OOI.target.position.set(0.2, 1.2, 0);

          const iks = [
            {
              target: 22,
              effector: 6,
              links: [
                { index: 5 },
                { index: 4 },
              ],
            },
          ];

          IKSolver = new CCDIKSolver(OOI.kira, iks);

          transformControls.attach(OOI.target);
        }

        animate();
      },
      undefined,
      (error) => {
        console.error("❌ Load model lỗi:", error);
      }
    );

    // ================= ANIMATE =================
    function animate() {
      animationId = requestAnimationFrame(animate);

      if (IKSolver) IKSolver.update();

      orbitControls.update();
      renderer.render(scene, camera);
    }

    // ================= RESIZE =================
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // ================= CLEANUP =================
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export default Girl;