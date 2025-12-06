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
    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 2 * wallThickness, wallThickness, { isStatic: true, render: { fillStyle: '#111827' } });
    const left = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
    const right = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, render: { fillStyle: '#0b1220' } });
    World.add(engine.world, [floor, left, right, ceiling]);

    // Create two boxes
    const boxA = Bodies.rectangle(width / 2 - 100, 200, 80, 80, { restitution: 0.5, friction: 0.1, render: { fillStyle: '#60A5FA' } });
    const boxB = Bodies.rectangle(width / 2 + 100, 200, 80, 80, { restitution: 0.5, friction: 0.1, render: { fillStyle: '#F472B6' } });
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
    const fixedPoint = { x: width / 2, y: 50 };
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

// ===== Double Pendulum Demo =====
export function DoublePendulumDemo({ engine, render }) {
    const { Bodies, Composite, Constraint, World } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // Walls (same as all other demos)
    const wallThickness = 60;
    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 2 * wallThickness, wallThickness, {
        isStatic: true,
        render: { fillStyle: '#111827' }
    });
    const left = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { fillStyle: '#111827' }
    });
    const right = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { fillStyle: '#111827' }
    });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
        isStatic: true,
        render: { fillStyle: '#0b1220' }
    });

    World.add(engine.world, [floor, left, right, ceiling]);

    // Double pendulum system
    const pivot = { x: width / 2, y: 100 };

    const bob1 = Bodies.circle(pivot.x, pivot.y + 140, 30, {
        restitution: 1,
        frictionAir: 0.002,
        render: { fillStyle: '#FF6B6B' }
    });

    const bob2 = Bodies.circle(pivot.x, pivot.y + 280, 30, {
        restitution: 1,
        frictionAir: 0.002,
        render: { fillStyle: '#4D9AFF' }
    });

    World.add(engine.world, [bob1, bob2]);

    const rod1 = Constraint.create({
        pointA: pivot,
        bodyB: bob1,
        length: 140,
        stiffness: 0.9,
        render: {
            visible: true,
            strokeStyle: '#94a3b8',
            lineWidth: 4
        }
    });

    const rod2 = Constraint.create({
        bodyA: bob1,
        bodyB: bob2,
        length: 140,
        stiffness: 0.9,
        render: {
            visible: true,
            strokeStyle: '#94a3b8',
            lineWidth: 4
        }
    });

    World.add(engine.world, [rod1, rod2]);

    // Kick start
    Matter.Body.applyForce(bob1, bob1.position, { x: 0.05, y: 0 });
}

// ===== WreckingBallDemo =====
// Follows same pattern as other demos: signature, walls, bodies, constraints, World.add
// Colors chosen to match the original Matter.js wrecking-ball demo (yellow boxes, gray/steel ball, muted ropes).

export function WreckingBallDemo({ engine, render }) {
    const { Bodies, Constraint, World } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // --- walls & floor (same style as other demos) ---
    const wallThickness = 60;
    const floor = Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width + 2 * wallThickness,
        wallThickness,
        { isStatic: true, render: { fillStyle: '#111827' } }
    );
    const left = Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { fillStyle: '#111827' } }
    );
    const right = Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { fillStyle: '#111827' } }
    );
    const ceiling = Bodies.rectangle(
        width / 2,
        -wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true, render: { fillStyle: '#0b1220' } }
    );

    World.add(engine.world, [floor, left, right, ceiling]);

    // ---- Wrecking ball chain (left side) ----
    const anchorX = Math.max(120, width * 0.12);
    const anchorY = 60;
    const linkCount = 10;
    const linkRadius = 10;
    const linkSpacing = linkRadius * 2 + 2;

    // anchor point (a small static circle so it appears as a pin)
    const anchor = Bodies.circle(anchorX, anchorY, 4, {
        isStatic: true,
        render: { fillStyle: '#f8fafc' }
    });

    const links = [anchor];
    const constraints = [];

    // create chain links
    for (let i = 0; i < linkCount; i++) {
        const x = anchorX;
        const y = anchorY + (i + 1) * linkSpacing;
        const link = Bodies.circle(x, y, linkRadius, {
            friction: 0.1,
            restitution: 0.0,
            density: 0.0008,
            render: { fillStyle: '#8b8f95' } // muted steel for chain links
        });
        links.push(link);

        const prev = links[links.length - 2];
        const cons = Constraint.create({
            bodyA: prev,
            bodyB: link,
            length: linkSpacing,
            stiffness: 1,
            render: { visible: true, lineWidth: 3, strokeStyle: '#94a3b8' }
        });
        constraints.push(cons);
    }

    // wrecking ball (heavy)
    const lastLink = links[links.length - 1];
    const ballRadius = 36;
    const wreckingBall = Bodies.circle(
        lastLink.position.x,
        lastLink.position.y + linkSpacing + ballRadius / 2,
        ballRadius,
        {
            friction: 0.4,
            restitution: 0.2,
            density: 0.02, // heavy
            render: { fillStyle: '#555555' } // dark gray / steel
        }
    );

    // connect last link to wrecking ball
    const endConstraint = Constraint.create({
        bodyA: lastLink,
        bodyB: wreckingBall,
        length: linkSpacing + ballRadius / 2,
        stiffness: 1,
        render: { visible: true, lineWidth: 4, strokeStyle: '#94a3b8' }
    });
    constraints.push(endConstraint);

    World.add(engine.world, [...links.slice(1), ...constraints, wreckingBall, anchor]); // slice to avoid adding anchor twice

    // give a gentle initial nudge so ball swings a bit on spawn
    Matter.Body.applyForce(wreckingBall, wreckingBall.position, { x: 0.06, y: 0 });

    // ---- Stack / tower of boxes to wreck ----
    // place a multi-column stack a bit to the right of the ball
    const stackBaseX = Math.max(width * 0.45, anchorX + 260);
    const stackBaseY = height - 120;
    const cols = 6;
    const rows = 8;
    const boxW = 40;
    const boxH = 36;
    const gap = 2;

    const boxes = [];
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const bx = stackBaseX + col * (boxW + gap);
            const by = stackBaseY - row * (boxH + gap);
            const box = Bodies.rectangle(bx, by, boxW, boxH, {
                restitution: 0.1,
                friction: 0.6,
                density: 0.002,
                render: { fillStyle: '#F5C45A' } // yellow-ish like original demo blocks
            });
            boxes.push(box);
        }
    }
    World.add(engine.world, boxes);

    // ---- optional: few loose boxes nearby for variety ----
    const loose = [
        Bodies.rectangle(stackBaseX - 140, stackBaseY - 20, 48, 36, { render: { fillStyle: '#F5C45A' } }),
        Bodies.rectangle(stackBaseX - 100, stackBaseY - 60, 36, 36, { render: { fillStyle: '#F5C45A' } })
    ];
    World.add(engine.world, loose);
}

export function TimeScaleDemo({ engine, render }) {
    const { Bodies, World, Composite } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // Remove old bodies (except mouse)
    const mouseConstraint = engine.world.bodies.find(b => b.label === "Mouse Body");
    Composite.clear(engine.world, false);
    if (mouseConstraint) Composite.add(engine.world, mouseConstraint);

    // Walls
    const wallThickness = 60;
    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 200, wallThickness, {
        isStatic: true, render: { fillStyle: "#111827" }
    });
    const left = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true, render: { fillStyle: "#111827" }
    });
    const right = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true, render: { fillStyle: "#111827" }
    });

    World.add(engine.world, [floor, left, right]);

    // Spawn blocks
    function spawnBlocks() {
        const blocks = [];
        for (let i = 0; i < 20; i++) {
            const box = Bodies.rectangle(
                width * 0.5 + (Math.random() - 0.5) * 200,
                0 - i * 40,
                40, 40,
                {
                    restitution: 0.2,
                    friction: 0.6,
                    density: 0.002,
                    render: { fillStyle: "#F5C45A" }
                }
            );
            blocks.push(box);
        }
        World.add(engine.world, blocks);
    }

    spawnBlocks();

    // --- THE REAL MAGIC: AUTO TIME-SCALE LOOP ---
    let t = 0;

    Matter.Events.on(engine, "beforeUpdate", () => {
        t += 0.05;
        engine.timing.timeScale = 0.5 + 0.5 * Math.sin(t * 0.5);  // smooth loop

        // Auto-clean & respawn when blocks settle
        const bodies = Composite.allBodies(engine.world);

        // If almost all blocks on the floor → respawn
        const resting = bodies.filter(b => !b.isStatic && Math.abs(b.velocity.y) < 0.2);

        if (resting.length > 18) {
            Composite.clear(engine.world, false);
            if (mouseConstraint) Composite.add(engine.world, mouseConstraint);
            World.add(engine.world, [floor, left, right]);
            spawnBlocks();
        }
    });
}
