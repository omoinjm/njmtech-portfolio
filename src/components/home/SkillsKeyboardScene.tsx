"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAccentTheme } from "@/components/layout/useAccentTheme";
import {
  KEYBOARD_SKILLS,
  type KeyboardSkill,
  type SkillCategory,
} from "./skills-keyboard-data";

type SkillsKeyboardSceneProps = {
  onActiveSkillChange: (skill: KeyboardSkill | null) => void;
};

type KeyRuntime = {
  baseY: number;
  group: THREE.Group;
  highlight: number;
  hover: number;
  id: string;
  index: number;
  material: THREE.MeshPhysicalMaterial;
  skill: KeyboardSkill;
  texture: THREE.CanvasTexture;
};

type KeyboardPose = {
  pitch: number;
  roll: number;
  scale: number;
  x: number;
  y: number;
  yaw: number;
};

type HomeSectionId =
  | "hero"
  | "skills"
  | "services"
  | "projects"
  | "contact"
  | "newsletter";

type SectionConfig = {
  floatAmplitude: number;
  floatSpeed: number;
  glowOpacity: number;
  idlePitch: number;
  idleRoll: number;
  idleYaw: number;
  pose: KeyboardPose;
  skillIds?: string[];
  useSkillsProgress?: boolean;
};

const SECTION_CONFIGS: Record<HomeSectionId, SectionConfig> = {
  hero: {
    pose: {
      pitch: 0.66,
      yaw: -0.56,
      roll: 0.08,
      x: 1.5,
      y: 0.04,
      scale: 1.02,
    },
    skillIds: ["react", "nextjs", "typescript", "nodejs", "graphql"],
    idlePitch: 0.035,
    idleRoll: 0.03,
    idleYaw: 0.16,
    glowOpacity: 0.14,
    floatAmplitude: 0.1,
    floatSpeed: 0.58,
  },
  skills: {
    pose: {
      pitch: 0.72,
      yaw: 0.48,
      roll: -0.08,
      x: 0.72,
      y: -0.55,
      scale: 1.35,
    },
    useSkillsProgress: true,
    idlePitch: 0.008,
    idleRoll: 0.012,
    idleYaw: 0.02,
    glowOpacity: 0.22,
    floatAmplitude: 0.04,
    floatSpeed: 0.62,
  },
  services: {
    pose: {
      pitch: 0.64,
      yaw: 0.5,
      roll: 0.1,
      x: -1.45,
      y: -0.02,
      scale: 0.94,
    },
    skillIds: ["docker", "kubernetes", "azure", "nodejs", "postgresql", "cicd"],
    idlePitch: 0.018,
    idleRoll: 0.02,
    idleYaw: 0.055,
    glowOpacity: 0.1,
    floatAmplitude: 0.06,
    floatSpeed: 0.6,
  },
  projects: {
    pose: {
      pitch: 0.62,
      yaw: 0.42,
      roll: 0.08,
      x: -1.02,
      y: -0.06,
      scale: 0.92,
    },
    skillIds: ["react", "nextjs", "typescript", "nodejs", "docker", "postgresql"],
    idlePitch: 0.012,
    idleRoll: 0.018,
    idleYaw: 0.045,
    glowOpacity: 0.09,
    floatAmplitude: 0.05,
    floatSpeed: 0.58,
  },
  contact: {
    pose: {
      pitch: 0.54,
      yaw: -0.4,
      roll: -0.06,
      x: 0.92,
      y: -0.18,
      scale: 0.88,
    },
    skillIds: ["react", "nextjs", "graphql", "python"],
    idlePitch: 0.018,
    idleRoll: 0.02,
    idleYaw: 0.06,
    glowOpacity: 0.08,
    floatAmplitude: 0.05,
    floatSpeed: 0.54,
  },
  newsletter: {
    pose: {
      pitch: 0.48,
      yaw: -0.52,
      roll: -0.08,
      x: 1.24,
      y: -0.34,
      scale: 0.82,
    },
    skillIds: ["react", "nextjs", "graphql", "postgresql"],
    idlePitch: 0.015,
    idleRoll: 0.016,
    idleYaw: 0.045,
    glowOpacity: 0.08,
    floatAmplitude: 0.05,
    floatSpeed: 0.52,
  },
};

const CATEGORY_STAGES: Array<Set<SkillCategory>> = [
  new Set(["frontend"]),
  new Set(["frontend", "backend"]),
  new Set(["frontend", "backend", "devops"]),
  new Set(["frontend", "backend", "devops", "database"]),
];

const COLS = 5;
const ROWS = 3;
const KEYCAP_SIZE = 0.4;
const KEYCAP_HEIGHT = 0.28;
const KEYCAP_TOP_SCALE = 0.78;
const COL_SPACING = 0.42;
const ROW_SPACING = 0.42;
const BASE_WIDTH = 2.4;
const BASE_DEPTH = 1.4;
const BASE_HEIGHT = 0.26;
const ICON_PLANE_SIZE = KEYCAP_SIZE * KEYCAP_TOP_SCALE * 0.78;

let audioContext: AudioContext | null = null;
let audioUnlockInstalled = false;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const makeRoundedRectShape = (
  width: number,
  depth: number,
  cornerRadius: number,
) => {
  const shape = new THREE.Shape();
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const radius = Math.min(cornerRadius, halfWidth, halfDepth);

  shape.moveTo(-halfWidth + radius, -halfDepth);
  shape.lineTo(halfWidth - radius, -halfDepth);
  shape.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + radius);
  shape.lineTo(halfWidth, halfDepth - radius);
  shape.quadraticCurveTo(halfWidth, halfDepth, halfWidth - radius, halfDepth);
  shape.lineTo(-halfWidth + radius, halfDepth);
  shape.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - radius);
  shape.lineTo(-halfWidth, -halfDepth + radius);
  shape.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + radius, -halfDepth);

  return shape;
};

const createExtrudedBox = (
  width: number,
  depth: number,
  height: number,
  cornerRadius: number,
  bevelSize: number,
  topScale = 1,
) => {
  const shape = makeRoundedRectShape(width, depth, cornerRadius);
  const extrudeDepth = Math.max(0.001, height - 2 * bevelSize);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    bevelEnabled: bevelSize > 0,
    bevelThickness: bevelSize,
    bevelSize,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 12,
  });

  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height / 2 + bevelSize, 0);

  if (topScale !== 1) {
    const positions = geometry.attributes.position as THREE.BufferAttribute;

    for (let index = 0; index < positions.count; index += 1) {
      const y = positions.getY(index);
      const progress = (y + height / 2) / height;
      const factor = THREE.MathUtils.lerp(1, topScale, progress);
      positions.setX(index, positions.getX(index) * factor);
      positions.setZ(index, positions.getZ(index) * factor);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  return geometry;
};

const getAudioContext = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextCtor =
    window.AudioContext ??
    (window as Window &
      typeof globalThis & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }

  return audioContext;
};

const installAudioUnlock = () => {
  if (audioUnlockInstalled || typeof window === "undefined") {
    return;
  }

  audioUnlockInstalled = true;

  const unlockAudio = () => {
    const context = getAudioContext();

    if (context && context.state === "suspended") {
      void context.resume();
    }

    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };

  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
  window.addEventListener("touchstart", unlockAudio, { once: true });
};

const playHoverClick = (seed: number) => {
  const context = getAudioContext();

  if (!context || context.state !== "running") {
    return;
  }

  const now = context.currentTime;
  const mainOscillator = context.createOscillator();
  const clickOscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  mainOscillator.type = "triangle";
  mainOscillator.frequency.setValueAtTime(760 + seed * 6, now);
  mainOscillator.frequency.exponentialRampToValueAtTime(
    220 + seed * 3,
    now + 0.05,
  );

  clickOscillator.type = "square";
  clickOscillator.frequency.setValueAtTime(180 + seed * 2, now);
  clickOscillator.frequency.exponentialRampToValueAtTime(90, now + 0.04);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  mainOscillator.connect(filter);
  clickOscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  mainOscillator.start(now);
  clickOscillator.start(now);
  mainOscillator.stop(now + 0.08);
  clickOscillator.stop(now + 0.05);
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const createIconTexture = async (skill: KeyboardSkill) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create icon texture canvas.");
  }

  context.clearRect(0, 0, 256, 256);
  context.fillStyle = "rgba(255,255,255,0.06)";
  context.beginPath();
  context.roundRect(24, 24, 208, 208, 48);
  context.fill();

  const image = await loadImage(skill.iconSrc);

  if (image) {
    // SVGs without explicit width/height may report naturalWidth=0 or 300×150.
    // Fall back to the viewBox dimensions (128×128) for consistent centered rendering.
    const srcW = image.naturalWidth > 0 ? image.naturalWidth : 128;
    const srcH = image.naturalHeight > 0 ? image.naturalHeight : 128;
    const scale = Math.min(148 / srcW, 148 / srcH);
    const width = srcW * scale;
    const height = srcH * scale;
    const x = (256 - width) / 2;
    const y = (256 - height) / 2;
    context.drawImage(image, x, y, width, height);
  } else {
    context.fillStyle = "#f8fafc";
    context.font = "bold 92px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(skill.label.slice(0, 1), 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
};

const getSkillsProgress = (element: HTMLElement | undefined | null) => {
  if (!element) {
    return 0;
  }

  const rect = element.getBoundingClientRect();
  return clamp(
    (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
    0,
    1,
  );
};

const getHighlightedIds = (
  activeSection: HomeSectionId,
  skillsProgress: number,
) => {
  const config = SECTION_CONFIGS[activeSection];

  if (!config.useSkillsProgress) {
    return new Set(config.skillIds ?? []);
  }

  if (skillsProgress > 0.94) {
    return new Set(KEYBOARD_SKILLS.flat().map((skill) => skill.id));
  }

  const stageIndex = Math.min(
    CATEGORY_STAGES.length - 1,
    Math.floor(skillsProgress * CATEGORY_STAGES.length),
  );
  const allowedCategories = CATEGORY_STAGES[stageIndex];

  return new Set(
    KEYBOARD_SKILLS.flat()
      .filter((skill) => allowedCategories.has(skill.category))
      .map((skill) => skill.id),
  );
};

const getResponsivePose = (
  pose: KeyboardPose,
  viewportWidth: number,
  viewportHeight: number,
): KeyboardPose => {
  const aspect = viewportWidth / Math.max(viewportHeight, 1);
  const wideViewportStrength = clamp((aspect - 0.55) / 0.85, 0, 1);
  const xScale = THREE.MathUtils.lerp(0.22, 1, wideViewportStrength);
  const scaleFactor = THREE.MathUtils.lerp(0.58, 1, wideViewportStrength);
  const yLift = THREE.MathUtils.lerp(0.34, 0, wideViewportStrength);

  return {
    ...pose,
    x: pose.x * xScale,
    y: pose.y + yLift,
    scale: pose.scale * scaleFactor,
  };
};

const getResponsiveCameraState = (
  viewportWidth: number,
  viewportHeight: number,
) => {
  const aspect = viewportWidth / Math.max(viewportHeight, 1);
  const wideViewportStrength = clamp((aspect - 0.6) / 0.95, 0, 1);

  return {
    fov: THREE.MathUtils.lerp(34, 25, wideViewportStrength),
    x: THREE.MathUtils.lerp(0.35, 1.5, wideViewportStrength),
    y: THREE.MathUtils.lerp(3.2, 3.6, wideViewportStrength),
    z: THREE.MathUtils.lerp(12.9, 11, wideViewportStrength),
  };
};

export function SkillsKeyboardScene({
  onActiveSkillChange,
}: SkillsKeyboardSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { accentTheme } = useAccentTheme();
  const flattenedSkills = useMemo(() => KEYBOARD_SKILLS.flat(), []);

  useEffect(() => {
    installAudioUnlock();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    let isDisposed = false;
    let animationFrameId = 0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 40);
    camera.position.set(1.5, 3.6, 11);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight("#f8fafc", 0.18);
    const keyLight = new THREE.DirectionalLight("#ffffff", 2.1);
    const hemisphereLight = new THREE.HemisphereLight(
      "#eaf2fb",
      "#0a1428",
      0.25,
    );
    const accentFill = new THREE.PointLight(accentTheme.chipFrom, 0.85, 12);
    keyLight.position.set(-5, 8, 3);
    accentFill.position.set(4, 1.2, 3);
    scene.add(ambientLight, keyLight, hemisphereLight, accentFill);

    const keyboardGroup = new THREE.Group();
    scene.add(keyboardGroup);

    const baseGeometry = createExtrudedBox(
      BASE_WIDTH,
      BASE_DEPTH,
      BASE_HEIGHT,
      0.12,
      0.02,
      1,
    );
    const keyGeometry = createExtrudedBox(
      KEYCAP_SIZE,
      KEYCAP_SIZE,
      KEYCAP_HEIGHT,
      0.05,
      0.012,
      KEYCAP_TOP_SCALE,
    );
    const iconGeometry = new THREE.PlaneGeometry(
      ICON_PLANE_SIZE,
      ICON_PLANE_SIZE,
    );
    const baseColor = new THREE.Color(accentTheme.chipFrom).lerp(
      new THREE.Color("#d9f7e9"),
      0.48,
    );
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor.clone().multiplyScalar(0.16),
      emissiveIntensity: 0.08,
      metalness: 0,
      roughness: 0.62,
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    keyboardGroup.add(baseMesh);

    const glowMesh = new THREE.Mesh(
      new THREE.CircleGeometry(3.3, 48),
      new THREE.MeshBasicMaterial({
        color: accentTheme.chipTo,
        opacity: 0,
        transparent: true,
      }),
    );
    glowMesh.position.set(0, -0.4, 0.15);
    glowMesh.rotation.x = -Math.PI / 2;
    scene.add(glowMesh);

    const keyRuntimes: KeyRuntime[] = [];
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const hoveredKeyIdRef = { current: null as string | null };
    const activeSectionRef = { current: "hero" as HomeSectionId };
    const sectionElements = new Map<HomeSectionId, HTMLElement>();

    const updateViewport = () => {
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;

      if (!width || !height) {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const cameraState = getResponsiveCameraState(width, height);
      camera.fov = cameraState.fov;
      camera.position.set(cameraState.x, cameraState.y, cameraState.z);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    const setHoveredSkill = (nextId: string | null) => {
      if (hoveredKeyIdRef.current === nextId) {
        return;
      }

      hoveredKeyIdRef.current = nextId;
      const runtime = keyRuntimes.find((entry) => entry.id === nextId) ?? null;
      onActiveSkillChange(runtime?.skill ?? null);

      if (runtime) {
        playHoverClick(runtime.index);
      }
    };

    const updateHoveredSkill = (clientX: number, clientY: number) => {
      if (activeSectionRef.current !== "skills") {
        setHoveredSkill(null);
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(
        keyRuntimes.map((runtime) => runtime.group),
        true,
      );
      const hoveredObject = intersections[0]?.object;
      const hoveredRuntime =
        keyRuntimes.find((runtime) => runtime.group === hoveredObject?.parent) ??
        keyRuntimes.find(
          (runtime) => runtime.group === hoveredObject?.parent?.parent,
        ) ??
        null;

      setHoveredSkill(hoveredRuntime?.id ?? null);
    };

    const handleWindowPointerMove = (event: PointerEvent) => {
      updateHoveredSkill(event.clientX, event.clientY);
    };

    const handleWindowPointerLeave = () => {
      setHoveredSkill(null);
    };

    const createKeycaps = async () => {
      await Promise.all(
        flattenedSkills.map(async (skill, index) => {
          const row = Math.floor(index / KEYBOARD_SKILLS[0].length);
          const column = index % KEYBOARD_SKILLS[0].length;
          const material = new THREE.MeshPhysicalMaterial({
            color: "#f8fafc",
            emissive: "#ffffff",
            emissiveIntensity: 0.04,
            metalness: 0,
            roughness: 0.34,
            clearcoat: 0.42,
            clearcoatRoughness: 0.2,
          });
          const keyMesh = new THREE.Mesh(keyGeometry, material);
          const texture = await createIconTexture(skill);
          const iconMesh = new THREE.Mesh(
            iconGeometry,
            new THREE.MeshBasicMaterial({
              alphaTest: 0.04,
              depthWrite: false,
              map: texture,
              toneMapped: false,
              transparent: true,
            }),
          );
          const group = new THREE.Group();
          const x =
            (column - (COLS - 1) / 2) * COL_SPACING;
          const z = (row - (ROWS - 1) / 2) * ROW_SPACING;
          const baseY = BASE_HEIGHT / 2 + KEYCAP_HEIGHT / 2 + 0.005;

          keyMesh.position.y = 0;
          iconMesh.position.y = KEYCAP_HEIGHT / 2 + 0.0015;
          iconMesh.rotation.x = -Math.PI / 2;
          group.position.set(x, baseY, z);
          group.add(keyMesh);
          group.add(iconMesh);
          keyboardGroup.add(group);

          keyRuntimes.push({
            baseY,
            group,
            highlight: 0,
            hover: 0,
            id: skill.id,
            index,
            material,
            skill,
            texture,
          });
        }),
      );
    };

    void createKeycaps();

    const observedSections = document.querySelectorAll<HTMLElement>(
      "[data-keyboard-section]",
    );
    const visibility = new Map<HomeSectionId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = (entry.target as HTMLElement).dataset
            .keyboardSection as
            | HomeSectionId
            | undefined;

          if (!sectionId) {
            return;
          }

          visibility.set(sectionId, entry.intersectionRatio);
        });

        let nextSection: HomeSectionId = activeSectionRef.current;
        let highestRatio = 0;
        visibility.forEach((ratio, sectionId) => {
          if (ratio >= highestRatio) {
            highestRatio = ratio;
            nextSection = sectionId;
          }
        });

        activeSectionRef.current = nextSection;

        if (nextSection !== "skills") {
          setHoveredSkill(null);
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );

    observedSections.forEach((section) => {
      const sectionId = section.dataset.keyboardSection as HomeSectionId;
      sectionElements.set(sectionId, section);
      visibility.set(sectionId, 0);
      observer.observe(section);
    });

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerleave", handleWindowPointerLeave);
    window.addEventListener("resize", updateViewport);
    updateViewport();

    const accentColor = new THREE.Color(accentTheme.chipTo);
    const accentBaseColor = new THREE.Color(accentTheme.chipFrom);
    const keyTintColor = new THREE.Color(accentTheme.chipFrom).lerp(
      new THREE.Color("#f8fafc"),
      0.6,
    );
    const neutralKeyColor = new THREE.Color("#f8fafc");
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) {
        return;
      }

      const elapsed = clock.getElapsedTime();
      const activeSection = activeSectionRef.current;
      const sectionConfig = SECTION_CONFIGS[activeSection];
      const responsivePose = getResponsivePose(
        sectionConfig.pose,
        wrapper.clientWidth,
        wrapper.clientHeight,
      );
      const skillsProgress = getSkillsProgress(sectionElements.get("skills"));
      const highlightedIds = getHighlightedIds(activeSection, skillsProgress);

      keyboardGroup.rotation.x = THREE.MathUtils.lerp(
        keyboardGroup.rotation.x,
        responsivePose.pitch +
          Math.sin(elapsed * sectionConfig.floatSpeed * 0.9) *
            sectionConfig.idlePitch,
        0.06,
      );
      keyboardGroup.rotation.y = THREE.MathUtils.lerp(
        keyboardGroup.rotation.y,
        responsivePose.yaw +
          Math.sin(elapsed * sectionConfig.floatSpeed) * sectionConfig.idleYaw,
        0.06,
      );
      keyboardGroup.rotation.z = THREE.MathUtils.lerp(
        keyboardGroup.rotation.z,
        responsivePose.roll +
          Math.sin(elapsed * sectionConfig.floatSpeed * 1.15) *
            sectionConfig.idleRoll,
        0.06,
      );
      keyboardGroup.position.x = THREE.MathUtils.lerp(
        keyboardGroup.position.x,
        responsivePose.x,
        0.06,
      );
      keyboardGroup.position.y = THREE.MathUtils.lerp(
        keyboardGroup.position.y,
        responsivePose.y +
          Math.sin(elapsed * sectionConfig.floatSpeed) *
            sectionConfig.floatAmplitude,
        0.08,
      );
      const nextScale = THREE.MathUtils.lerp(
        keyboardGroup.scale.x,
        responsivePose.scale,
        0.06,
      );
      keyboardGroup.scale.setScalar(nextScale);

      keyRuntimes.forEach((runtime) => {
        const isHovered =
          activeSection === "skills" && runtime.id === hoveredKeyIdRef.current;
        const isHighlighted = highlightedIds.has(runtime.id);

        runtime.hover = THREE.MathUtils.lerp(
          runtime.hover,
          isHovered ? 1 : 0,
          0.2,
        );
        runtime.highlight = THREE.MathUtils.lerp(
          runtime.highlight,
          isHighlighted ? 1 : 0,
          0.08,
        );

        const pulse =
          Math.sin(elapsed * 2 + runtime.index * 0.45) *
          (0.035 + runtime.hover * 0.02) *
          runtime.highlight;
        runtime.group.position.y = runtime.baseY + pulse - runtime.hover * 0.1;

        runtime.material.emissive.copy(accentBaseColor).lerp(
          accentColor,
          Math.max(runtime.highlight, runtime.hover),
        );
        runtime.material.emissiveIntensity =
          0.05 + runtime.highlight * 0.28 + runtime.hover * 0.3;
        runtime.material.color.copy(neutralKeyColor).lerp(
          keyTintColor,
          runtime.highlight * 0.28 + runtime.hover * 0.18,
        );
      });

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerleave", handleWindowPointerLeave);
      onActiveSkillChange(null);

      baseGeometry.dispose();
      keyGeometry.dispose();
      iconGeometry.dispose();
      baseMaterial.dispose();
      glowMesh.geometry.dispose();
      (glowMesh.material as THREE.Material).dispose();

      keyRuntimes.forEach((runtime) => {
        runtime.texture.dispose();
        runtime.material.dispose();
        runtime.group.traverse((object) => {
          if (object instanceof THREE.Mesh && object.material !== runtime.material) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      });

      renderer.dispose();
    };
  }, [accentTheme, flattenedSkills, onActiveSkillChange]);

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full opacity-95" />
    </div>
  );
}
