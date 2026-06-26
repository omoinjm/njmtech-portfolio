"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

type NodeData = {
  id: string;
  category: string;
  level: number;
  x: number;
  y: number;
  z: number;
};

type NodeRuntime = {
  data: NodeData;
  nodeGroup: THREE.Group;
  logoGroup: THREE.Group;
  ring: THREE.Mesh;
  sprite: THREE.Sprite;
  spriteTexture: THREE.CanvasTexture;
};

type EdgeRuntime = {
  fromId: string;
  index: number;
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  toId: string;
};

const NODES: NodeData[] = [
  // Frontend — color #3b82f6
  { id: "React", category: "frontend", level: 95, x: -2.2, y: 1.2, z: 0.3 },
  { id: "Next.js", category: "frontend", level: 93, x: -1.0, y: 2.0, z: -0.5 },
  { id: "Angular", category: "frontend", level: 85, x: -2.8, y: 0.0, z: -0.8 },
  {
    id: "TypeScript",
    category: "frontend",
    level: 90,
    x: -1.5,
    y: 0.2,
    z: 1.0,
  },

  // Backend — color #8b5cf6
  { id: "C#", category: "backend", level: 88, x: 0.5, y: 1.5, z: 0.0 },
  { id: "Python", category: "backend", level: 85, x: 1.8, y: 1.0, z: 0.8 },
  { id: "Node.js", category: "backend", level: 87, x: 0.8, y: -0.5, z: 1.2 },
  {
    id: "GraphQL",
    category: "backend",
    level: 75,
    x: 2.0,
    y: -0.2,
    z: -0.3,
  },

  // DevOps — color #f59e0b
  { id: "Docker", category: "devops", level: 80, x: -0.5, y: -1.8, z: -0.5 },
  { id: "Azure", category: "devops", level: 80, x: 0.8, y: -2.2, z: 0.2 },
  {
    id: "Kubernetes",
    category: "devops",
    level: 72,
    x: -1.5,
    y: -1.5,
    z: 0.8,
  },
  { id: "CI/CD", category: "devops", level: 78, x: 0.0, y: -1.0, z: -1.5 },

  // Database — color #10b981
  {
    id: "PostgreSQL",
    category: "database",
    level: 82,
    x: 2.5,
    y: 0.5,
    z: -1.0,
  },
  {
    id: "MongoDB",
    category: "database",
    level: 78,
    x: 2.8,
    y: -1.0,
    z: 0.5,
  },
  {
    id: "Redis",
    category: "database",
    level: 70,
    x: 1.5,
    y: -1.5,
    z: -1.2,
  },
];

const EDGES: [string, string][] = [
  // Frontend cluster
  ["React", "Next.js"],
  ["React", "TypeScript"],
  ["Angular", "TypeScript"],
  ["Next.js", "TypeScript"],
  // Backend cluster
  ["C#", "GraphQL"],
  ["Node.js", "GraphQL"],
  ["Python", "MongoDB"],
  // Cross-category bridges
  ["TypeScript", "Node.js"],
  ["TypeScript", "C#"],
  ["Node.js", "PostgreSQL"],
  ["Node.js", "MongoDB"],
  ["Docker", "Kubernetes"],
  ["Docker", "Azure"],
  ["Azure", "CI/CD"],
  ["Kubernetes", "CI/CD"],
  ["Docker", "C#"],
  ["Docker", "Node.js"],
  ["PostgreSQL", "C#"],
  ["PostgreSQL", "Python"],
  ["Redis", "Node.js"],
  ["Redis", "Azure"],
  ["GraphQL", "React"],
  ["GraphQL", "TypeScript"],
];

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "#3b82f6",
  backend: "#8b5cf6",
  devops: "#f59e0b",
  database: "#10b981",
};

const TECH_ICONS: Record<string, string> = {
  React: "/tech-icons/react.svg",
  "Next.js": "/tech-icons/nextjs.svg",
  Angular: "/tech-icons/angular.svg",
  TypeScript: "/tech-icons/typescript.svg",
  "C#": "/tech-icons/csharp.svg",
  Python: "/tech-icons/python.svg",
  "Node.js": "/tech-icons/nodejs.svg",
  GraphQL: "/tech-icons/graphql.svg",
  Docker: "/tech-icons/docker.svg",
  Azure: "/tech-icons/azure.svg",
  Kubernetes: "/tech-icons/kubernetes.svg",
  "CI/CD": "/tech-icons/github.svg",
  PostgreSQL: "/tech-icons/postgresql.svg",
  MongoDB: "/tech-icons/mongodb.svg",
  Redis: "/tech-icons/redis.svg",
};

const createLabelTexture = (
  nodeData: NodeData,
): THREE.CanvasTexture | null => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(nodeData.id, 256, 10);

  const barX = 56;
  const barY = 88;
  const barWidth = 400;
  const barHeight = 14;
  const fillWidth = (nodeData.level / 100) * barWidth;

  ctx.fillStyle = "rgba(100,100,100,0.5)";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = CATEGORY_COLORS[nodeData.category];
  ctx.fillRect(barX, barY, fillWidth, barHeight);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

function makeFallbackSphere(color: string): THREE.Group {
  const g = new THREE.Group();
  g.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25,
      }),
    ),
  );
  return g;
}

function buildLogoGroup(svgText: string, categoryColor: string): THREE.Group {
  const group = new THREE.Group();

  // Replace gradient/pattern URL fills with the category colour so
  // SVGLoader (which doesn't support CSS gradients) gets a solid fill.
  const sanitized = svgText.replace(/fill="url\([^)]+\)"/g, `fill="${categoryColor}"`);

  const svgData = (() => {
    try {
      return new SVGLoader().parse(sanitized);
    } catch {
      return null;
    }
  })();

  if (!svgData) return makeFallbackSphere(categoryColor);

  // Collect all shapes and compute combined bounding box
  const shapeEntries: { shape: THREE.Shape; path: (typeof svgData.paths)[number] }[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const path of svgData.paths) {
    for (const shape of SVGLoader.createShapes(path)) {
      shapeEntries.push({ shape, path });
      for (const pt of shape.getPoints(12)) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }
    }
  }

  if (shapeEntries.length === 0) return makeFallbackSphere(categoryColor);

  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;
  const scale = 0.9 / Math.max(svgWidth, svgHeight, 0.001);
  const offsetX = -((minX + maxX) / 2) * scale;
  const offsetY = ((minY + maxY) / 2) * scale;

  for (const { shape, path } of shapeEntries) {
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    });

    // Flip Y (SVG Y-axis is inverted relative to Three.js) then center
    geom.scale(scale, -scale, 1);
    geom.translate(offsetX, offsetY, 0);

    const colorHex = path.color.getHex();
    const usePathColor = colorHex > 0x111111 && colorHex !== 0xffffff;
    const matColor = usePathColor
      ? path.color.clone()
      : new THREE.Color(categoryColor);

    const mat = new THREE.MeshStandardMaterial({
      color: matColor,
      emissive: matColor,
      emissiveIntensity: 0.25,
      metalness: 0.3,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });

    group.add(new THREE.Mesh(geom, mat));
  }

  return group;
}

export const SkillsGraphScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;
    if (!container) return undefined;

    // --- Scene ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
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
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.8);
    const dirLight = new THREE.DirectionalLight("#ffffff", 1.5);
    dirLight.position.set(5, 5, 5);
    const pl1 = new THREE.PointLight("#3b82f6", 1.5);
    pl1.position.set(-4, 2, 3);
    const pl2 = new THREE.PointLight("#8b5cf6", 1.2);
    pl2.position.set(4, -2, 2);
    const pl3 = new THREE.PointLight("#10b981", 1.0);
    pl3.position.set(0, -4, 3);
    scene.add(ambientLight, dirLight, pl1, pl2, pl3);

    // --- Graph group ---
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // --- Runtime state (populated asynchronously) ---
    const nodeRuntimes: NodeRuntime[] = [];
    const nodeGroupMap = new Map<THREE.Object3D, NodeRuntime>();
    const edgeRuntimes: EdgeRuntime[] = [];
    let allLogoMeshes: THREE.Mesh[] = [];

    // --- Interaction state ---
    let targetRotationY = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let hoveredNode: NodeRuntime | null = null;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      lastPointerX = event.clientX;
      container.style.cursor = "grabbing";
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - lastPointerX;
        targetRotationY += deltaX * 0.008;
        lastPointerX = event.clientX;
        return;
      }

      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(allLogoMeshes, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        // mesh → logoGroup → nodeGroup
        const hitNodeGroup = hitMesh.parent?.parent as THREE.Group | undefined;
        const hitRuntime = hitNodeGroup
          ? (nodeGroupMap.get(hitNodeGroup) ?? null)
          : null;
        if (hitRuntime !== hoveredNode) {
          hoveredNode = hitRuntime;
          container.style.cursor = hitRuntime ? "pointer" : "auto";
        }
      } else {
        if (hoveredNode !== null) {
          hoveredNode = null;
          container.style.cursor = "auto";
        }
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      container.style.cursor = hoveredNode ? "pointer" : "auto";
    };

    const handlePointerLeave = () => {
      if (!isDragging) {
        hoveredNode = null;
        container.style.cursor = "auto";
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerup", handlePointerUp);

    // --- Tooltip ---
    const tooltip = document.createElement("div");
    tooltip.style.cssText =
      "position: absolute; pointer-events: none; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 8px 14px; font-family: Inter, sans-serif; color: white; font-size: 13px; white-space: nowrap; transition: opacity 0.15s; opacity: 0;";
    container.appendChild(tooltip);

    // --- Animation loop (starts immediately; nodes are added async) ---
    let animationFrame = 0;
    let previousTime = performance.now() / 1000;
    const startTime = previousTime;
    const worldPos = new THREE.Vector3();
    const tempEmissive = new THREE.Color();

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const now = performance.now() / 1000;
      const elapsed = now - startTime;
      const delta = Math.min(now - previousTime, 0.05);
      previousTime = now;

      // Auto-orbit when not dragging
      if (!isDragging) {
        targetRotationY += delta * 0.12;
      }

      // Lerp group rotation toward target
      graphGroup.rotation.y +=
        (targetRotationY - graphGroup.rotation.y) * (1 - Math.exp(-delta * 3));

      // Billboard all rings to camera
      for (const { ring } of nodeRuntimes) {
        ring.quaternion.copy(camera.quaternion);
      }

      // Slow self-rotation of each logo
      for (const { logoGroup } of nodeRuntimes) {
        logoGroup.rotation.y += delta * 0.4;
      }

      // Animate edges
      for (const { material, index, fromId, toId } of edgeRuntimes) {
        const isConnected =
          hoveredNode !== null &&
          (hoveredNode.data.id === fromId || hoveredNode.data.id === toId);

        if (isConnected && hoveredNode) {
          material.opacity = 0.7;
          material.color.set(CATEGORY_COLORS[hoveredNode.data.category]);
        } else {
          material.opacity =
            Math.sin(elapsed * 1.5 + index * 0.4) * 0.05 + 0.15;
          material.color.set("#ffffff");
        }
      }

      // Animate node scale (hover/dim) and emissive intensity
      for (const { nodeGroup, logoGroup, data } of nodeRuntimes) {
        const isHovered =
          hoveredNode !== null && hoveredNode.data.id === data.id;
        const isDimmed =
          hoveredNode !== null && hoveredNode.data.id !== data.id;

        const targetScale = isHovered ? 1.5 : isDimmed ? 0.9 : 1.0;
        nodeGroup.scale.x = THREE.MathUtils.damp(
          nodeGroup.scale.x,
          targetScale,
          6,
          delta,
        );
        nodeGroup.scale.y = THREE.MathUtils.damp(
          nodeGroup.scale.y,
          targetScale,
          6,
          delta,
        );
        nodeGroup.scale.z = THREE.MathUtils.damp(
          nodeGroup.scale.z,
          targetScale,
          6,
          delta,
        );

        const targetEmissiveStrength = isHovered ? 0.9 : isDimmed ? 0.1 : 0.25;
        logoGroup.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            const mat = obj.material as THREE.MeshStandardMaterial;
            tempEmissive
              .set(CATEGORY_COLORS[data.category])
              .multiplyScalar(targetEmissiveStrength);
            mat.emissive.lerp(tempEmissive, 1 - Math.exp(-delta * 6));
          }
        });
      }

      // Tooltip positioning
      if (hoveredNode) {
        hoveredNode.nodeGroup.getWorldPosition(worldPos);
        worldPos.project(camera);
        const screenX = (worldPos.x * 0.5 + 0.5) * container.clientWidth;
        const screenY = (-worldPos.y * 0.5 + 0.5) * container.clientHeight;
        const catColor = CATEGORY_COLORS[hoveredNode.data.category];
        tooltip.innerHTML = `<strong>${hoveredNode.data.id}</strong><br><span style="color: ${catColor}">Level ${hoveredNode.data.level}</span>`;
        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        const cx = Math.max(
          8,
          Math.min(container.clientWidth - tw - 8, screenX - tw / 2),
        );
        const cy = Math.max(
          8,
          Math.min(container.clientHeight - th - 8, screenY - th - 16),
        );
        tooltip.style.left = `${cx}px`;
        tooltip.style.top = `${cy}px`;
        tooltip.style.opacity = "1";
      } else {
        tooltip.style.opacity = "0";
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Async: fetch SVGs and build nodes / edges ---
    const buildScene = async () => {
      const results = await Promise.allSettled(
        NODES.map((nd) => {
          const url = TECH_ICONS[nd.id];
          return url
            ? fetch(url).then((r) => r.text())
            : Promise.reject(new Error(`No icon for ${nd.id}`));
        }),
      );

      if (!isMounted) return;

      const nodeMap = new Map<string, NodeRuntime>();

      for (let i = 0; i < NODES.length; i++) {
        const nodeData = NODES[i];
        const result = results[i];
        const color = CATEGORY_COLORS[nodeData.category];

        const logoGroup =
          result.status === "fulfilled"
            ? buildLogoGroup(result.value, color)
            : makeFallbackSphere(color);

        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(nodeData.x * 2.4, nodeData.y * 2.4, nodeData.z * 2.4);
        nodeGroup.add(logoGroup);

        // Soft glow sphere behind the logo
        nodeGroup.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(0.52, 16, 16),
            new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity: 0.12,
            }),
          ),
        );

        graphGroup.add(nodeGroup);

        // Billboard ring — lives directly in graphGroup so it can be
        // quaternion-copied to camera each frame
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.58, 0.66, 32),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        ring.position.set(nodeData.x * 2.4, nodeData.y * 2.4, nodeData.z * 2.4);
        graphGroup.add(ring);

        // Label sprite
        const spriteTex = createLabelTexture(nodeData);
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: spriteTex,
            transparent: true,
            depthWrite: false,
          }),
        );
        sprite.position.set(nodeData.x * 2.4, nodeData.y * 2.4 + 1.1, nodeData.z * 2.4);
        sprite.scale.set(2.4, 0.6, 1);
        graphGroup.add(sprite);

        const runtime: NodeRuntime = {
          data: nodeData,
          nodeGroup,
          logoGroup,
          ring,
          sprite,
          spriteTexture:
            spriteTex ??
            new THREE.CanvasTexture(document.createElement("canvas")),
        };
        nodeRuntimes.push(runtime);
        nodeMap.set(nodeData.id, runtime);
        nodeGroupMap.set(nodeGroup, runtime);
      }

      // Precompute all logo meshes for raycasting
      allLogoMeshes = [];
      for (const { logoGroup: lg } of nodeRuntimes) {
        lg.traverse((obj) => {
          if (obj instanceof THREE.Mesh) allLogoMeshes.push(obj);
        });
      }

      // Build edges
      EDGES.forEach(([fromId, toId], index) => {
        const fromNode = nodeMap.get(fromId);
        const toNode = nodeMap.get(toId);
        if (!fromNode || !toNode) return;

        const points = [
          new THREE.Vector3(fromNode.data.x * 2.4, fromNode.data.y * 2.4, fromNode.data.z * 2.4),
          new THREE.Vector3(toNode.data.x * 2.4, toNode.data.y * 2.4, toNode.data.z * 2.4),
        ];
        const edgeGeo = new THREE.BufferGeometry().setFromPoints(points);
        const edgeMat = new THREE.LineBasicMaterial({
          color: "#ffffff",
          transparent: true,
          opacity: 0.15,
        });
        const line = new THREE.Line(edgeGeo, edgeMat);
        graphGroup.add(line);
        edgeRuntimes.push({ line, material: edgeMat, fromId, toId, index });
      });
    };

    buildScene();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );

      for (const { nodeGroup, ring, sprite, spriteTexture } of nodeRuntimes) {
        nodeGroup.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const mats = Array.isArray(obj.material)
              ? obj.material
              : [obj.material];
            mats.forEach((m) => (m as THREE.Material).dispose());
          }
        });
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
        spriteTexture.dispose();
        (sprite.material as THREE.SpriteMaterial).dispose();
      }

      for (const { line, material } of edgeRuntimes) {
        line.geometry.dispose();
        material.dispose();
      }

      tooltip.remove();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      aria-hidden="true"
    />
  );
};
