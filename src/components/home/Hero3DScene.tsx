"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type DieConfig = {
  color: string;
  glowColor: string;
  labelColor: string;
  labels: [string, string, string, string, string, string];
  position: [number, number, number];
  rotation: [number, number, number];
  floatSpeed: number;
};

type DieRuntime = {
  basePosition: THREE.Vector3;
  dispose: () => void;
  floatSpeed: number;
  group: THREE.Group;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial[]>;
  targetRotation: THREE.Vector3;
};

const DICE: DieConfig[] = [
  {
    color: "#26c7d6",
    glowColor: "#7cecf2",
    labelColor: "#f0fdff",
    labels: ["</>", "{}", "fn", "[]", "()", "=>"],
    position: [-1.95, 1.05, 0.7],
    rotation: [0.45, -0.35, 0.15],
    floatSpeed: 1.2,
  },
  {
    color: "#2fb2db",
    glowColor: "#7dd7ff",
    labelColor: "#eefaff",
    labels: ["API", "WEB", "APP", "DX", "TS", "DB"],
    position: [1.85, -0.9, -0.15],
    rotation: [-0.2, 0.6, -0.15],
    floatSpeed: 1,
  },
  {
    color: "#3d8ff3",
    glowColor: "#8cbcff",
    labelColor: "#f5fbff",
    labels: ["UI", "AI", "3D", "OSS", "SQL", "UX"],
    position: [2.1, 0.4, -1.05],
    rotation: [0.25, 0.95, 0.1],
    floatSpeed: 1.35,
  },
];

const createFaceTexture = (label: string, faceColor: string, labelColor: string) => {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create hero die texture.");
  }

  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, new THREE.Color(faceColor).offsetHSL(0, 0.04, 0.16).getStyle());
  gradient.addColorStop(0.55, faceColor);
  gradient.addColorStop(1, new THREE.Color(faceColor).offsetHSL(0, 0.02, -0.08).getStyle());
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  context.fillStyle = "rgba(255,255,255,0.16)";
  context.fillRect(36, 36, size - 72, 88);

  context.strokeStyle = "rgba(255,255,255,0.28)";
  context.lineWidth = 18;
  context.strokeRect(36, 36, size - 72, size - 72);

  context.shadowColor = "rgba(15,23,42,0.45)";
  context.shadowBlur = 24;
  context.shadowOffsetY = 8;
  context.strokeStyle = "rgba(15,23,42,0.55)";
  context.lineWidth = 12;
  context.lineJoin = "round";

  context.fillStyle = labelColor;
  context.font = `700 ${label.length > 3 ? 108 : 132}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.strokeText(label, size / 2, size / 2 + 12);
  context.fillText(label, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
};

const createDie = (config: DieConfig): DieRuntime => {
  const geometry = new THREE.BoxGeometry(1.14, 1.14, 1.14);
  const textures = config.labels.map((label) => createFaceTexture(label, config.color, config.labelColor));
  const materials = textures.map(
    (texture) =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: new THREE.Color(config.glowColor).multiplyScalar(0.34),
        map: texture,
        metalness: 0.22,
        roughness: 0.18,
      }),
  );

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.35 }),
  );

  const group = new THREE.Group();
  group.position.set(...config.position);
  group.rotation.set(...config.rotation);
  group.add(mesh);
  group.add(edges);

  return {
    basePosition: new THREE.Vector3(...config.position),
    dispose: () => {
      geometry.dispose();
      edges.geometry.dispose();
      const edgeMaterial = edges.material;
      edgeMaterial.dispose();
      materials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
    },
    floatSpeed: config.floatSpeed,
    group,
    mesh,
    targetRotation: new THREE.Vector3(...config.rotation),
  };
};

export const Hero3DScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#071f26", 8, 16);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height, false);
    };

    resize();

    const ambientLight = new THREE.AmbientLight("#f0fdff", 1.35);
    const hemisphereLight = new THREE.HemisphereLight("#cffafe", "#082028", 1.35);
    const directionalLight = new THREE.DirectionalLight("#ffffff", 2.4);
    directionalLight.position.set(4, 6, 4);
    directionalLight.castShadow = true;

    const pointLightA = new THREE.PointLight("#2bd4dc", 2.25);
    pointLightA.position.set(-4, -2, 5);

    const pointLightB = new THREE.PointLight("#3b82f6", 2.1);
    pointLightB.position.set(3, 2, -2);

    const pointLightC = new THREE.PointLight("#60a5fa", 1.65);
    pointLightC.position.set(0, 3, 4);

    scene.add(ambientLight, hemisphereLight, directionalLight, pointLightA, pointLightB, pointLightC);

    const glowA = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 48, 48),
      new THREE.MeshBasicMaterial({ color: "#26c7d6", transparent: true, opacity: 0.16 }),
    );
    glowA.position.set(0, 0, -2.8);

    const glowB = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 48, 48),
      new THREE.MeshBasicMaterial({ color: "#3d8ff3", transparent: true, opacity: 0.09 }),
    );
    glowB.position.set(0, 0, -3.1);

    scene.add(glowA, glowB);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.25;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const dice = DICE.map((dieConfig) => createDie(dieConfig));
    dice.forEach((die) => scene.add(die.group));

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const nextPosition = new THREE.Vector3();
    let animationFrame = 0;
    let previousTime = performance.now() / 1000;
    const startTime = previousTime;
    let hoveredDie: DieRuntime | null = null;
    let draggingDie: DieRuntime | null = null;
    let lastPointer: { x: number; y: number } | null = null;
    let dragDistance = 0;

    const setCursor = (value: string) => {
      container.style.cursor = value;
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const getIntersectedDie = () => {
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(
        dice.map((die) => die.mesh),
        false,
      );

      if (!intersections.length) {
        return null;
      }

      return dice.find((die) => die.mesh === intersections[0].object) ?? null;
    };

    const handlePointerDown = (event: PointerEvent) => {
      updatePointer(event);
      draggingDie = getIntersectedDie();

      if (!draggingDie) {
        return;
      }

      dragDistance = 0;
      lastPointer = { x: event.clientX, y: event.clientY };
      setCursor("grabbing");
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event);

      if (draggingDie && lastPointer) {
        const deltaX = event.clientX - lastPointer.x;
        const deltaY = event.clientY - lastPointer.y;

        dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
        draggingDie.targetRotation.y += deltaX * 0.0125;
        draggingDie.targetRotation.x += deltaY * 0.0125;
        lastPointer = { x: event.clientX, y: event.clientY };
        return;
      }

      const nextHoveredDie = getIntersectedDie();
      if (nextHoveredDie !== hoveredDie) {
        hoveredDie = nextHoveredDie;
        setCursor(hoveredDie ? "grab" : "auto");
      }
    };

    const handlePointerUp = () => {
      if (!draggingDie) {
        return;
      }

      if (dragDistance <= 6) {
        draggingDie.targetRotation.x += (Math.PI / 2) * (1 + Math.floor(Math.random() * 3));
        draggingDie.targetRotation.y += (Math.PI / 2) * (1 + Math.floor(Math.random() * 4));
        draggingDie.targetRotation.z += (Math.PI / 2) * Math.floor(Math.random() * 2);
      }

      draggingDie = null;
      lastPointer = null;
      setCursor(hoveredDie ? "grab" : "auto");
    };

    const handlePointerLeave = () => {
      if (!draggingDie) {
        hoveredDie = null;
        setCursor("auto");
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerup", handlePointerUp);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const now = performance.now() / 1000;
      const elapsed = now - startTime;
      const delta = Math.min(now - previousTime, 0.05);
      previousTime = now;

      dice.forEach((die) => {
        const isDragging = draggingDie === die;
        const bobX = Math.cos(elapsed * die.floatSpeed * 0.45 + die.basePosition.x) * 0.08;
        const bobY = Math.sin(elapsed * die.floatSpeed + die.basePosition.y) * 0.16;
        const idleX = isDragging ? 0 : Math.sin(elapsed * 0.75 + die.basePosition.x) * 0.1;
        const idleY = isDragging ? 0 : Math.cos(elapsed * 0.5 + die.basePosition.z) * 0.12;

        nextPosition.set(
          die.basePosition.x + bobX,
          die.basePosition.y + bobY,
          die.basePosition.z,
        );

        die.group.position.lerp(nextPosition, 1 - Math.exp(-delta * 4));
        die.group.rotation.x = THREE.MathUtils.damp(
          die.group.rotation.x,
          die.targetRotation.x + idleX,
          5,
          delta,
        );
        die.group.rotation.y = THREE.MathUtils.damp(
          die.group.rotation.y,
          die.targetRotation.y + idleY,
          5,
          delta,
        );
        die.group.rotation.z = THREE.MathUtils.damp(
          die.group.rotation.z,
          die.targetRotation.z,
          5,
          delta,
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);

      dice.forEach((die) => die.dispose());
      shadowPlane.geometry.dispose();
      const shadowMaterial = shadowPlane.material;
      shadowMaterial.dispose();
      glowA.geometry.dispose();
      const glowAMaterial = glowA.material;
      glowAMaterial.dispose();
      glowB.geometry.dispose();
      const glowBMaterial = glowB.material;
      glowBMaterial.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
};
