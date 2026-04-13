"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type CopilotOrbProps = {
  className?: string;
  speed?: number;
};

export const CopilotOrb = ({
  className,
  speed = 1,
}: CopilotOrbProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
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

    const ambientLight = new THREE.AmbientLight("#f0f9ff", 1.9);
    const hemisphereLight = new THREE.HemisphereLight("#d8b4fe", "#172554", 1.35);
    const directionalLight = new THREE.DirectionalLight("#ffffff", 2.4);
    directionalLight.position.set(3.5, 4, 5.2);
    const rimLight = new THREE.PointLight("#60a5fa", 3.1, 12);
    rimLight.position.set(-2.8, -1.4, 4.2);
    const accentLight = new THREE.PointLight("#c084fc", 2.4, 10);
    accentLight.position.set(2.4, 2.6, 2.8);
    scene.add(
      ambientLight,
      hemisphereLight,
      directionalLight,
      rimLight,
      accentLight,
    );

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const orbGeometry = new THREE.SphereGeometry(1.15, 64, 64);
    const orbMaterial = new THREE.MeshPhysicalMaterial({
      color: "#8b5cf6",
      emissive: "#2563eb",
      emissiveIntensity: 0.7,
      metalness: 0.18,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orbGroup.add(orb);

    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 48, 48),
      new THREE.MeshBasicMaterial({
        color: "#1d4ed8",
        transparent: true,
        opacity: 0.2,
      }),
    );
    orbGroup.add(innerGlow);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.42, 48, 48),
      new THREE.MeshBasicMaterial({
        color: "#7c3aed",
        transparent: true,
        opacity: 0.14,
      }),
    );
    orbGroup.add(halo);

    const loader = new THREE.TextureLoader();
    const iconTexture = loader.load("/copilot-icon.png");
    iconTexture.colorSpace = THREE.SRGBColorSpace;
    iconTexture.anisotropy = 8;
    iconTexture.minFilter = THREE.LinearFilter;
    iconTexture.magFilter = THREE.LinearFilter;

    const facePlate = new THREE.Mesh(
      new THREE.CircleGeometry(0.88, 64),
      new THREE.MeshStandardMaterial({
        color: "#0f172a",
        emissive: "#1d4ed8",
        emissiveIntensity: 0.42,
        metalness: 0.12,
        roughness: 0.24,
      }),
    );
    facePlate.position.z = 1.16;
    facePlate.renderOrder = 2;
    orbGroup.add(facePlate);

    const iconPlate = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 64),
      new THREE.MeshStandardMaterial({
        color: "#1e1b4b",
        emissive: "#2563eb",
        emissiveIntensity: 0.32,
        metalness: 0.18,
        roughness: 0.2,
      }),
    );
    iconPlate.position.z = 1.21;
    iconPlate.renderOrder = 3;
    orbGroup.add(iconPlate);

    const iconBadge = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: iconTexture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    iconBadge.position.z = 1.28;
    iconBadge.scale.set(0.98, 0.98, 0.98);
    iconBadge.renderOrder = 4;
    orbGroup.add(iconBadge);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.94, 0.09, 24, 80),
      new THREE.MeshStandardMaterial({
        color: "#7dd3fc",
        emissive: "#38bdf8",
        emissiveIntensity: 0.55,
        metalness: 0.35,
        roughness: 0.26,
      }),
    );
    ring.rotation.x = 0.72;
    ring.rotation.y = -0.42;
    ring.position.z = 0.06;
    orbGroup.add(ring);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.35, 48),
      new THREE.MeshBasicMaterial({
        color: "#020617",
        transparent: true,
        opacity: 0.24,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.62;
    shadow.scale.set(1.12, 0.42, 1);
    scene.add(shadow);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let animationFrame = 0;
    let previousTime = performance.now() / 1000;
    const startTime = previousTime;

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const now = performance.now() / 1000;
      const elapsed = now - startTime;
      const delta = Math.min(now - previousTime, 0.05);
      previousTime = now;

      if (prefersReducedMotion) {
        orbGroup.rotation.y = THREE.MathUtils.damp(
          orbGroup.rotation.y,
          0.35,
          6,
          delta,
        );
        orbGroup.rotation.x = THREE.MathUtils.damp(
          orbGroup.rotation.x,
          -0.12,
          6,
          delta,
        );
        orbGroup.position.y = THREE.MathUtils.damp(
          orbGroup.position.y,
          -0.04,
          6,
          delta,
        );
      } else {
        const baseSpeed = elapsed * (0.8 * speed);
        orbGroup.rotation.y = baseSpeed;
        orbGroup.rotation.x = Math.sin(baseSpeed * 0.9) * 0.14 - 0.08;
        orbGroup.rotation.z = Math.cos(baseSpeed * 0.45) * 0.08;
        orbGroup.position.y = Math.sin(baseSpeed * 1.2) * 0.1 - 0.02;
        halo.scale.setScalar(1.02 + Math.sin(baseSpeed * 1.8) * 0.03);
        innerGlow.scale.setScalar(0.98 + Math.cos(baseSpeed * 1.6) * 0.02);
        ring.rotation.z = Math.sin(baseSpeed * 0.7) * 0.22;
      }

      iconBadge.material.rotation = Math.sin(elapsed * speed * 0.3) * 0.02;
      shadow.scale.x = 1.05 - orbGroup.position.y * 0.12;
      shadow.scale.y = 0.42 - orbGroup.position.y * 0.03;
      shadow.material.opacity = 0.22 - orbGroup.position.y * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.dispose();

      orbGeometry.dispose();
      orbMaterial.dispose();
      facePlate.geometry.dispose();
      const facePlateMaterial = facePlate.material;
      facePlateMaterial.dispose();
      iconPlate.geometry.dispose();
      const iconPlateMaterial = iconPlate.material;
      iconPlateMaterial.dispose();
      const iconBadgeMaterial = iconBadge.material;
      iconBadgeMaterial.dispose();
      iconTexture.dispose();
      ring.geometry.dispose();
      const ringMaterial = ring.material;
      ringMaterial.dispose();
      shadow.geometry.dispose();
      const shadowMaterial = shadow.material;
      shadowMaterial.dispose();
      innerGlow.geometry.dispose();
      const innerGlowMaterial = innerGlow.material;
      innerGlowMaterial.dispose();
      halo.geometry.dispose();
      const haloMaterial = halo.material;
      haloMaterial.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none h-full w-full", className)}
      aria-hidden="true"
    />
  );
};
