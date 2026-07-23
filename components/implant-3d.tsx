"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useEffect, useRef, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

type ImplantCanvasProps = {
  /** Pass a real .glb path when the manufacturer model is available. */
  modelUrl?: string;
  triggerRef?: RefObject<HTMLElement | null>;
};

type SceneCleanup = () => void;

function createProceduralImplant(isMobile: boolean) {
  const implant = new THREE.Group();
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xb7bec1,
    metalness: 0.96,
    roughness: 0.2,
    clearcoat: 0.32,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.5,
  });
  const darkMetal = metal.clone();
  darkMetal.color.setHex(0x8f989b);
  darkMetal.roughness = 0.28;

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.38, 2.55, isMobile ? 24 : 36, 1, false),
    metal,
  );
  core.position.y = -0.15;
  implant.add(core);

  const shoulder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.49, 0.25, isMobile ? 24 : 36),
    metal,
  );
  shoulder.position.y = 1.14;
  implant.add(shoulder);

  const connector = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.45, 0.68, isMobile ? 24 : 36),
    metal,
  );
  connector.position.y = 1.56;
  implant.add(connector);

  const connectorTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.36, 0.1, isMobile ? 24 : 36),
    darkMetal,
  );
  connectorTop.position.y = 1.95;
  implant.add(connectorTop);

  // A TubeGeometry helix keeps the temporary model lightweight while giving
  // the same visual language as a real threaded implant.
  const points: THREE.Vector3[] = [];
  const segments = isMobile ? 150 : 260;
  const turns = 13;
  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const angle = progress * Math.PI * 2 * turns;
    const taper = 0.52 - progress * 0.12;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * taper,
        -1.48 + progress * 2.72,
        Math.sin(angle) * taper,
      ),
    );
  }

  const threadCurve = new THREE.CatmullRomCurve3(points);
  const thread = new THREE.Mesh(
    new THREE.TubeGeometry(threadCurve, segments, isMobile ? 0.045 : 0.055, 7, false),
    metal,
  );
  implant.add(thread);

  const apex = new THREE.Mesh(
    new THREE.ConeGeometry(0.26, 0.38, isMobile ? 20 : 28),
    darkMetal,
  );
  apex.position.y = -1.68;
  implant.add(apex);

  implant.rotation.x = 0.025;
  return implant;
}

function fitModelToView(model: THREE.Object3D) {
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);
  const scale = 3.7 / maxSize;
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));
}

function mountImplantScene(
  host: HTMLDivElement,
  trigger: HTMLElement,
  modelUrl?: string,
): SceneCleanup {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  canvas.className = "relative z-10 h-full w-full";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x0b0c0c, 0.06);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0.1, 0.08, isMobile ? 6.3 : 5.8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  scene.environment = pmrem.fromScene(environment, 0.04).texture;
  environment.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xe8edf0, 0x080909, 1.15));
  const key = new THREE.DirectionalLight(0xfff4e8, 2.7);
  key.position.set(3.2, 4, 4.5);
  scene.add(key);
  const rim = new THREE.PointLight(0xe3bb9d, 4.4, 7);
  rim.position.set(-2.8, 0.8, -1.8);
  scene.add(rim);
  const fill = new THREE.PointLight(0xb8d5e8, 2, 8);
  fill.position.set(2.6, -0.8, 2.5);
  scene.add(fill);

  const modelRoot = new THREE.Group();
  const procedural = createProceduralImplant(isMobile);
  modelRoot.add(procedural);
  scene.add(modelRoot);

  // A real manufacturer model replaces the procedural model without changing
  // the animation timeline or any page markup.
  if (modelUrl) {
    new GLTFLoader().load(
      modelUrl,
      (gltf) => {
        const loaded = gltf.scene;
        fitModelToView(loaded);
        procedural.visible = false;
        modelRoot.add(loaded);
      },
      undefined,
      (error) => {
        console.warn("Implant GLB could not be loaded; using procedural model.", error);
      },
    );
  }

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(1.35, isMobile ? 32 : 64),
    new THREE.MeshBasicMaterial({
      color: 0xd9b49c,
      transparent: true,
      opacity: 0.06,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.92;
  scene.add(floor);

  const state = {
    rotation: 0,
    rotationX: 0.025,
    cameraZ: camera.position.z,
    cameraX: camera.position.x,
    cameraY: camera.position.y,
    lift: 0,
  };
  const interaction = { rotation: 0 };

  const applyState = () => {
    modelRoot.rotation.y = state.rotation + interaction.rotation;
    modelRoot.rotation.x = state.rotationX;
    modelRoot.position.y = state.lift;
    camera.position.set(state.cameraX, state.cameraY, state.cameraZ);
    camera.lookAt(0, 0.1, 0);
  };

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: reduceMotion
      ? undefined
      : {
          trigger,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
    onUpdate: applyState,
  });

  timeline
    .to(state, { rotation: Math.PI * 2, cameraZ: isMobile ? 5.8 : 4.7, cameraX: 0.16, lift: 0.08, duration: 0.55 })
    .to(state, { rotation: Math.PI * 2.85, rotationX: -0.02, cameraZ: isMobile ? 5.4 : 5.05, cameraX: -0.1, cameraY: 0.05, lift: -0.08, duration: 0.45 });

  applyState();

  // Horizontal drag adds an independent rotation offset on top of the
  // scroll-driven timeline. touch-action: pan-y preserves normal page scroll.
  host.style.cursor = "grab";
  host.style.touchAction = "pan-y";
  host.tabIndex = 0;
  let dragging = false;
  let lastPointerX = 0;
  let targetRotation = 0;
  const rotateTo = gsap.quickTo(interaction, "rotation", {
    duration: 0.42,
    ease: "power3.out",
    onUpdate: applyState,
  });

  const handlePointerDown = (event: PointerEvent) => {
    dragging = true;
    lastPointerX = event.clientX;
    host.style.cursor = "grabbing";
    host.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    const deltaX = event.clientX - lastPointerX;
    lastPointerX = event.clientX;
    targetRotation += deltaX * (isMobile ? 0.016 : 0.011);
    rotateTo(targetRotation);
  };
  const handlePointerUp = (event: PointerEvent) => {
    dragging = false;
    host.style.cursor = "grab";
    if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    targetRotation += event.key === "ArrowLeft" ? -0.32 : 0.32;
    rotateTo(targetRotation);
  };

  host.addEventListener("pointerdown", handlePointerDown);
  host.addEventListener("pointermove", handlePointerMove);
  host.addEventListener("pointerup", handlePointerUp);
  host.addEventListener("pointercancel", handlePointerUp);
  host.addEventListener("keydown", handleKeyDown);

  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  let frame = 0;
  const render = () => {
    frame = window.requestAnimationFrame(render);
    renderer.render(scene, camera);
  };
  render();
  host.querySelector<HTMLElement>("[data-implant-fallback]")?.classList.add("opacity-0");

  return () => {
    window.cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    host.removeEventListener("pointerdown", handlePointerDown);
    host.removeEventListener("pointermove", handlePointerMove);
    host.removeEventListener("pointerup", handlePointerUp);
    host.removeEventListener("pointercancel", handlePointerUp);
    host.removeEventListener("keydown", handleKeyDown);
    gsap.killTweensOf(interaction);
    timeline.scrollTrigger?.kill();
    timeline.kill();
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose());
      else if (mesh.material) mesh.material.dispose();
    });
    renderer.dispose();
    canvas.remove();
  };
}

export function ImplantCanvas({ modelUrl, triggerRef }: ImplantCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const trigger = triggerRef?.current ?? host;
    if (!host || !trigger) return;

    let cleanup: SceneCleanup | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        cleanup = mountImplantScene(host, trigger, modelUrl);
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(host);

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [modelUrl, triggerRef]);

  return (
    <div
      ref={hostRef}
      className="relative h-full w-full"
      aria-label="Интерактивная 3D-визуализация имплантата. Потяните мышью или пальцем, чтобы вращать"
      role="img"
    >
      <img
        data-implant-fallback
        src="/technology/implant-concept-v2.png"
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain p-6 opacity-90 transition-opacity duration-700"
      />
    </div>
  );
}
