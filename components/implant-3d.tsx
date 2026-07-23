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
  // Temporary visual stand-in based on the official Riellen's Reaction
  // reference: root-shaped body, open conical connection and compact thread
  // profile. Replace this group with the manufacturer's GLB when supplied.
  const implant = new THREE.Group();
  const titanium = new THREE.MeshPhysicalMaterial({
    color: 0x34373a,
    metalness: 0.94,
    roughness: 0.27,
    clearcoat: 0.28,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.35,
  });
  const threadMetal = titanium.clone();
  threadMetal.color.setHex(0x1f2225);
  threadMetal.roughness = 0.34;
  const innerConnection = new THREE.MeshPhysicalMaterial({
    color: 0x6e294f,
    metalness: 0.62,
    roughness: 0.22,
    clearcoat: 0.2,
    envMapIntensity: 1.1,
  });
  const detail = isMobile ? 24 : 36;

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.43, 0.31, 2.7, detail, 1, false),
    titanium,
  );
  core.position.y = -0.08;
  implant.add(core);

  // Subtle platform shoulder; unlike the previous version this does not
  // create a tall abutment and keeps the silhouette close to the product.
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.43, 0.18, detail),
    titanium,
  );
  platform.position.y = 1.27;
  implant.add(platform);

  // Open conical connection, visible from the slight elevated camera angle.
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.31, 0.065, 10, detail),
    titanium,
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.39;
  implant.add(rim);
  const connection = new THREE.Mesh(
    new THREE.CylinderGeometry(0.245, 0.285, 0.035, 6),
    innerConnection,
  );
  connection.position.y = 1.4;
  implant.add(connection);

  // Individual low-profile rings read more like a machined dental thread
  // than a smooth wire helix and cost less on mobile GPUs.
  const ringCount = isMobile ? 14 : 18;
  for (let index = 0; index < ringCount; index += 1) {
    const progress = index / (ringCount - 1);
    const y = -1.34 + progress * 2.55;
    const radius = 0.335 + progress * 0.055;
    const minor = progress < 0.26 ? 0.068 : 0.052;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, minor, 8, isMobile ? 20 : 28),
      threadMetal,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    implant.add(ring);
  }

  const apex = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 0.34, isMobile ? 20 : 28),
    threadMetal,
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
  // Keep the full temporary implant visible; the scroll animation adds depth
  // through rotation and a restrained zoom instead of cropping the silhouette.
  camera.position.set(0.1, 0.08, isMobile ? 7.65 : 7.45);

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
    .to(state, { rotation: Math.PI * 2, cameraZ: isMobile ? 7.2 : 6.95, cameraX: 0.16, lift: 0.08, duration: 0.55 })
    .to(state, { rotation: Math.PI * 2.85, rotationX: -0.02, cameraZ: isMobile ? 6.9 : 6.65, cameraX: -0.1, cameraY: 0.05, lift: -0.08, duration: 0.45 });

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
