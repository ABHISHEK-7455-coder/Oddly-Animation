// ===== demos.js =====
// Single file containing all physics demo functions

import Matter from 'matter-js';

export function MixedDemo({ engine, render }) {
    const { World, Bodies } = Matter;
    const width = render.options.width;
    const height = render.options.height;

    // walls
    const wallThickness = 60;
    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 2 * wallThickness, wallThickness, { isStatic: true, render: { fillStyle: '#111827' } });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, render: { fillStyle: '#0b1220' } });
    World.add(engine.world, [floor, leftWall, rightWall, ceiling]);

    function randomColor() {
        const palette = ['#60A5FA', '#F472B6', '#34D399', '#F59E0B', '#A78BFA', '#F87171', '#FCD34D'];
        return palette[Math.floor(Math.random() * palette.length)];
    }

    function spawnMixed(count = 12) {
        const bodies = [];
        for (let i = 0; i < count; i++) {
            const kind = Math.floor(Math.random() * 4);
            const size = 20 + Math.random() * 40;
            const opts = { restitution: 0.2 + Math.random() * 0.7, friction: 0.01 + Math.random() * 0.2, density: 0.001 + Math.random() * 0.01, render: { fillStyle: randomColor() } };
            let body;
            if (kind === 0) body = Bodies.circle(width / 2 + Math.random() * 120 - 60, height / 6 + Math.random() * 60 - 30, size / 2, opts);
            else if (kind === 1) body = Bodies.rectangle(width / 2 + Math.random() * 120 - 60, height / 6 + Math.random() * 60 - 30, size, size * (0.6 + Math.random() * 1.2), opts);
            else if (kind === 2) body = Bodies.polygon(width / 2 + Math.random() * 120 - 60, height / 6 + Math.random() * 60 - 30, 3 + Math.floor(Math.random() * 5), size / 2, opts);
            else {
                const a = Bodies.rectangle(width / 2 + Math.random() * 120 - 60, height / 6 + Math.random() * 60 - 30, size, size / 4, opts);
                const b = Bodies.rectangle(a.position.x + size / 2, a.position.y, size / 4, size, opts);
                body = Matter.Body.create({ parts: [a, b], restitution: opts.restitution, friction: opts.friction, density: opts.density, render: { fillStyle: randomColor() } });
            }
            bodies.push(body);
        }
        World.add(engine.world, bodies);
    }

    spawnMixed(12);
}

export function ChainsDemo({ engine, render }) {
    const { World, Bodies, Constraint, Body } = Matter;
    const width = render.options.width;
    const height = render.options.height;

    function createChain(anchorX, anchorY, linkCount = 10) {
        const group = Body.nextGroup(true);
        const links = [];
        const constraints = [];
        const anchor = Bodies.circle(anchorX, anchorY, 4, { isStatic: true, render: { fillStyle: '#f8fafc' } });
        links.push(anchor);
        for (let i = 0; i < linkCount; i++) {
            const x = anchorX;
            const y = anchorY + (i + 1) * 22;
            const link = Bodies.circle(x, y, 10, { collisionFilter: { group }, friction: 0.2, restitution: 0.1, density: 0.001, render: { fillStyle: `hsl(${(i * 30) % 360},70%,60%)` } });
            links.push(link);
            const prev = links[links.length - 2];
            const cons = Constraint.create({ bodyA: prev, bodyB: link, length: 22, stiffness: 0.9, render: { visible: true, lineWidth: 4, strokeStyle: '#94a3b8' } });
            constraints.push(cons);
        }
        const last = links[links.length - 1];
        const weight = Bodies.rectangle(last.position.x, last.position.y + 22, 30, 20, { friction: 0.3, restitution: 0.2, render: { fillStyle: '#0ea5a4' } });
        World.add(engine.world, weight);
        const endCons = Constraint.create({ bodyA: last, bodyB: weight, length: 22, stiffness: 0.9, render: { visible: true, lineWidth: 4, strokeStyle: '#94a3b8' } });
        constraints.push(endCons);
        World.add(engine.world, [...links, ...constraints]);
    }

    const spacing = (width - 120) / 3;
    for (let i = 0; i < 4; i++) createChain(60 + i * spacing, 40, 10);
}

export function AvalancheDemo({ engine, render, spawnCount = 30 }) {
    const Bodies = Matter.Bodies;
    const World = Matter.World;


    const width = render.options.width;
    const height = render.options.height;


    // Spawn a bunch of small circles at the top
    const bodies = [];
    for (let i = 0; i < spawnCount; i++) {
        const radius = 10 + Math.random() * 15;
        const x = 50 + Math.random() * (width - 100);
        const y = 50 - Math.random() * 100; // spawn above the visible canvas
        const body = Bodies.circle(x, y, radius, {
            restitution: 0.3 + Math.random() * 0.5,
            friction: 0.01 + Math.random() * 0.1,
            density: 0.001 + Math.random() * 0.005,
            render: { fillStyle: ['#60A5FA', '#F472B6', '#34D399', '#F59E0B', '#A78BFA'][Math.floor(Math.random() * 5)] }
        });
        bodies.push(body);
    }


    // Floor
    const floor = Bodies.rectangle(width / 2, height + 50, width + 100, 60, { isStatic: true, render: { fillStyle: '#111827' } });


    World.add(engine.world, [...bodies, floor]);
}

export function ConstraintsDemo({ engine, render }) {
  const { Bodies, Composite, Constraint, World } = Matter;

  const width = render.options.width;
  const height = render.options.height;

  // floor & walls
  const wallThickness = 60;
  const floor  = Bodies.rectangle(width/2, height + wallThickness/2, width + 2*wallThickness, wallThickness, { isStatic: true, render:{ fillStyle:'#111827' }});
  const left   = Bodies.rectangle(-wallThickness/2, height/2, wallThickness, height, { isStatic: true, render:{ fillStyle:'#111827' }});
  const right  = Bodies.rectangle(width + wallThickness/2, height/2, wallThickness, height, { isStatic: true, render:{ fillStyle:'#111827' }});
  const ceiling= Bodies.rectangle(width/2, -wallThickness/2, width, wallThickness, { isStatic: true, render:{ fillStyle:'#0b1220' }});
  World.add(engine.world, [floor, left, right, ceiling]);

  // Create two boxes
  const boxA = Bodies.rectangle(width/2 - 100, 200, 80, 80, { restitution:0.5, friction:0.1, render:{ fillStyle:'#60A5FA' } });
  const boxB = Bodies.rectangle(width/2 + 100, 200, 80, 80, { restitution:0.5, friction:0.1, render:{ fillStyle:'#F472B6' } });
  World.add(engine.world, [boxA, boxB]);

  // Connect them with a constraint (like a spring / rod)
  const cons = Constraint.create({
    bodyA: boxA,
    bodyB: boxB,
    length: 200,
    stiffness: 0.9,
    render: {
      visible: true,
      lineWidth: 4,
      strokeStyle: '#94a3b8'
    }
  });
  World.add(engine.world, cons);

  // Also attach one end to a fixed point (optional)
  const fixedPoint = { x: width/2, y: 50 };
  const cons2 = Constraint.create({
    pointA: fixedPoint,
    bodyB: boxA,
    length: 150,
    stiffness: 0.9,
    render: {
      visible: true,
      lineWidth: 4,
      strokeStyle: '#94a3b8'
    }
  });
  World.add(engine.world, cons2);
}
