"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type DieConfig = {
  color: string;
  glowColor: string;
  labelColor: string;
  faces: [DieFace, DieFace, DieFace, DieFace, DieFace, DieFace];
  position: [number, number, number];
  rotation: [number, number, number];
  floatSpeed: number;
};

type DieFace = {
  iconSrc: string;
  label: string;
};

type DieRuntime = {
  basePosition: THREE.Vector3;
  dispose: () => void;
  floatSpeed: number;
  group: THREE.Group;
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial[]>;
  targetRotation: THREE.Vector3;
};

const DIE_SIZE = 1.14;
const DIE_CORNER_RADIUS = 0.18;
const DIE_BEVEL_SEGMENTS = 6;
const FACE_TEXTURE_SIZE = 512;

const loadFaceImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Unable to load hero die icon texture: ${src}`));
    image.src = src;
  });

const DICE: DieConfig[] = [
  {
    color: "#26c7d6",
    glowColor: "#7cecf2",
    labelColor: "#f0fdff",
    faces: [
      { iconSrc: "/hero-tech/react.svg", label: "React" },
      { iconSrc: "/hero-tech/angular.svg", label: "Angular" },
      { iconSrc: "/hero-tech/typescript.svg", label: "TypeScript" },
      { iconSrc: "/hero-tech/vscode.svg", label: "VS Code" },
      { iconSrc: "/hero-tech/postman.svg", label: "Postman" },
      { iconSrc: "/hero-tech/nodejs.svg", label: "Node.js" },
    ],
    position: [-1.95, 1.05, 0.7],
    rotation: [0.45, -0.35, 0.15],
    floatSpeed: 1.2,
  },
  {
    color: "#2fb2db",
    glowColor: "#7dd7ff",
    labelColor: "#eefaff",
    faces: [
      { iconSrc: "/hero-tech/nodejs.svg", label: "Node.js" },
      { iconSrc: "/hero-tech/csharp.svg", label: "C#" },
      { iconSrc: "/hero-tech/docker.svg", label: "Docker" },
      { iconSrc: "/hero-tech/postman.svg", label: "Postman" },
      { iconSrc: "/hero-tech/typescript.svg", label: "TypeScript" },
      { iconSrc: "/hero-tech/react.svg", label: "React" },
    ],
    position: [1.85, -0.9, -0.15],
    rotation: [-0.2, 0.6, -0.15],
    floatSpeed: 1,
  },
  {
    color: "#3d8ff3",
    glowColor: "#8cbcff",
    labelColor: "#f5fbff",
    faces: [
      { iconSrc: "/hero-tech/docker.svg", label: "Docker" },
      { iconSrc: "/hero-tech/react.svg", label: "React" },
      { iconSrc: "/hero-tech/csharp.svg", label: "C#" },
      { iconSrc: "/hero-tech/angular.svg", label: "Angular" },
      { iconSrc: "/hero-tech/vscode.svg", label: "VS Code" },
      { iconSrc: "/hero-tech/typescript.svg", label: "TypeScript" },
    ],
    position: [2.1, 0.4, -1.05],
    rotation: [0.25, 0.95, 0.1],
    floatSpeed: 1.35,
  },
];

const createFaceTexture = async (
  face: DieFace,
  faceColor: string,
  labelColor: string,
) => {
  const image = await loadFaceImage(face.iconSrc);
  const size = FACE_TEXTURE_SIZE;
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

  context.strokeStyle = "rgba(255,255,255,0.22)";
  context.lineWidth = 14;
  context.strokeRect(42, 42, size - 84, size - 84);

  const iconMaxWidth = 312;
  const iconMaxHeight = 312;
  const iconScale = Math.min(
    iconMaxWidth / image.width,
    iconMaxHeight / image.height,
    1,
  );
  const iconWidth = image.width * iconScale;
  const iconHeight = image.height * iconScale;
  const iconX = (size - iconWidth) / 2;
  const iconY = 84;
  context.shadowColor = "rgba(15,23,42,0.32)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 6;
  context.drawImage(image, iconX, iconY, iconWidth, iconHeight);
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;

  context.fillStyle = "rgba(240,249,255,0.88)";
  context.font = `700 ${face.label.length > 8 ? 28 : 34}px "Nunito Sans", ui-sans-serif, system-ui, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(face.label, size / 2, size - 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
};

const createDie = async (config: DieConfig): Promise<DieRuntime> => {
  const geometry = new RoundedBoxGeometry(
    DIE_SIZE,
    DIE_SIZE,
    DIE_SIZE,
    DIE_BEVEL_SEGMENTS,
    DIE_CORNER_RADIUS,
  );
  const textures = await Promise.all(
    config.faces.map((face) =>
      createFaceTexture(face, config.color, config.labelColor),
    ),
  );
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
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

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
    let isDisposed = false;
    let dice: DieRuntime[] = [];

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

    void Promise.all(DICE.map((dieConfig) => createDie(dieConfig)))
      .then((loadedDice) => {
        if (isDisposed) {
          loadedDice.forEach((die) => die.dispose());
          return;
        }

        dice = loadedDice;
        dice.forEach((die) => scene.add(die.group));
      })
      .catch((error: unknown) => {
        console.error("Failed to load hero die textures:", error);
      });

    animate();

    return () => {
      isDisposed = true;
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
