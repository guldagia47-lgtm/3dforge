import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { cn } from "@/utils/cn";

type ModelFormat = "GLB" | "GLTF" | "OBJ" | "STL" | "Unknown";

type ModelViewerProps = {
  modelUrl?: string | null;
  title?: string;
  className?: string;
  allowUpload?: boolean;
};

type SourceState = {
  url: string;
  name: string;
  format: ModelFormat;
  origin: "remote" | "local";
};

function detectFormat(source: string): ModelFormat {
  const lowered = source.toLowerCase().split("?")[0].split("#")[0];

  if (lowered.endsWith(".glb")) {
    return "GLB";
  }

  if (lowered.endsWith(".gltf")) {
    return "GLTF";
  }

  if (lowered.endsWith(".obj")) {
    return "OBJ";
  }

  if (lowered.endsWith(".stl")) {
    return "STL";
  }

  return "Unknown";
}

function sourceLabel(source: string) {
  try {
    const url = new URL(source, window.location.href);
    return url.pathname.split("/").filter(Boolean).at(-1) ?? source;
  } catch {
    return source.split("/").filter(Boolean).at(-1) ?? source;
  }
}

function createSource(url: string, origin: "remote" | "local"): SourceState {
  return {
    url,
    name: sourceLabel(url),
    format: detectFormat(url),
    origin,
  };
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child: THREE.Object3D) => {
    const mesh = child as THREE.Mesh;

    if (mesh.isMesh) {
      mesh.geometry.dispose();
      if (mesh.material) {
        disposeMaterial(mesh.material);
      }
    }
  });
}

function frameObject(object: THREE.Object3D, camera: THREE.PerspectiveCamera, controls: OrbitControls) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 1);

  object.position.sub(center);

  const distance = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

  camera.near = Math.max(maxDim / 100, 0.01);
  camera.far = Math.max(maxDim * 20, 100);
  camera.position.set(distance * 0.95, distance * 0.45, distance * 1.1);
  camera.updateProjectionMatrix();

  controls.target.set(0, 0, 0);
  controls.minDistance = Math.max(maxDim * 0.25, 0.5);
  controls.maxDistance = Math.max(maxDim * 8, 24);
  controls.update();
}

async function loadSource(source: SourceState): Promise<THREE.Object3D> {
  if (source.format === "GLB" || source.format === "GLTF") {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(source.url);
    return gltf.scene;
  }

  if (source.format === "OBJ") {
    const loader = new OBJLoader();
    return loader.loadAsync(source.url);
  }

  if (source.format === "STL") {
    const loader = new STLLoader();
    const geometry = await loader.loadAsync(source.url);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc4b5fd,
      metalness: 0.12,
      roughness: 0.34,
      flatShading: true,
    });

    return new THREE.Mesh(geometry, material);
  }

  throw new Error("Unsupported model format. Use GLB, GLTF, OBJ, or STL.");
}

export default function ModelViewer({ modelUrl = null, title = "3D Viewer", className, allowUpload = true }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentObjectRef = useRef<THREE.Object3D | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const frameRef = useRef<number | null>(null);

  const [source, setSource] = useState<SourceState | null>(modelUrl ? createSource(modelUrl, "remote") : null);
  const [loading, setLoading] = useState(Boolean(modelUrl));
  const [error, setError] = useState<string | null>(null);

  const hint = useMemo(() => {
    if (!source) {
      return "Load a GLB, GLTF, OBJ, or STL file to inspect it in 3D.";
    }

    return `Drag to rotate. Scroll to zoom. Currently showing ${source.name}.`;
  }, [source]);

  useEffect(() => {
    setSource(modelUrl ? createSource(modelUrl, "remote") : null);
  }, [modelUrl]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.Fog(0x020617, 12, 40);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || 800, container.clientHeight || 480, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.6;

    const ambient = new THREE.AmbientLight(0xffffff, 1.6);
    const keyLight = new THREE.DirectionalLight(0xa5b4fc, 2.4);
    keyLight.position.set(6, 8, 10);
    const fillLight = new THREE.DirectionalLight(0x67e8f9, 1.4);
    fillLight.position.set(-6, 2, 8);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, -4, -8);

    scene.add(ambient, keyLight, fillLight, rimLight);

    container.appendChild(renderer.domElement);

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 480;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });

    resizeObserver.observe(container);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const animate = () => {
      frameRef.current = window.requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      resizeObserver.disconnect();

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (currentObjectRef.current) {
        scene.remove(currentObjectRef.current);
        disposeObject(currentObjectRef.current);
        currentObjectRef.current = null;
      }

      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const activeSource = source;

    if (!scene || !camera || !controls) {
      return;
    }

    if (!activeSource) {
      if (currentObjectRef.current) {
        scene.remove(currentObjectRef.current);
        disposeObject(currentObjectRef.current);
        currentObjectRef.current = null;
      }

      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadModel() {
      setLoading(true);
      setError(null);

      const resolvedScene = scene!;
      const resolvedCamera = camera!;
      const resolvedControls = controls!;

      try {
        const object = await loadSource(activeSource as SourceState);

        if (cancelled) {
          disposeObject(object);
          return;
        }

        if (currentObjectRef.current) {
          resolvedScene.remove(currentObjectRef.current);
          disposeObject(currentObjectRef.current);
        }

        object.traverse((child: THREE.Object3D) => {
          const mesh = child as THREE.Mesh;

          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (!mesh.material) {
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0xc4b5fd,
                metalness: 0.16,
                roughness: 0.36,
              });
            }
          }
        });

        frameObject(object, resolvedCamera, resolvedControls);
        resolvedScene.add(object);
        currentObjectRef.current = object;
        setLoading(false);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        if (currentObjectRef.current) {
          resolvedScene.remove(currentObjectRef.current);
          disposeObject(currentObjectRef.current);
          currentObjectRef.current = null;
        }

        setError(loadError instanceof Error ? loadError.message : "The model could not be loaded.");
        setLoading(false);
      }
    }

    void loadModel();

    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    []
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setSource({ url: objectUrl, name: file.name, format: detectFormat(file.name), origin: "local" });
  }

  return (
    <section className={cn("glass-panel overflow-hidden rounded-[2rem]", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-lg font-medium text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{hint}</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">Rotate</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">Zoom</span>
          {source ? (
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">
              {source.format}
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative h-[28rem] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_rgba(2,6,23,0.95)_55%)]">
        <div ref={containerRef} className="absolute inset-0" />

        {!source ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-400">
            <div className="max-w-xs space-y-2 rounded-3xl border border-white/10 bg-slate-950/55 px-5 py-6 backdrop-blur">
              <p className="font-medium text-white">No model loaded</p>
              <p>Upload a GLB, GLTF, OBJ, or STL file to inspect it in the browser.</p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="absolute inset-x-0 top-0 flex items-center justify-center border-b border-white/10 bg-slate-950/60 px-4 py-3 text-xs uppercase tracking-[0.28em] text-indigo-100 backdrop-blur">
            Loading model...
          </div>
        ) : null}

        {error ? (
          <div className="absolute inset-x-0 bottom-0 border-t border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 backdrop-blur">
            {error}
          </div>
        ) : null}
      </div>

      {allowUpload ? (
        <div className="border-t border-white/10 px-5 py-4">
          <label className="block space-y-2 text-sm text-slate-300">
            <span className="font-medium text-white">Preview a local model</span>
            <input
              type="file"
              accept=".glb,.gltf,.obj,.stl,model/gltf-binary,model/gltf+json"
              onChange={handleFileChange}
              className="block w-full rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950 hover:file:bg-indigo-100"
            />
          </label>
        </div>
      ) : null}
    </section>
  );
}