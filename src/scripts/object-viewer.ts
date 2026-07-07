import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Model credits (CC-BY unless noted):
//   folder.glb  — "Folder" by reyshapes (poly.pizza/m/emdPCRNhTX, CC0), recolored
//   coffee.glb  — "Coffee cup" by Poly by Google (poly.pizza/m/fIuM_PW5prV)
//   macbook.glb — "macbook pro M3 16 inch 2024" by jackbaeten (sketchfab.com/jackbaeten)
//   iphone.glb  — "iPhone 15 Pro Max" by MpPower™ (sketchfab.com/MG990)

function recolor(model: THREE.Object3D, hex: number): void {
  model.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      (o as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.55, metalness: 0.05 });
    }
  });
}

/** Center a model and wrap it in a group scaled so its largest dimension is `targetSize`. */
function frameModel(model: THREE.Object3D, targetSize = 1.6): THREE.Group {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const group = new THREE.Group();
  group.add(model);
  group.scale.setScalar(targetSize / Math.max(size.x, size.y, size.z));
  return group;
}

export type ObjectKind = 'folder' | 'iphone' | 'coffee' | 'macbook';

interface ObjectConfig {
  source: { glb: string; setup?: (model: THREE.Object3D) => void };
  /** resting orientation [x, y, z]; idle spin advances around Y from here */
  pose: [number, number, number];
  /** framed size of the largest dimension — tuned per object so all four read
   *  as the same visual weight (boxy/tall shapes otherwise look inflated) */
  size: number;
  /** PBR models (real metals/glass) need an environment map to read well */
  env?: boolean;
}

const OBJECTS: Record<ObjectKind, ObjectConfig> = {
  folder: { source: { glb: '/models/folder.glb', setup: (m) => recolor(m, 0x6fbbff) }, pose: [0.15, 0.9, -0.14], size: 1.35 },
  iphone: { source: { glb: '/models/iphone.glb' }, pose: [0.08, 0.3, 0], size: 1.5, env: true },
  coffee: { source: { glb: '/models/coffee.glb' }, pose: [0.1, 0.5, 0.1], size: 1.3 },
  macbook: { source: { glb: '/models/macbook.glb' }, pose: [0.12, 0.6, 0], size: 1.75, env: true },
};

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

/** studio-style environment for PBR models — per renderer, since GPU
 *  textures can't be shared across WebGL contexts */
function envMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return tex;
}

const IDLE_SPIN = 0.5;   // rad/s
const HOVER_SPIN = 2.2;  // rad/s
const HOVER_LIFT = 0.12;
const BOB = 0.06;

/** Mount a floating, rotating object into a canvas. Hover (on `hoverTarget`,
 *  default the canvas's parent link) spins it faster and lifts it.
 *  `opts.recolor` overrides the model's material color (used by the stack page
 *  to render the folder in several colors).
 *  `opts.fit` (< 1) shrinks the object within the frame so no corner leaves
 *  the camera view while it spins — use with a bigger canvas to keep size. */
export function mountObject(
  canvas: HTMLCanvasElement,
  kind: ObjectKind,
  hoverTarget?: HTMLElement,
  opts?: { recolor?: number; fit?: number }
): void {
  const cfg = OBJECTS[kind];
  const fit = opts?.fit ?? 1;
  const sizePx = canvas.clientWidth || 220;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(sizePx, sizePx, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  if (cfg.env) {
    // PBR models: the environment IS the lighting — adding the analytic
    // lights on top blows out the whites. Filmic tonemapping ≈ Sketchfab.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    scene.environment = envMap(renderer);
    const key = new THREE.DirectionalLight(0xffffff, 0.5);
    key.position.set(3, 5, 4);
    scene.add(key);
  } else {
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
  }
  camera.position.set(0, 0.45, 3.2);
  camera.lookAt(0, 0, 0);

  const ready = (model: THREE.Object3D) => {
    const group = frameModel(model, cfg.size * fit);
    scene.add(group);
    const [rx, ry, rz] = cfg.pose;

    // bottom-align every object to a common baseline so labels sit at a
    // consistent distance regardless of the object's height (the baseline
    // rises with `fit` so the front-bottom corner clears the frustum)
    group.rotation.set(rx, ry, rz);
    const bb = new THREE.Box3().setFromObject(group);
    const baseY = -0.78 * fit - bb.min.y;
    group.position.y = baseY;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      renderer.render(scene, camera);
      return;
    }

    let spin = IDLE_SPIN;
    let targetSpin = IDLE_SPIN;
    let lift = 0;
    let targetLift = 0;
    let angle = ry;
    let last = performance.now();
    const t0 = Math.random() * Math.PI * 2;

    const target = hoverTarget ?? canvas.parentElement ?? canvas;
    target.addEventListener('pointerenter', () => { targetSpin = HOVER_SPIN; targetLift = HOVER_LIFT; });
    target.addEventListener('pointerleave', () => { targetSpin = IDLE_SPIN; targetLift = 0; });

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      spin += (targetSpin - spin) * Math.min(dt * 6, 1);
      lift += (targetLift - lift) * Math.min(dt * 6, 1);
      angle += spin * dt;
      group.rotation.set(rx, angle, rz);
      group.position.y = baseY + Math.sin(now / 1000 * 1.5 + t0) * BOB + lift;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const { glb, setup } = cfg.source;
  loader.load(
    glb,
    (gltf) => {
      setup?.(gltf.scene);
      if (opts?.recolor !== undefined) recolor(gltf.scene, opts.recolor);
      ready(gltf.scene);
    },
    undefined,
    (err) => console.error(`[object-viewer] failed to load ${glb}`, err)
  );
}
