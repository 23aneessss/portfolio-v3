import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

// Model credits (CC-BY unless noted):
//   folder.glb  — "Folder" by reyshapes (poly.pizza/m/emdPCRNhTX, CC0), recolored
//   coffee.glb  — "Coffee cup" by Poly by Google (poly.pizza/m/fIuM_PW5prV)
//   macbook.glb — "Laptop / MacBook Pro" by Alex Safayan (poly.pizza/m/27hcX_w47Jb)
//   iPhone      — procedural, built here

const APPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>`;

function appleLogoMesh(color: number, size: number): THREE.Mesh {
  const svg = new SVGLoader().parse(APPLE_SVG);
  const shapes = svg.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ShapeGeometry(shapes);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const w = bb.max.x - bb.min.x;
  const h = bb.max.y - bb.min.y;
  geo.translate(-(bb.min.x + w / 2), -(bb.min.y + h / 2), 0);
  const s = size / h;
  geo.scale(s, -s, s); // flip Y: SVG space is y-down
  const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  return new THREE.Mesh(geo, mat);
}

/** Low-poly iPhone Pro built from primitives — titanium body, camera island, screen. */
function buildIphone(bodyColor = 0xb8b3ad): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.25, roughness: 0.55, flatShading: true });
  g.add(new THREE.Mesh(new RoundedBoxGeometry(0.74, 1.54, 0.085, 3, 0.1), mat));

  const islandMat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.3, roughness: 0.5, flatShading: true });
  const island = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.36, 0.05, 2, 0.07), islandMat);
  island.position.set(-0.155, 0.545, 0.045);
  g.add(island);

  for (const [x, y] of [[-0.235, 0.625], [-0.235, 0.465], [-0.075, 0.545]] as const) {
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.062, 0.035, 20),
      new THREE.MeshStandardMaterial({ color: 0x555558, metalness: 0.4, roughness: 0.4 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, y, 0.08);
    g.add(ring);
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.038, 20),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.1, roughness: 0.2 })
    );
    glass.rotation.x = Math.PI / 2;
    glass.position.set(x, y, 0.081);
    g.add(glass);
  }

  const flash = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 0.03, 12),
    new THREE.MeshStandardMaterial({ color: 0xf5edd8, roughness: 0.3 })
  );
  flash.rotation.x = Math.PI / 2;
  flash.position.set(-0.075, 0.655, 0.052);
  g.add(flash);

  const logo = appleLogoMesh(0xdedede, 0.17);
  logo.position.set(0, 0.08, 0.047);
  g.add(logo);

  const screen = new THREE.Mesh(
    new RoundedBoxGeometry(0.66, 1.46, 0.02, 3, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0f, metalness: 0.1, roughness: 0.25 })
  );
  screen.position.set(0, 0, -0.04);
  g.add(screen);

  const pill = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.022, 0.09, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.6 })
  );
  pill.rotation.z = Math.PI / 2;
  pill.position.set(0, 0.63, -0.052);
  g.add(pill);

  const btnMat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.3, roughness: 0.5 });
  const power = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.16, 0.03), btnMat);
  power.position.set(0.371, 0.28, 0);
  g.add(power);
  const vol1 = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.09, 0.03), btnMat);
  vol1.position.set(-0.371, 0.34, 0);
  g.add(vol1);
  const vol2 = vol1.clone();
  vol2.position.y = 0.21;
  g.add(vol2);

  return g;
}

/** Cover the hexagon hole in the MacBook lid with a lid-colored patch + Apple logo.
 *  Positions are in the GLB's model space; the inner dark plate protrudes to z -0.715. */
function decorateMacbook(model: THREE.Object3D): void {
  const patch = new THREE.Mesh(
    new THREE.CircleGeometry(0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0x79909e, roughness: 0.6, metalness: 0.1 })
  );
  patch.position.set(0.01, 0.87, -0.722);
  patch.rotation.y = Math.PI;
  model.add(patch);
  const logo = appleLogoMesh(0x232629, 0.26);
  logo.position.set(0.02, 0.88, -0.728);
  logo.rotation.y = Math.PI;
  model.add(logo);
}

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
  source: { glb: string; setup?: (model: THREE.Object3D) => void } | { build: () => THREE.Object3D };
  /** resting orientation [x, y, z]; idle spin advances around Y from here */
  pose: [number, number, number];
  /** framed size of the largest dimension — tuned per object so all four read
   *  as the same visual weight (boxy/tall shapes otherwise look inflated) */
  size: number;
}

const OBJECTS: Record<ObjectKind, ObjectConfig> = {
  folder: { source: { glb: '/models/folder.glb', setup: (m) => recolor(m, 0x6fbbff) }, pose: [0.15, 0.9, -0.14], size: 1.35 },
  iphone: { source: { build: () => buildIphone() }, pose: [0.08, 0.3, 0], size: 1.5 },
  coffee: { source: { glb: '/models/coffee.glb' }, pose: [0.1, 0.5, 0.1], size: 1.3 },
  macbook: { source: { glb: '/models/macbook.glb', setup: decorateMacbook }, pose: [0.12, 0.6 + Math.PI, 0], size: 1.75 },
};

const loader = new GLTFLoader();

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
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
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

  if ('glb' in cfg.source) {
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
  } else {
    ready(cfg.source.build());
  }
}
