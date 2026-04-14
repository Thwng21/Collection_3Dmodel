"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const RobotDance = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mixer: THREE.AnimationMixer | null = null;
    let object: THREE.Group | null = null;

    const container = containerRef.current;
    if (!container) return;

    // ================= SCENE =================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    // ================= CAMERA =================
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );

    camera.position.set(100, 200, 300);

    // ================= LIGHT =================
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // ================= GROUND =================
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ================= GRID =================
    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.2;
    scene.add(grid);

    // ================= RENDERER =================
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    // ================= CONTROLS =================
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ================= LOADER =================
    const loader = new FBXLoader();

    loader.load(
      "/Samba Dancing.fbx", // ✅ đúng chuẩn public
      (fbx: THREE.Group) => {
        object = fbx;

        object.scale.set(0.1, 0.1, 0.1);

        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        // ================= FIX CENTER MODEL =================
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // đưa model về giữa
        object.position.y -= size.y / 2;

        // ================= CAMERA AUTO FIT =================
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2;

        camera.position.set(distance, distance, distance);
        camera.lookAt(0, 0, 0);

        controls.target.set(0, 0, 0);
        controls.update();

        scene.add(object);

        // ================= ANIMATION =================
        if (fbx.animations && fbx.animations.length > 0) {
          mixer = new THREE.AnimationMixer(object);
          const action = mixer.clipAction(fbx.animations[0]);
          action.play();
        }

        animate();
      },
      undefined,
      (error) => console.error("❌ Load FBX lỗi:", error)
    );

const timer = new THREE.Timer();
timer.connect(document);

function animate() {
  requestAnimationFrame(animate);

  timer.update();

  const delta = timer.getDelta();

  if (mixer) mixer.update(delta);

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
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};

export default RobotDance;