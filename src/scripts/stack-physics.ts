/**
 * Folder-toy physics for the Tech Stack page.
 *
 * Each station is a 3D folder with a set of tech icons "living" inside it.
 * Hovering (or tapping) a folder makes its icons burst out and float around.
 * Each icon floats for ~10s; if it isn't dragged back into its folder in time,
 * gravity kicks in and it tumbles to the floor. Icons are draggable at any
 * moment — dropping one on its home folder puts it back.
 */
import Matter from 'matter-js';

export interface StackItem {
  name: string;
  icon: string;
}

export interface StationDef {
  /** hover/drop target — the folder wrapper element */
  el: HTMLElement;
  items: StackItem[];
}

const CHIP = 62; // icon card square, px
const FLOAT_MS = 10_000;
const DROP_MARGIN = 30; // px around the folder that still counts as "home"

interface Chip {
  el: HTMLDivElement;
  body: Matter.Body;
  station: StationDef;
  floatUntil: number;
  phase: number; // desyncs the drift wobble
}

function makeChipEl(item: StackItem): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'chip';
  el.title = item.name;
  const img = document.createElement('img');
  img.src = item.icon;
  img.alt = item.name;
  img.draggable = false;
  el.appendChild(img);
  return el;
}

function stationRect(st: StationDef): DOMRect {
  return st.el.getBoundingClientRect();
}

/** Static-list fallback when the visitor prefers reduced motion. */
function initStatic(root: HTMLElement, stations: StationDef[]): void {
  for (const st of stations) {
    const panel = document.createElement('div');
    panel.className = 'chip-panel';
    for (const item of st.items) {
      const chip = makeChipEl(item);
      panel.appendChild(chip);
    }
    panel.hidden = true;
    st.el.parentElement!.appendChild(panel);
    st.el.addEventListener('click', (e) => {
      e.preventDefault();
      panel.hidden = !panel.hidden;
    });
  }
}

export function initStackPhysics(root: HTMLElement, stations: StationDef[]): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initStatic(root, stations);
    return;
  }

  const engine = Matter.Engine.create();
  const world = engine.world;
  const gravityForceY = () => engine.gravity.y * engine.gravity.scale;

  // room bounds: floor at the bottom of the root, walls just outside the sides,
  // ceiling high above so throws can fly without escaping
  const statics = { floor: null as Matter.Body | null, left: null as Matter.Body | null, right: null as Matter.Body | null, top: null as Matter.Body | null };
  const buildBounds = () => {
    const w = root.clientWidth;
    const h = root.clientHeight;
    for (const key of ['floor', 'left', 'right', 'top'] as const) {
      const b = statics[key];
      if (b) Matter.World.remove(world, b);
    }
    statics.floor = Matter.Bodies.rectangle(w / 2, h + 25, w + 400, 50, { isStatic: true });
    statics.left = Matter.Bodies.rectangle(-25, h / 2 - 400, 50, h + 1600, { isStatic: true });
    statics.right = Matter.Bodies.rectangle(w + 25, h / 2 - 400, 50, h + 1600, { isStatic: true });
    statics.top = Matter.Bodies.rectangle(w / 2, -800, w + 400, 50, { isStatic: true });
    Matter.World.add(world, [statics.floor, statics.left, statics.right, statics.top]);
  };
  buildBounds();
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(buildBounds, 150);
  });

  const chips = new Set<Chip>();
  const home = new Map<StationDef, StackItem[]>();
  for (const st of stations) home.set(st, [...st.items]);

  const rootRect = () => root.getBoundingClientRect();

  const burst = (st: StationDef) => {
    const pending = home.get(st)!;
    if (!pending.length) return;
    const rr = rootRect();
    const fr = stationRect(st);
    const cx = fr.left - rr.left + fr.width / 2;
    const cy = fr.top - rr.top + fr.height / 3;
    pending.splice(0).forEach((item, i) => {
      const el = makeChipEl(item);
      el.style.transform = `translate(${cx - CHIP / 2}px, ${cy - CHIP / 2}px)`;
      root.appendChild(el);
      const body = Matter.Bodies.rectangle(cx, cy, CHIP, CHIP, {
        chamfer: { radius: 16 },
        restitution: 0.4,
        friction: 0.15,
        frictionAir: 0.02,
      });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 11,
        y: -(7 + Math.random() * 5),
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
      Matter.World.add(world, body);
      chips.add({
        el,
        body,
        station: st,
        floatUntil: performance.now() + FLOAT_MS + i * 250,
        phase: Math.random() * Math.PI * 2,
      });
    });
    st.el.dispatchEvent(new CustomEvent('stack:burst', { bubbles: true }));
  };

  for (const st of stations) {
    st.el.addEventListener('pointerenter', () => burst(st));
    st.el.addEventListener('click', (e) => {
      e.preventDefault();
      burst(st);
    });
  }

  // anti-gravity + gentle drift while an icon is still in its float window
  Matter.Events.on(engine, 'beforeUpdate', () => {
    const now = performance.now();
    for (const c of chips) {
      if (now < c.floatUntil) {
        const drift = Math.sin(now / 900 + c.phase) * 0.12;
        Matter.Body.applyForce(c.body, c.body.position, {
          x: drift * gravityForceY() * c.body.mass,
          y: -gravityForceY() * c.body.mass * (1 + Math.sin(now / 700 + c.phase) * 0.25),
        });
      }
    }
  });

  // dragging — listen on the parent (.room): the physics root itself has
  // pointer-events:none, so it never receives events over empty space
  const mouse = Matter.Mouse.create(root.parentElement ?? root);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  });
  Matter.World.add(world, mouseConstraint);

  const chipByBody = (body: Matter.Body) => {
    for (const c of chips) if (c.body === body) return c;
    return null;
  };

  const overHome = (c: Chip) => {
    const rr = rootRect();
    const fr = stationRect(c.station);
    const x = c.body.position.x + rr.left;
    const y = c.body.position.y + rr.top;
    return (
      x > fr.left - DROP_MARGIN &&
      x < fr.right + DROP_MARGIN &&
      y > fr.top - DROP_MARGIN &&
      y < fr.bottom + DROP_MARGIN
    );
  };

  Matter.Events.on(mouseConstraint, 'startdrag', (ev) => {
    const c = chipByBody((ev as unknown as { body: Matter.Body }).body);
    if (c) c.el.classList.add('dragging');
  });

  Matter.Events.on(mouseConstraint, 'enddrag', (ev) => {
    const c = chipByBody((ev as unknown as { body: Matter.Body }).body);
    if (!c) return;
    c.el.classList.remove('dragging');
    c.station.el.classList.remove('drop-ready');
    if (overHome(c)) {
      // put it back home
      chips.delete(c);
      Matter.World.remove(world, c.body);
      const fr = stationRect(c.station);
      const rr = rootRect();
      c.el.classList.add('absorbed');
      c.el.style.transform = `translate(${fr.left - rr.left + fr.width / 2 - CHIP / 2}px, ${fr.top - rr.top + fr.height / 2 - CHIP / 2}px) scale(0.1)`;
      setTimeout(() => c.el.remove(), 260);
      home.get(c.station)!.push({ name: c.el.title, icon: (c.el.querySelector('img') as HTMLImageElement).src });
      c.station.el.dispatchEvent(new CustomEvent('stack:home', { bubbles: true }));
    }
  });

  // highlight the home folder while its icon is dragged over it
  Matter.Events.on(engine, 'afterUpdate', () => {
    const dragged = mouseConstraint.body ? chipByBody(mouseConstraint.body) : null;
    for (const st of stations) st.el.classList.toggle('drop-ready', !!dragged && dragged.station === st && overHome(dragged));
  });

  // physics + DOM sync loop
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  const sync = () => {
    for (const c of chips) {
      c.el.style.transform = `translate(${c.body.position.x - CHIP / 2}px, ${c.body.position.y - CHIP / 2}px) rotate(${c.body.angle}rad)`;
    }
    requestAnimationFrame(sync);
  };
  requestAnimationFrame(sync);

  // pause simulation when the tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Matter.Runner.stop(runner);
    else Matter.Runner.run(runner, engine);
  });
}
