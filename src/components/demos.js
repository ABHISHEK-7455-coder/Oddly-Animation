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

export function TimescaleDemo({ engine, render }) {
    const { Bodies, World, Composite } = Matter;
    const width = render.options.width;
    const height = render.options.height;

    // Floor & walls
    const wallThickness = 60;
    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 2 * wallThickness, wallThickness, { isStatic: true, render: { fillStyle: '#111827' } });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, render: { fillStyle: '#0b1220' } });
    World.add(engine.world, [floor, leftWall, rightWall, ceiling]);

    // Random color palette
    const palette = ['#60A5FA', '#F472B6', '#34D399', '#F59E0B', '#A78BFA', '#F87171', '#FCD34D'];

    // Auto spawn shapes
    let spawnTimer = setInterval(() => {
        const size = 20 + Math.random() * 40;
        const x = 50 + Math.random() * (width - 100);
        const y = -50;
        const kind = Math.floor(Math.random() * 2);
        let body;
        if (kind === 0) {
            body = Bodies.rectangle(x, y, size, size, { restitution: 0.3, friction: 0.1, render: { fillStyle: palette[Math.floor(Math.random() * palette.length)] } });
        } else {
            body = Bodies.circle(x, y, size / 2, { restitution: 0.3, friction: 0.1, render: { fillStyle: palette[Math.floor(Math.random() * palette.length)] } });
        }
        World.add(engine.world, body);
    }, 400); // spawn every 0.4s

    // TimeScale oscillation
    let t = 0;
    let timeScaleFrame = requestAnimationFrame(function updateTimeScale() {
        if (!engine) return;
        t += 0.02;
        engine.timing.timeScale = 0.5 + 0.5 * Math.sin(t); // oscillates between 0 → 1
        timeScaleFrame = requestAnimationFrame(updateTimeScale);
    });

    // Cleanup function when switching demos
    return () => {
        clearInterval(spawnTimer);
        cancelAnimationFrame(timeScaleFrame);

        // remove all non-static bodies
        const allBodies = Composite.allBodies(engine.world);
        for (const b of allBodies) {
            if (!b.isStatic) Composite.remove(engine.world, b);
        }
    };
}

export function CompoundStackDemo({ engine, render }) {
    const { Bodies, Composites, World } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    const wallThickness = 60;

    const floor = Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width + 2 * wallThickness,
        wallThickness,
        { isStatic: true, render: { fillStyle: "#111827" } }
    );

    const left = Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { fillStyle: "#111827" } }
    );

    const right = Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { fillStyle: "#111827" } }
    );

    const ceiling = Bodies.rectangle(
        width / 2,
        -wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true, render: { fillStyle: "#0b1220" } }
    );

    World.add(engine.world, [floor, left, right, ceiling]);

    //--- (style) ---
    const stack = Composites.stack(
        width * 0.2,         // X start
        height - 460,        // Y start
        6,                   // columns
        9,                   // rows
        0, 0,                // gaps
        (x, y) => {
            return Bodies.rectangle(x, y, 40, 40, {
                restitution: 0.1,
                friction: 0.6,
                density: 0.002,
                render: { fillStyle: "#F5C45A" } // Yellowish block (same as WreckingBall)
            });
        }
    );

    World.add(engine.world, stack);
}

export function RopeBridgeDemo({ engine, render }) {
    const { Bodies, Constraint, Composites, Composite, World } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    //---------------------------
    // CLEAN WORLD (except mouse)
    //---------------------------
    const mouseConstraint = engine.world.constraints.find(c => c.label === "Mouse Constraint");

    Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic) World.remove(engine.world, b);
    });

    Composite.allConstraints(engine.world).forEach(c => {
        if (c !== mouseConstraint) World.remove(engine.world, c);
    });

    //---------------------------
    // STATIC ANCHORS
    //---------------------------
    const group = Matter.Body.nextGroup(true);

    const anchorLeft = Bodies.rectangle(200, 200, 50, 20, {
        isStatic: true,
        render: { fillStyle: "#1e293b" }
    });

    const anchorRight = Bodies.rectangle(width - 200, 200, 50, 20, {
        isStatic: true,
        render: { fillStyle: "#1e293b" }
    });

    World.add(engine.world, [anchorLeft, anchorRight]);

    //---------------------------
    // REAL WOODEN PLANK BRIDGE
    //---------------------------
    const segments = 15;
    const plankWidth = 60;
    const plankHeight = 15;

    const bridge = Composites.stack(260, 200, segments, 1, 2, 2, (x, y) => {
        return Bodies.rectangle(x, y, plankWidth, plankHeight, {
            collisionFilter: { group: group },
            chamfer: 5,
            density: 0.002,
            friction: 0.8,
            frictionAir: 0.0005,
            render: {
                fillStyle: "#d97706" // official wooden color
            }
        });
    });

    // CONNECT PLANKS WITH ROPE CONSTRAINTS
    Composites.chain(bridge, 0.5, 0, 0.5, 0, {
        stiffness: 0.9,
        damping: 0.02,
        render: {
            strokeStyle: "#fcd34d",
            lineWidth: 2
        }
    });

    //---------------------------
    // ATTACH BRIDGE TO ANCHORS
    //---------------------------
    const first = bridge.bodies[0];
    const last = bridge.bodies[bridge.bodies.length - 1];

    World.add(engine.world, [
        Constraint.create({
            bodyA: anchorLeft,
            pointA: { x: 0, y: 0 },
            bodyB: first,
            pointB: { x: -plankWidth / 2, y: 0 },
            length: 2,
            stiffness: 1
        }),

        Constraint.create({
            bodyA: anchorRight,
            pointA: { x: 0, y: 0 },
            bodyB: last,
            pointB: { x: plankWidth / 2, y: 0 },
            length: 2,
            stiffness: 1
        })
    ]);

    World.add(engine.world, bridge);

    //---------------------------
    // DROP SOME OBJECTS ON BRIDGE
    //---------------------------
    const boxes = Composites.stack(width / 2 - 50, 0, 4, 3, 0, 0, (x, y) => {
        return Bodies.circle(x, y, 20, {
            restitution: 0.2,
            render: { fillStyle: "#3b82f6" }
        });
    });

    World.add(engine.world, boxes);

    //---------------------------
    // RETURN CLEANUP FUNCTION
    //---------------------------
    return () => {
        try {
            World.remove(engine.world, bridge);
            World.remove(engine.world, boxes);
            World.remove(engine.world, anchorLeft);
            World.remove(engine.world, anchorRight);
        } catch (e) { }
    };
}

export function NewtonsCradleDemo({ engine, render }) {
    const { Composites, World, Bodies, Body } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // optional floor (so balls don't drop out of screen)  
    const floor = Bodies.rectangle(width / 2, height + 50, width + 200, 100, {
        isStatic: true,
        render: { fillStyle: "#111827" }
    });
    World.add(engine.world, floor);

    // create cradle: x, y, number of balls, ball radius, string length
    const cradle = Composites.newtonsCradle(
        width / 2 - 100, // x — start a bit left of center
        100,             // y — top of strings
        5,               // number of balls
        20,              // ball radius
        200              // length of rope/pendulum
    );

    World.add(engine.world, cradle);

    // move first ball aside to start motion
    Body.translate(cradle.bodies[0], { x: -120, y: -100 });
}

export function ClothDemo({ engine, render }) {
    const { Bodies, Composites, Constraint, World, MouseConstraint, Mouse } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // --- Walls ---
    const wallThickness = 60;

    const floor = Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width + 2 * wallThickness,
        wallThickness,
        { isStatic: true, render: { fillStyle: "#111827" } }
    );

    const left = Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { fillStyle: "#111827" } }
    );

    const right = Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { fillStyle: "#111827" } }
    );

    const ceiling = Bodies.rectangle(
        width / 2,
        -wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true, render: { fillStyle: "#0b1220" } }
    );

    World.add(engine.world, [floor, left, right, ceiling]);

    // --- Cloth Grid ---
    const columns = 15;       // width segments
    const rows = 12;          // height segments
    const spacing = 30;       // distance between nodes
    const startX = width / 2 - (columns * spacing) / 2;
    const startY = 80;

    const cloth = Composites.stack(startX, startY, columns, rows, 0, 0, (x, y) => {
        return Bodies.circle(x, y, 6, {
            frictionAir: 0.02,
            render: {
                fillStyle: "#F5C45A" // same yellow-ish color
            }
        });
    });

    // Create constraints between nodes
    Composites.mesh(cloth, columns, rows, true, {
        stiffness: 0.9,
        damping: 0.1,
        render: {
            strokeStyle: "#F5C45A",
            lineWidth: 1
        }
    });

    // Pin the top row
    for (let i = 0; i < columns; i++) {
        const ball = cloth.bodies[i];
        World.add(engine.world, Constraint.create({
            bodyA: ball,
            pointB: { x: ball.position.x, y: ball.position.y },
            stiffness: 1,
            render: { visible: false }
        }));
    }

    World.add(engine.world, cloth);

    // --- Mouse drag support ---
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.98,
            render: {
                visible: false
            }
        }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;
}


export function MagnetFieldDemo({ engine, render }) {
    const { Bodies, Body, Composite, Composites, World, Vector } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // ----- Walls -----
    const walls = [
        Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true }),
        Bodies.rectangle(width / 2, -30, width, 60, { isStatic: true }),
        Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true }),
        Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true })
    ];
    World.add(engine.world, walls);

    // ----- Spawn random particles -----
    const particles = Composites.stack(width * 0.2, height * 0.2, 10, 4, 10, 10, (x, y) => {
        return Bodies.circle(x, y, 10, {
            restitution: 0.4,
            frictionAir: 0.04,
            render: {
                fillStyle: "#4ea1f5"
            }
        });
    });

    World.add(engine.world, particles);

    // ----- Magnetic Points -----
    const magnets = [
        { pos: { x: width * 0.25, y: height * 0.25 }, strength: 0.0003 },
        { pos: { x: width * 0.75, y: height * 0.25 }, strength: 0.0003 },
        { pos: { x: width * 0.5, y: height * 0.75 }, strength: 0.0003 }
    ];

    // Visual magnet bodies
    const magnetBodies = magnets.map(m =>
        Bodies.circle(m.pos.x, m.pos.y, 18, {
            isStatic: true,
            render: {
                fillStyle: "#F87171" // red magnets
            }
        })
    );

    World.add(engine.world, magnetBodies);

    // ---- Move magnets in circular motion ----
    let angle = 0;
    Matter.Events.on(engine, "beforeUpdate", () => {
        angle += 0.02;

        magnetBodies.forEach((mag, i) => {
            const radius = 80 + i * 40;
            const cx = (width / 2);
            const cy = (height / 2);

            const offsetAngle = angle + i * 1.5;

            Body.setPosition(mag, {
                x: cx + Math.cos(offsetAngle) * radius,
                y: cy + Math.sin(offsetAngle) * radius
            });

            magnets[i].pos = mag.position;
        });

        // Apply magnetic attraction
        Composite.allBodies(engine.world).forEach(body => {
            if (body.isStatic) return;

            magnets.forEach(m => {
                const dir = Vector.sub(m.pos, body.position);
                const dist = Vector.magnitude(dir);

                // Limit force range
                if (dist < 300) {
                    const force = Vector.mult(Vector.normalise(dir), m.strength * (300 - dist));
                    Body.applyForce(body, body.position, force);
                }
            });
        });
    });

    return () => { };
}

export function HelicopterRescueDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        Composite,
        Composites,
        Constraint,
        World
    } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // --- WORLD BOUNDARIES ---
    const floor = Bodies.rectangle(width / 2, height + 50, width, 100, {
        isStatic: true,
        render: { fillStyle: "#0f172a" }
    });

    World.add(engine.world, floor);

    // --- HELICOPTER BODY ---
    const helicopter = Bodies.rectangle(width * 0.3, height * 0.25, 140, 40, {
        isStatic: true,
        render: {
            fillStyle: "#a5b4fc",
            strokeStyle: "#c7d2fe",
            lineWidth: 2
        }
    });

    // --- ROTOR ---
    const rotor = Bodies.rectangle(width * 0.3, height * 0.22, 160, 10, {
        isStatic: true,
        render: {
            fillStyle: "#e0e7ff"
        }
    });

    // --- RESCUE ROPE ---
    const ropeLength = 10;
    const segmentLength = 20;

    const rope = Composites.stack(
        helicopter.position.x,
        helicopter.position.y + 20,
        1,
        ropeLength,
        0,
        0,
        (x, y) =>
            Bodies.rectangle(x, y, 6, segmentLength, {
                frictionAir: 0.02,
                collisionFilter: { group: -1 },
                render: { fillStyle: "#cbd5e1" }
            })
    );

    Composites.chain(rope, 0, 0.5, 0, -0.5, {
        stiffness: 0.85,
        render: { strokeStyle: "#cbd5e1" }
    });

    const ropeTopConstraint = Constraint.create({
        bodyA: helicopter,
        pointA: { x: 0, y: 20 },
        bodyB: rope.bodies[0],
        pointB: { x: 0, y: -10 },
        stiffness: 1,
        render: { strokeStyle: "#cbd5e1" }
    });

    World.add(engine.world, [helicopter, rotor, rope, ropeTopConstraint]);

    // --- SURVIVOR ON GROUND ---
    const survivor = Bodies.circle(width * 0.5, height - 60, 18, {
        restitution: 0.2,
        friction: 0.8,
        density: 0.002,
        render: { fillStyle: "#38bdf8" }
    });

    World.add(engine.world, survivor);

    // --- AUTO-GRAB SYSTEM ---
    let grabbed = false;

    Matter.Events.on(engine, "afterUpdate", () => {
        // Helicopter hovering motion (smooth sine)
        const t = engine.timing.timestamp * 0.002;

        Body.setPosition(helicopter, {
            x: width * 0.3 + Math.sin(t) * 30,
            y: height * 0.25 + Math.sin(t * 0.7) * 15
        });

        Body.setPosition(rotor, {
            x: helicopter.position.x,
            y: helicopter.position.y - 18
        });

        // ROTOR SPIN
        Body.setAngle(rotor, t * 0.35);

        // Grab survivor when rope end is close
        const ropeEnd = rope.bodies[ropeLength - 1];

        const dx = ropeEnd.position.x - survivor.position.x;
        const dy = ropeEnd.position.y - survivor.position.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!grabbed && distance < 40) {
            grabbed = true;

            const grabConstraint = Constraint.create({
                bodyA: ropeEnd,
                bodyB: survivor,
                stiffness: 0.9,
                length: 5,
                render: { strokeStyle: "#38bdf8" }
            });

            World.add(engine.world, grabConstraint);
        }

        // After grabbing, helicopter starts rising
        if (grabbed) {
            Body.setPosition(helicopter, {
                x: helicopter.position.x,
                y: helicopter.position.y - 0.3
            });
        }
    });
}

export function EventsDemo({ engine, render }) {
    const { Bodies, Body, Events, World, Mouse, MouseConstraint } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // WALLS
    const walls = [
        Bodies.rectangle(width / 2, height + 40, width, 80, { isStatic: true }),
        Bodies.rectangle(width / 2, -40, width, 80, { isStatic: true }),
        Bodies.rectangle(-40, height / 2, 80, height, { isStatic: true }),
        Bodies.rectangle(width + 40, height / 2, 80, height, { isStatic: true })
    ];
    World.add(engine.world, walls);

    // AUTO SPAWN SHAPES
    function spawnShape() {
        const x = Math.random() * width;
        const size = 20 + Math.random() * 40;

        const circle = Bodies.circle(x, 50, size, {
            restitution: 0.8,
            frictionAir: 0.01,
            render: {
                fillStyle: "#ffaa44"
            }
        });

        World.add(engine.world, circle);

        // small random kick (official look)
        Body.applyForce(circle, circle.position, {
            x: (Math.random() - 0.5) * 0.03,
            y: (Math.random() - 0.5) * 0.03
        });
    }

    const spawnInterval = setInterval(spawnShape, 1200);

    // AUTO FORCES ON ALL BODIES
    const autoForceInterval = setInterval(() => {
        engine.world.bodies.forEach(b => {
            if (!b.isStatic) {
                Body.applyForce(b, b.position, {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02
                });
            }
        });
    }, 1500);

    // COLLISION EVENTS
    Events.on(engine, "collisionStart", (event) => {
        event.pairs.forEach(pair => {
            pair.bodyA.render.fillStyle = "#ff4444";
            pair.bodyB.render.fillStyle = "#ff4444";
        });
    });

    Events.on(engine, "collisionEnd", (event) => {
        event.pairs.forEach(pair => {
            pair.bodyA.render.fillStyle = "#44ff44";
            pair.bodyB.render.fillStyle = "#44ff44";
        });
    });

    // MOUSE DRAG
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // CLEANUP RETURN (important for switching demos)
    return () => {
        clearInterval(spawnInterval);
        clearInterval(autoForceInterval);
    };
}

export function FallingBuildings({ engine, render }) {
    const { Bodies, Body, World, Composite, Composites, Events } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // -----------------------
    // preserve mouse constraint if present
    // -----------------------
    const mouseConstraint = engine.world.constraints.find(c => c.label === "Mouse Constraint");

    // -----------------------
    // clear previous dynamic objects (preserve mouseConstraint)
    // -----------------------
    Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic) World.remove(engine.world, b);
    });
    Composite.allConstraints(engine.world).forEach(c => {
        if (c !== mouseConstraint) World.remove(engine.world, c);
    });

    // -----------------------
    // floor & walls
    // -----------------------
    const wallThickness = 80;
    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 2 * wallThickness, wallThickness, {
        isStatic: true,
        render: { fillStyle: "#0b1220" }
    });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: "#0b1220" } });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: "#0b1220" } });

    World.add(engine.world, [floor, leftWall, rightWall]);

    // -----------------------
    // buildings layout
    // -----------------------
    const buildings = [];
    const buildingCols = 6;
    const colSpacing = Math.floor((width - 200) / buildingCols);
    const bricksPerCol = 10 + Math.floor(Math.random() * 8);

    const brickW = 40;
    const brickH = 24;
    const brickGap = 6; // <-- GAP BETWEEN BLOCKS

    for (let i = 0; i < buildingCols; i++) {
        const startX = 100 + i * colSpacing;
        const rows = bricksPerCol - Math.floor(Math.random() * 6);

        // ⭐ UPDATED: gap included in Y offset
        const building = Composites.stack(
            startX - (brickW / 2),
            height - wallThickness - (rows * (brickH + brickGap)),
            1,
            rows,
            0,
            brickGap, // <-- vertical gap between items
            (x, y) => {
                return Bodies.rectangle(x, y, brickW, brickH, {
                    restitution: 0.05,
                    friction: 0.6,
                    density: 0.004,
                    render: {
                        fillStyle: ["#d97706", "#f59e0b", "#fbbf24"][Math.floor(Math.random() * 3)],
                        strokeStyle: "#7c3f00",
                        lineWidth: 1
                    }
                });
            }
        );

        Body.translate(building.bodies[0], { x: (Math.random() - 0.5) * 8, y: 0 });

        World.add(engine.world, building);
        buildings.push(building);
    }

    // -----------------------
    // wrecking balls
    // -----------------------
    const wreckingBalls = [];
    function dropWreckingBall() {
        const x = 120 + Math.random() * (width - 240);
        const ball = Bodies.circle(x, -80, 36 + Math.random() * 20, {
            density: 0.03,
            friction: 0.4,
            restitution: 0.05,
            render: { fillStyle: "#6b7280" }
        });
        Body.applyForce(ball, ball.position, { x: (Math.random() - 0.5) * 0.02, y: 0 });
        World.add(engine.world, ball);
        wreckingBalls.push(ball);

        setTimeout(() => {
            try { World.remove(engine.world, ball); } catch (_) { }
        }, 20000);
    }

    const wreckInterval = setInterval(() => {
        if (Math.random() < 0.5) dropWreckingBall();
    }, 3500);


    // -----------------------
    // earthquake
    // -----------------------
    const quakeInterval = setInterval(() => {
        const magnitude = 0.002 + Math.random() * 0.004;
        const dir = Math.random() > 0.5 ? 1 : -1;

        buildings.forEach(building => {
            const bodies = building.bodies;
            for (let i = Math.max(0, bodies.length - 3); i < bodies.length; i++) {
                Body.applyForce(bodies[i], bodies[i].position, { x: dir * magnitude, y: -magnitude * 0.2 });
            }
        });
    }, 1800);


    // -----------------------
    // collision flash
    // -----------------------
    const collisionFlash = evt => {
        evt.pairs.forEach(p => {
            const a = p.bodyA;
            const b = p.bodyB;

            if (!a.isStatic && a.render) {
                const prev = a.render.fillStyle;
                a.render.fillStyle = "#ff6b6b";
                setTimeout(() => a.render.fillStyle = prev, 200);
            }

            if (!b.isStatic && b.render) {
                const prevb = b.render.fillStyle;
                b.render.fillStyle = "#ff6b6b";
                setTimeout(() => b.render.fillStyle = prevb, 200);
            }
        });
    };

    Events.on(engine, "collisionStart", collisionFlash);

    // -----------------------
    // cleanup
    // -----------------------
    const cleanup = () => {
        clearInterval(wreckInterval);
        clearInterval(quakeInterval);
        Events.off(engine, "collisionStart", collisionFlash);

        buildings.forEach(b => { try { World.remove(engine.world, b); } catch (_) { } });
        wreckingBalls.forEach(w => { try { World.remove(engine.world, w); } catch (_) { } });
    };

    return cleanup;
}

export function FloatingLanterns({ engine, render, spawnCount = 8 }) {
    const { Bodies, Body, World, Composite, Events } = Matter;

    // --- preserve mouse constraint if present (same pattern as your other demos) ---
    const mouseConstraint = engine.world.constraints.find(c => c.label === "Mouse Constraint");

    // --- clear previous dynamic objects (preserve mouseConstraint) ---
    Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic) World.remove(engine.world, b);
    });
    Composite.allConstraints(engine.world).forEach(c => {
        if (c !== mouseConstraint) World.remove(engine.world, c);
    });

    // --- disable gravity so lanterns freely float ---
    engine.gravity.x = 0;
    engine.gravity.y = 0;

    const w = render.options.width;
    const h = render.options.height;

    // store lantern meta
    const lanterns = [];

    // create lanterns (circle bodies) with visual metadata
    for (let i = 0; i < spawnCount; i++) {
        const radius = 14 + Math.random() * 18; // radius in px
        const hue = 30 + Math.random() * 40; // warm hue range
        const coreColor = `hsl(${hue}, 80%, ${55 + Math.random() * 10}%)`;
        const glowAlpha = 0.28 + Math.random() * 0.35;

        const b = Bodies.circle(
            Math.random() * w,
            Math.random() * h,
            radius,
            {
                label: "lantern",
                frictionAir: 0.02,
                restitution: 0.95,
                render: {
                    // fallback fill (Matter's shape fill) — actual glow drawn on canvas below
                    fillStyle: coreColor,
                }
            }
        );

        // store custom visual props on body
        b._lantern = {
            radius,
            coreColor,
            glowAlpha,
            bobPhase: Math.random() * Math.PI * 2
        };

        // gentle initial velocity
        Body.setVelocity(b, {
            x: (Math.random() - 0.5) * 1.6,
            y: (Math.random() - 0.5) * 1.6
        });

        lanterns.push(b);
        World.add(engine.world, b);
    }

    // --- physics step: drift, bob, wall-bounce, clamp speed ---
    const beforeUpdate = () => {
        for (const l of lanterns) {
            if (!l.position) continue;
            const r = l.circleRadius || l._lantern.radius;
            const v = l.velocity;

            // soft upward tendency + slow horizontal wind (sine)
            const wind = Math.sin((l.position.y + Date.now() * 0.0004) * 0.01) * 0.00008;
            Body.applyForce(l, l.position, {
                x: (Math.random() - 0.5) * 0.00008 + wind,
                y: -0.00018 + (Math.random() - 0.5) * 0.00003
            });

            // bobbing: tiny vertical oscillation by adjusting velocity slightly
            const bob = Math.sin(l._lantern.bobPhase + Date.now() * 0.002) * 0.00002;
            Body.applyForce(l, l.position, { x: 0, y: bob });

            // WALL bounce + fix: reflect velocity and nudge position inside bounds
            if (l.position.x - r <= 0 && v.x < 0) {
                Body.setVelocity(l, { x: Math.abs(v.x) * 0.9, y: v.y });
                Body.setPosition(l, { x: r + 1, y: l.position.y });
            }
            if (l.position.x + r >= w && v.x > 0) {
                Body.setVelocity(l, { x: -Math.abs(v.x) * 0.9, y: v.y });
                Body.setPosition(l, { x: w - r - 1, y: l.position.y });
            }
            if (l.position.y - r <= 0 && v.y < 0) {
                Body.setVelocity(l, { x: v.x, y: Math.abs(v.y) * 0.9 });
                Body.setPosition(l, { x: l.position.x, y: r + 1 });
            }
            if (l.position.y + r >= h && v.y > 0) {
                Body.setVelocity(l, { x: v.x, y: -Math.abs(v.y) * 0.9 });
                Body.setPosition(l, { x: l.position.x, y: h - r - 1 });
            }

            // clamp speed
            const speed = Math.hypot(v.x, v.y);
            const maxSpeed = 2.2;
            if (speed > maxSpeed) {
                Body.setVelocity(l, { x: (v.x / speed) * maxSpeed, y: (v.y / speed) * maxSpeed });
            }
        }
    };

    Events.on(engine, "beforeUpdate", beforeUpdate);

    // --- visual glow drawing using renderer canvas after matter rendered ---
    // We draw radial gradient glows + core circle using render.context
    const afterRender = () => {
        try {
            const ctx = render.context;
            if (!ctx) return;

            // use additive blending for nicer glow
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            for (const l of lanterns) {
                if (!l.position) continue;
                const { x, y } = l.position;
                const { radius, coreColor, glowAlpha } = l._lantern;

                // radial gradient for glow
                const g = ctx.createRadialGradient(x, y, 0, x, y, radius * 4.2);
                // inner (bright) --> outer (transparent)
                g.addColorStop(0, coreColor);
                g.addColorStop(0.25, `rgba(255,230,180,${Math.min(0.9, glowAlpha + 0.35)})`);
                g.addColorStop(0.6, `rgba(255,200,140,${Math.max(0, glowAlpha - 0.04)})`);
                g.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.fillStyle = g;
                ctx.arc(x, y, radius * 4.2, 0, Math.PI * 2);
                ctx.fill();

                // core soft circle
                ctx.beginPath();
                ctx.globalCompositeOperation = 'source-over';
                // slight inner gradient for core
                const g2 = ctx.createRadialGradient(x, y, 0, x, y, radius);
                g2.addColorStop(0, 'rgba(255,255,255,0.9)');
                g2.addColorStop(0.15, coreColor);
                g2.addColorStop(1, `rgba(255,255,255,0.02)`);
                ctx.fillStyle = g2;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();

                // subtle stroke
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,230,160,0.28)';
                ctx.lineWidth = Math.max(1, radius * 0.12);
                ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2);
                ctx.stroke();

                // reset composite mode for next
                ctx.globalCompositeOperation = 'lighter';
            }

            ctx.restore();
        } catch (e) {
            // ignore render errors
        }
    };

    // Attach afterRender via Events on the renderer
    // Render has its own events 'afterRender' available via Matter.Events
    Events.on(render, "afterRender", afterRender);

    // --- cleanup function ---
    const cleanup = () => {
        Events.off(engine, "beforeUpdate", beforeUpdate);
        Events.off(render, "afterRender", afterRender);
        // remove bodies
        try { Composite.remove(engine.world, lanterns); } catch (e) { /* ignore */ }
    };

    return cleanup;
}

export function SandFunnelDemo({ engine, render, spawnCount = 80 }) {
    const { Bodies, Body, World, Composite, Events } = Matter;

    // preserve mouse constraint
    const mouseConstraint = engine.world.constraints.find(
        c => c.label === "Mouse Constraint"
    );

    // clear previous dynamic bodies / constraints
    Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic) World.remove(engine.world, b);
    });
    Composite.allConstraints(engine.world).forEach(c => {
        if (c !== mouseConstraint) World.remove(engine.world, c);
    });

    // realistic gravity for sand
    engine.gravity.x = 0;
    engine.gravity.y = 1.1;

    const w = render.options.width;
    const h = render.options.height;

    const sandParticles = [];

    /* ---------------- FUNNEL WALLS ---------------- */
    const wallThickness = 30;

    const leftWall = Bodies.rectangle(
        w / 2 - 90, h / 2 - 40,
        wallThickness, h,
        { isStatic: true, angle: Math.PI / 7 }
    );

    const rightWall = Bodies.rectangle(
        w / 2 + 90, h / 2 - 40,
        wallThickness, h,
        { isStatic: true, angle: -Math.PI / 7 }
    );

    const floor = Bodies.rectangle(
        w / 2, h + 25,
        w, 50,
        { isStatic: true }
    );

    World.add(engine.world, [leftWall, rightWall, floor]);

    /* ---------------- SAND SPAWN ---------------- */
    for (let i = 0; i < spawnCount; i++) {
        const r = 2.2 + Math.random() * 1.2;

        const sand = Bodies.circle(
            w / 2 + (Math.random() - 0.5) * 60,
            40 + Math.random() * 30,
            r,
            {
                label: "sand",
                restitution: 0.05,
                friction: 0.2,
                frictionAir: 0.06,
                density: 0.0025,
                render: { fillStyle: "#f5d08c" }
            }
        );

        sand._sand = {
            radius: r,
            shade: 210 + Math.random() * 30
        };

        sand._settled = false; // track if sand has settled
        sandParticles.push(sand);
        World.add(engine.world, sand);
    }

    /* ---------------- SAND HEAP LOOP ---------------- */
    let settledCount = 0;
    const SETTLE_LIMIT = spawnCount * 0.6; // sand pile threshold

    const beforeUpdate = () => {
        for (const s of sandParticles) {
            if (!s.position) continue;

            const speed = Math.hypot(s.velocity.x, s.velocity.y);

            // --- sand settle at bottom ---
            if (s.position.y > h - 55 && speed < 0.06 && !s._settled) {
                s._settled = true;
                settledCount++;
            }

            // --- recycle only after enough sand is piled ---
            if (s._settled && settledCount > SETTLE_LIMIT && Math.random() < 0.03) {
                s._settled = false;
                settledCount--;

                Body.setPosition(s, {
                    x: w / 2 + (Math.random() - 0.5) * 60,
                    y: -30
                });
                Body.setVelocity(s, { x: 0, y: 0 });
                Body.setAngularVelocity(s, 0);
            }

            // --- micro jitter for realism ---
            if (!s._settled) {
                Body.applyForce(s, s.position, {
                    x: (Math.random() - 0.5) * 0.00001,
                    y: 0
                });
            }

            // --- limit insane velocity ---
            if (!s._settled) {
                const v = s.velocity;
                const spd = Math.hypot(v.x, v.y);
                if (spd > 6) {
                    Body.setVelocity(s, { x: v.x * 0.6, y: v.y * 0.6 });
                }
            }
        }
    };

    Events.on(engine, "beforeUpdate", beforeUpdate);

    /* ---------------- VISUAL GRAIN HIGHLIGHT ---------------- */
    const afterRender = () => {
        const ctx = render.context;
        if (!ctx) return;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        for (const s of sandParticles) {
            if (!s.position) continue;
            const { x, y } = s.position;
            const r = s._sand.radius;

            const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
            g.addColorStop(0, `rgba(255,240,200,0.8)`);
            g.addColorStop(1, `rgba(255,200,120,0)`);

            ctx.beginPath();
            ctx.fillStyle = g;
            ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    };

    Events.on(render, "afterRender", afterRender);

    /* ---------------- CLEANUP ---------------- */
    const cleanup = () => {
        Events.off(engine, "beforeUpdate", beforeUpdate);
        Events.off(render, "afterRender", afterRender);
        try {
            Composite.remove(engine.world, sandParticles);
        } catch (e) { }
    };

    return cleanup;
}

export function GearSystemCrankDemo({ engine, render }) {
    const { Bodies, Body, World, Composite, Constraint, Events } = Matter;

    /* ---------- preserve mouse constraint ---------- */
    const mouseConstraint = engine.world.constraints.find(
        c => c.label === "Mouse Constraint"
    );

    /* ---------- clear previous dynamic stuff ---------- */
    Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic) World.remove(engine.world, b);
    });
    Composite.allConstraints(engine.world).forEach(c => {
        if (c !== mouseConstraint) World.remove(engine.world, c);
    });

    engine.gravity.x = 0;
    engine.gravity.y = 0;

    const w = render.options.width;
    const h = render.options.height;

    const gears = [];

    /* ---------- helper: create gear ---------- */
    const createGear = (x, y, radius, teeth = 14) => {
        const gear = Bodies.circle(x, y, radius, {
            friction: 0.02,
            frictionAir: 0.002,
            restitution: 0.95,     // 🔥 bounce on walls
            density: 0.004,
            inertia: Infinity,
            render: { fillStyle: "#94a3b8" }
        });

        gear._gear = { radius, teeth };
        gears.push(gear);
        World.add(engine.world, gear);
        return gear;
    };

    /* ---------- gears ---------- */
    const centerY = h / 2;

    const crank = createGear(w / 2 - 220, centerY, 32, 10);
    const gearA = createGear(w / 2 - 120, centerY, 48, 16);
    const gearB = createGear(w / 2 + 20, centerY, 72, 24);
    const gearC = createGear(w / 2 + 180, centerY, 40, 12);

    /* ---------- spacing ---------- */
    const meshDistance = (g1, g2) =>
        g1._gear.radius + g2._gear.radius - 2;

    Body.setPosition(gearA, {
        x: crank.position.x + meshDistance(crank, gearA),
        y: centerY
    });

    Body.setPosition(gearB, {
        x: gearA.position.x + meshDistance(gearA, gearB),
        y: centerY
    });

    Body.setPosition(gearC, {
        x: gearB.position.x + meshDistance(gearB, gearC),
        y: centerY
    });

    /* =====================================================
       🔥 BOUNDARY WALLS (REFLECTIVE GEARBOX)
       ===================================================== */
    const t = 40;

    const walls = [
        Bodies.rectangle(w / 2, -t / 2, w, t, {
            isStatic: true, restitution: 1
        }),
        Bodies.rectangle(w / 2, h + t / 2, w, t, {
            isStatic: true, restitution: 1
        }),
        Bodies.rectangle(-t / 2, h / 2, t, h, {
            isStatic: true, restitution: 1
        }),
        Bodies.rectangle(w + t / 2, h / 2, t, h, {
            isStatic: true, restitution: 1
        })
    ];

    World.add(engine.world, walls);

    /* ---------- motor + gear ratio ---------- */
    const MOTOR_SPEED = 0.035;

    const beforeUpdate = () => {
        Body.setAngularVelocity(crank, MOTOR_SPEED);

        for (let i = 0; i < gears.length - 1; i++) {
            const g1 = gears[i];
            const g2 = gears[i + 1];

            const ratio = g1._gear.radius / g2._gear.radius;
            Body.setAngularVelocity(g2, -g1.angularVelocity * ratio);
        }
    };

    Events.on(engine, "beforeUpdate", beforeUpdate);

    /* ---------- draw teeth ---------- */
    const afterRender = () => {
        const ctx = render.context;
        if (!ctx) return;

        ctx.save();
        gears.forEach(g => {
            const r = g._gear.radius;
            const teeth = g._gear.teeth;

            ctx.translate(g.position.x, g.position.y);
            ctx.rotate(g.angle);

            ctx.strokeStyle = "rgba(255,255,255,0.35)";
            ctx.lineWidth = 2;

            for (let i = 0; i < teeth; i++) {
                const a = (i / teeth) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
                ctx.lineTo(Math.cos(a) * (r + 6), Math.sin(a) * (r + 6));
                ctx.stroke();
            }
            ctx.resetTransform();
        });
        ctx.restore();
    };

    Events.on(render, "afterRender", afterRender);

    /* ---------- cleanup ---------- */
    const cleanup = () => {
        Events.off(engine, "beforeUpdate", beforeUpdate);
        Events.off(render, "afterRender", afterRender);
        try {
            Composite.remove(engine.world, gears);
            Composite.remove(engine.world, walls);
        } catch (e) { }
    };

    return cleanup;
}


export function AngryBirdsSlingshotDemo({ engine, render }) {
    const { Bodies, Body, World, Composite, Constraint, Events, Mouse, MouseConstraint } = Matter;

    // Clear world
    Composite.clear(engine.world, false);
    engine.gravity.y = 0.9;

    const w = render.options.width;
    const h = render.options.height;

    const anchor = { x: 160, y: h - 120 };
    const birds = [];
    let currentBird = 0;
    let sling = null;

    // Ground
    const ground = Bodies.rectangle(w / 2, h + 30, w, 60, {
        isStatic: true,
        render: { fillStyle: "#334155" }
    });

    // Slingshot posts
    const postLeft = Bodies.rectangle(anchor.x - 12, anchor.y + 40, 14, 90, {
        isStatic: true,
        render: { fillStyle: "#7c2d12" }
    });
    const postRight = Bodies.rectangle(anchor.x + 12, anchor.y + 40, 14, 90, {
        isStatic: true,
        render: { fillStyle: "#7c2d12" }
    });

    World.add(engine.world, [ground, postLeft, postRight]);

    // Birds
    for (let i = 0; i < 3; i++) {
        const bird = Bodies.circle(anchor.x, anchor.y, 14, {
            density: 0.006,     // 🔥 was 0.004
            restitution: 0.4,
            friction: 0.6,
            frictionAir: 0.0005,
            label: "bird",
            render: { fillStyle: "#dc2626" }
        });

        birds.push(bird);
        World.add(engine.world, bird);
    }

    // Blocks
    const blocks = [];
    const startX = w - 260, startY = h - 80;
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 3; x++) {
            blocks.push(
                Bodies.rectangle(startX + x * 36, startY - y * 34, 32, 28, {
                    density: 0.0015,
                    restitution: 0.1,
                    friction: 0.8,
                    label: "block",
                    render: { fillStyle: "#fbbf24" }
                })
            );
        }
    }
    World.add(engine.world, blocks);

    // Sling
    const createSling = () => {
        if (sling) World.remove(engine.world, sling);
        sling = Constraint.create({
            pointA: anchor,
            bodyB: birds[currentBird],
            stiffness: 0.035,   // 🔥 increase
            damping: 0.02,
            length: 0
        });

        World.add(engine.world, sling);
    };
    createSling();

    // Mouse
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.08,
            render: { visible: false }
        }
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Release detection
    Events.on(mouseConstraint, "enddrag", (e) => {
        if (sling) {
            World.remove(engine.world, sling);
            sling = null;
        }

        const bird = birds[currentBird];
        Body.setAngularVelocity(bird, 0);

        setTimeout(() => {
            currentBird++;
            if (currentBird < birds.length) createSling();
        }, 600);
    });


    // Rubber band render
    Events.on(render, "afterRender", () => {
        const ctx = render.context;
        const bird = birds[currentBird];
        if (!bird) return;

        ctx.save();
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(anchor.x - 10, anchor.y);
        ctx.lineTo(bird.position.x, bird.position.y);
        ctx.lineTo(anchor.x + 10, anchor.y);
        ctx.stroke();
        ctx.restore();
    });

    return () => {
        World.remove(engine.world, mouseConstraint);
    };
}

export function CatapultDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Constraint,
        Events,
        Mouse,
        MouseConstraint
    } = Matter;

    // ========= RESET =========
    Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic) World.remove(engine.world, b);
    });
    Composite.allConstraints(engine.world).forEach(c =>
        World.remove(engine.world, c)
    );

    engine.gravity.x = 0;
    engine.gravity.y = 1;

    const w = render.options.width;
    const h = render.options.height;

    // ========= CONFIG =========
    const anchor = { x: 130, y: h - 120 };
    const TOTAL_BALLS = 3;

    let balls = [];
    let currentBallIndex = 0;
    let currentBall = null;
    let sling = null;

    // ========= GROUND =========
    const ground = Bodies.rectangle(w / 2, h + 20, w, 60, {
        isStatic: true,
        render: { fillStyle: "#334155" }
    });
    World.add(engine.world, ground);

    // ========= BASE =========
    const base = Bodies.rectangle(anchor.x, anchor.y + 40, 80, 20, {
        isStatic: true,
        render: { fillStyle: "#7c2d12" }
    });
    World.add(engine.world, base);

    // ========= CREATE BALL =========
    const createBall = () => {
        const ball = Bodies.circle(anchor.x, anchor.y, 16, {
            density: 0.007,
            restitution: 0.4,
            friction: 0.6,
            frictionAir: 0.0005,
            label: "stone",
            render: { fillStyle: "#555" }
        });
        balls.push(ball);
        World.add(engine.world, ball);
        return ball;
    };

    // ========= CREATE SLING =========
    const createSling = () => {
        if (sling) World.remove(engine.world, sling);
        sling = Constraint.create({
            pointA: anchor,
            bodyB: currentBall,
            stiffness: 0.1,   // tuned power
            damping: 0.02,
            length: 0
        });
        World.add(engine.world, sling);
    };

    // ========= INIT FIRST BALL =========
    currentBall = createBall();
    createSling();

    // ========= BLOCK TOWER =========
    const blocks = [];
    const rows = 10;
    const cols = 4;
    const startX = w - 320;
    const startY = h - 40;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const block = Bodies.rectangle(
                startX + x * 38,
                startY - y * 30,
                34,
                26,
                {
                    density: 0.0015,
                    restitution: 0.1,
                    friction: 0.8,
                    label: "block",
                    render: { fillStyle: "#fbbf24" }
                }
            );
            blocks.push(block);
        }
    }
    World.add(engine.world, blocks);

    // ========= MOUSE =========
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 2,
            render: { visible: false }
        }
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // ========= RELEASE LOGIC =========
    Events.on(mouseConstraint, "enddrag", e => {
        if (e.body === currentBall && sling) {
            // allow elastic force to apply
            setTimeout(() => {
                World.remove(engine.world, sling);
                sling = null;
            }, 30);

            // next ball
            setTimeout(() => {
                currentBallIndex++;

                if (currentBallIndex < TOTAL_BALLS) {
                    currentBall = createBall();
                    createSling();
                }
            }, 700);
        }
    });

    // ========= RUBBER BAND =========
    const afterRender = () => {
        if (!currentBall || !sling) return;

        const ctx = render.context;
        ctx.save();
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(anchor.x, anchor.y);
        ctx.lineTo(currentBall.position.x, currentBall.position.y);
        ctx.stroke();
        ctx.restore();
    };
    Events.on(render, "afterRender", afterRender);

    // ========= CLEANUP =========
    const cleanup = () => {
        Events.off(render, "afterRender", afterRender);
        try {
            Composite.remove(engine.world, [
                ...balls,
                ...blocks,
                ground,
                base
            ]);
        } catch (e) { }
    };

    return cleanup;
}

export function JengaPhysicsDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Events,
        Mouse,
        MouseConstraint
    } = Matter;

    // ================= RESET =================
    Composite.allBodies(engine.world).forEach(b => {
        if (!b.isStatic) World.remove(engine.world, b);
    });
    Composite.allConstraints(engine.world).forEach(c =>
        World.remove(engine.world, c)
    );

    engine.gravity.y = 1;

    const w = render.options.width;
    const h = render.options.height;

    // ================= GROUND =================
    const ground = Bodies.rectangle(w / 2, h + 30, w, 60, {
        isStatic: true,
        render: { fillStyle: "#1f2933" }
    });
    World.add(engine.world, ground);

    // ================= JENGA TOWER =================
    const blocks = [];
    const levels = 16;
    const blockL = 70;
    const blockW = 22;
    const blockH = 16;

    const startX = w / 2;
    const startY = h - 40;

    for (let i = 0; i < levels; i++) {
        const isHorizontal = i % 2 === 0;

        for (let j = 0; j < 3; j++) {
            const x = isHorizontal
                ? startX + (j - 1) * blockW
                : startX;

            const y = startY - i * blockH;

            const block = Bodies.rectangle(
                x,
                y,
                isHorizontal ? blockL : blockW,
                isHorizontal ? blockW : blockL,
                {
                    density: 0.0025,
                    friction: 0.9,
                    restitution: 0.02,
                    label: "jenga",
                    render: { fillStyle: "#d97706" }
                }
            );

            blocks.push(block);
        }
    }
    World.add(engine.world, blocks);

    // ================= MOUSE =================
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.08,
            render: { visible: false }
        }
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // ================= HIGHLIGHT ACTIVE BLOCK =================
    let hovered = null;

    Events.on(mouseConstraint, "mousemove", e => {
        hovered = e.body;
    });

    const afterRender = () => {
        if (!hovered || hovered.label !== "jenga") return;
        const ctx = render.context;
        ctx.save();
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.strokeRect(
            hovered.position.x - hovered.bounds.max.x + hovered.position.x,
            hovered.position.y - hovered.bounds.max.y + hovered.position.y,
            hovered.bounds.max.x - hovered.bounds.min.x,
            hovered.bounds.max.y - hovered.bounds.min.y
        );
        ctx.restore();
    };

    Events.on(render, "afterRender", afterRender);

    // ================= CLEANUP =================
    const cleanup = () => {
        Events.off(render, "afterRender", afterRender);
        try {
            Composite.remove(engine.world, [...blocks, ground]);
        } catch (e) { }
    };

    return cleanup;
}

export function SharedPhysicsPlaygroundDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Constraint,
        Events,
        Mouse,
        MouseConstraint
    } = Matter;

    engine.gravity.y = 1;

    const w = render.options.width;
    const h = render.options.height;

    const cleanups = [];

    // ==================================================
    // 🌍 BASE WORLD
    // ==================================================
    const ground = Bodies.rectangle(w / 2, h + 30, w, 60, {
        isStatic: true,
        render: { fillStyle: "#1f2937" }
    });
    World.add(engine.world, ground);
    cleanups.push(() => World.remove(engine.world, ground));

    // ==================================================
    // 🧱 JENGA (CENTER)
    // ==================================================
    const jengaBlocks = [];
    const levels = 14;
    const blockL = 70;
    const blockW = 22;
    const blockH = 16;
    const centerX = w / 2;

    for (let i = 0; i < levels; i++) {
        const horizontal = i % 2 === 0;

        for (let j = 0; j < 3; j++) {
            const block = Bodies.rectangle(
                horizontal
                    ? centerX + (j - 1) * blockW
                    : centerX,
                h - 50 - i * blockH,
                horizontal ? blockL : blockW,
                horizontal ? blockW : blockL,
                {
                    density: 0.0025,
                    friction: 0.9,
                    restitution: 0.02,
                    label: "jenga",
                    render: { fillStyle: "#d97706" }
                }
            );
            jengaBlocks.push(block);
        }
    }
    World.add(engine.world, jengaBlocks);
    cleanups.push(() =>
        jengaBlocks.forEach(b => World.remove(engine.world, b))
    );

    // ==================================================
    // 🏹 CATAPULT (LEFT)
    // ==================================================
    const catapultAnchor = { x: 160, y: h - 120 };

    const catapultBall = Bodies.circle(
        catapultAnchor.x,
        catapultAnchor.y,
        18,
        {
            density: 0.01,
            restitution: 0.4,
            frictionAir: 0.0005,
            label: "catapultBall",
            render: { fillStyle: "#ef4444" }
        }
    );

    const sling = Constraint.create({
        pointA: catapultAnchor,
        bodyB: catapultBall,
        stiffness: 0.08,
        damping: 0.1
    });

    World.add(engine.world, [catapultBall, sling]);

    let catapultDragging = false;

    // ==================================================
    // 💣 CANNON (RIGHT)
    // ==================================================
    const cannon = { x: w - 160, y: h - 80 };
    let cannonBall = null;
    let cannonDragging = false;

    const createCannonBall = () => {
        cannonBall = Bodies.circle(cannon.x, cannon.y, 16, {
            density: 0.02,
            restitution: 0.2,
            frictionAir: 0.0003,
            label: "cannonBall",
            render: { fillStyle: "#475569" }
        });
        World.add(engine.world, cannonBall);
    };

    createCannonBall();

    // ==================================================
    // 🖱️ MOUSE (SHARED)
    // ==================================================
    const mouse = Mouse.create(render.canvas);
    render.mouse = mouse;

    Events.on(mouse, "mousedown", e => {
        const p = e.mouse.position;

        if (
            Matter.Vector.magnitude(
                Matter.Vector.sub(p, catapultBall.position)
            ) < 25
        ) {
            catapultDragging = true;
        }

        if (
            cannonBall &&
            Matter.Vector.magnitude(
                Matter.Vector.sub(p, cannon)
            ) < 40
        ) {
            cannonDragging = true;
        }
    });

    Events.on(mouse, "mousemove", e => {
        if (catapultDragging) {
            Body.setPosition(catapultBall, e.mouse.position);
        }
        if (cannonDragging && cannonBall) {
            Body.setPosition(cannonBall, e.mouse.position);
        }
    });

    Events.on(mouse, "mouseup", () => {
        // CATAPULT RELEASE
        if (catapultDragging) {
            catapultDragging = false;
            World.remove(engine.world, sling);

            const dx = catapultAnchor.x - catapultBall.position.x;
            const dy = catapultAnchor.y - catapultBall.position.y;

            Body.setVelocity(catapultBall, {
                x: dx * 0.35,
                y: dy * 0.35
            });
        }

        // CANNON FIRE
        if (cannonDragging && cannonBall) {
            cannonDragging = false;

            const dx = cannon.x - cannonBall.position.x;
            const dy = cannon.y - cannonBall.position.y;

            Body.setVelocity(cannonBall, {
                x: dx * 0.45,
                y: dy * 0.45
            });

            setTimeout(createCannonBall, 1200);
            cannonBall = null;
        }
    });

    // ==================================================
    // 🎨 VISUAL BANDS
    // ==================================================
    const afterRender = () => {
        const ctx = render.context;
        ctx.save();

        // catapult band
        if (catapultDragging) {
            ctx.strokeStyle = "#7c2d12";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(catapultAnchor.x, catapultAnchor.y);
            ctx.lineTo(catapultBall.position.x, catapultBall.position.y);
            ctx.stroke();
        }

        // cannon aim
        if (cannonDragging && cannonBall) {
            ctx.strokeStyle = "#dc2626";
            ctx.beginPath();
            ctx.moveTo(cannon.x, cannon.y);
            ctx.lineTo(cannonBall.position.x, cannonBall.position.y);
            ctx.stroke();
        }

        ctx.restore();
    };
    Events.on(render, "afterRender", afterRender);
    cleanups.push(() =>
        Events.off(render, "afterRender", afterRender)
    );

    // ==================================================
    // 🧹 CLEANUP
    // ==================================================
    return () => {
        cleanups.forEach(fn => fn && fn());
    };
}

export function BridgeStressTestDemo({ engine, render }) {
    const {
        Bodies,
        Body, // ✅ FIX
        World,
        Composite,
        Constraint,
        Events,
        Mouse,
        MouseConstraint
    } = Matter;

    Composite.clear(engine.world, false);
    engine.gravity.y = 0;

    const w = render.options.width;
    const h = render.options.height;

    // ===== GROUND =====
    const ground = Bodies.rectangle(w / 2, h + 40, w, 80, {
        isStatic: true,
        friction: 1
    });
    World.add(engine.world, ground);

    // ===== PILLARS =====
    const left = Bodies.rectangle(200, h - 140, 50, 260, { isStatic: true });
    const right = Bodies.rectangle(w - 200, h - 140, 50, 260, { isStatic: true });
    World.add(engine.world, [left, right]);

    // ===== BRIDGE =====
    const planks = [];
    const constraints = [];

    const COUNT = 14;
    const PLANK_W = 56;
    const PLANK_H = 14;
    const Y = h - 260;

    const startX = left.position.x + 60;
    const endX = right.position.x - 60;
    const GAP = (endX - startX) / (COUNT - 1);

    for (let i = 0; i < COUNT; i++) {
        const plank = Bodies.rectangle(startX + i * GAP, Y, PLANK_W, PLANK_H, {
            isStatic: true,
            friction: 0.9,
            frictionStatic: 1.5,
            restitution: 0,
            render: { fillStyle: "#22c55e" }
        });
        planks.push(plank);
    }

    for (let i = 1; i < planks.length; i++) {
        constraints.push(
            Constraint.create({
                bodyA: planks[i - 1],
                bodyB: planks[i],
                stiffness: 1,
                length: GAP
            })
        );
    }

    constraints.push(
        Constraint.create({ bodyA: left, bodyB: planks[0], stiffness: 0.95, length: 30 }),
        Constraint.create({ bodyA: right, bodyB: planks[planks.length - 1], stiffness: 0.95, length: 30 })
    );

    World.add(engine.world, [...planks, ...constraints]);

    setTimeout(() => (engine.gravity.y = 1), 1000);

    // ===== LOAD SYSTEM =====
    let loadCount = 0;
    const BREAK_AT = 10;

    const updateBridgeColor = () => {
        let color = "#22c55e";
        if (loadCount >= 6 && loadCount <= 7) color = "#eab308";
        if (loadCount >= 8 && loadCount <= 9) color = "#f97316";
        if (loadCount >= 10) color = "#dc2626";
        planks.forEach(p => (p.render.fillStyle = color));
    };

    const breakBridge = () => {
        planks.forEach(p => {
            Body.setStatic(p, false); // ✅ NOW WORKS
            p.friction = 0.6;
            p.frictionStatic = 0.4;
        });

        constraints.forEach(c => World.remove(engine.world, c));
    };

    const spawnLoad = () => {
        if (loadCount >= BREAK_AT) return;

        const load = Bodies.rectangle(
            w / 2 + (Math.random() - 0.5) * 80,
            -40,
            50,
            40,
            {
                density: 0.03,
                friction: 0.9,
                frictionStatic: 1.4,
                restitution: 0,
                label: "load",
                render: { fillStyle: "#475569" }
            }
        );

        World.add(engine.world, load);

        loadCount++;
        updateBridgeColor();

        if (loadCount === BREAK_AT) {
            breakBridge(); // 💥 COLLAPSE
        }
    };

    const interval = setInterval(spawnLoad, 1200);

    // ===== LOAD REMOVE =====
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, "mousedown", e => {
        const bodies = Composite.allBodies(engine.world);
        const clicked = Matter.Query.point(bodies, e.mouse.position);

        clicked.forEach(b => {
            if (b.label === "load") {
                World.remove(engine.world, b);
                loadCount = Math.max(0, loadCount - 1);
                updateBridgeColor();
            }
        });
    });

    // ===== CLEANUP =====
    return () => {
        clearInterval(interval);
        Composite.clear(engine.world, false);
    };
}

export function VehicleSuspensionDemo({ engine, render }) {
    const { Bodies, Body, World, Composite, Constraint, Events } = Matter;

    // ===== RESET =====
    Composite.clear(engine.world, false);
    engine.gravity.y = 1;

    const w = render.options.width;
    const h = render.options.height;

    // ================== TERRAIN ==================
    const groundBlocks = [];
    const blockWidth = 180;
    let lastX = 0;

    // Smooth, climbable bump generator
    const createBlock = (x) => {
        const type = Math.random();
        let height = 35;
        let yOffset = 0;

        if (type < 0.6) height = 35; // flat
        else {
            height = 45 + Math.random() * 5; // gentle bump 45–50px
            yOffset = height / 4;
        }

        const block = Bodies.rectangle(
            x,
            h - height / 2 - yOffset,
            blockWidth,
            height,
            { isStatic: true, friction: 1, render: { fillStyle: "#334155" } }
        );

        groundBlocks.push(block);
        World.add(engine.world, block);
    };

    // initial terrain
    while (lastX < w * 2) {
        createBlock(lastX);
        lastX += blockWidth;
    }

    // ================== CAR ==================
    const chassis = Bodies.rectangle(300, h - 260, 140, 32, {
        density: 0.006,
        friction: 0.6,
        inertia: Infinity,
        render: { fillStyle: "#0ea5e9" }
    });

    const wheelRadius = 22;
    const wheelOffsetX = 50;
    const wheelOffsetY = 30;

    const wheelLeft = Bodies.circle(
        chassis.position.x - wheelOffsetX,
        chassis.position.y + wheelOffsetY,
        wheelRadius,
        { friction: 2, frictionStatic: 1.8, density: 0.0035 }
    );

    const wheelRight = Bodies.circle(
        chassis.position.x + wheelOffsetX,
        chassis.position.y + wheelOffsetY,
        wheelRadius,
        { friction: 2, frictionStatic: 1.8, density: 0.0035 }
    );

    // ================== SUSPENSION ==================
    const suspension = {
        stiffness: 0.75, // softer for smooth bump feel
        damping: 0.25,
        length: wheelOffsetY + 6 // slightly longer travel
    };

    const springLeft = Constraint.create({
        bodyA: chassis,
        pointA: { x: -wheelOffsetX, y: 16 },
        bodyB: wheelLeft,
        ...suspension
    });

    const springRight = Constraint.create({
        bodyA: chassis,
        pointA: { x: wheelOffsetX, y: 16 },
        bodyB: wheelRight,
        ...suspension
    });

    World.add(engine.world, [chassis, wheelLeft, wheelRight, springLeft, springRight]);

    // ================== CONTROLS ==================
    const keys = { left: false, right: false };
    const down = e => { if (e.key === "ArrowRight") keys.right = true; if (e.key === "ArrowLeft") keys.left = true; };
    const up = e => { if (e.key === "ArrowRight") keys.right = false; if (e.key === "ArrowLeft") keys.left = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    // ================== ENGINE LOOP ==================
    const roadSpeed = 3; // road movement speed when user presses keys

    Events.on(engine, "beforeUpdate", () => {
        const driveForce = 0.015;

        let userMoving = false;

        // DRIVE
        if (keys.right) {
            Body.applyForce(wheelLeft, wheelLeft.position, { x: driveForce, y: 0 });
            Body.applyForce(wheelRight, wheelRight.position, { x: driveForce, y: 0 });
            userMoving = true;
        }
        if (keys.left) {
            Body.applyForce(wheelLeft, wheelLeft.position, { x: -driveForce, y: 0 });
            Body.applyForce(wheelRight, wheelRight.position, { x: -driveForce, y: 0 });
            userMoving = true;
        }

        // ================== MOVE ROAD IF USER MOVES ==================
        if (userMoving) {
            const dir = keys.right ? -1 : 1; // left/right scroll
            for (let block of groundBlocks) {
                Body.translate(block, { x: roadSpeed * dir, y: 0 });
            }

            // add new blocks ahead
            while (lastX < chassis.position.x + w * 1.5) {
                createBlock(lastX);
                lastX += blockWidth;
            }

            // remove old blocks behind
            while (groundBlocks.length && groundBlocks[0].position.x < -blockWidth * 2) {
                World.remove(engine.world, groundBlocks.shift());
            }
        }
    });

    // ================== CLEANUP ==================
    return () => {
        window.removeEventListener("keydown", down);
        window.removeEventListener("keyup", up);
        Composite.clear(engine.world, false);
    };
}

export function MagneticFieldPhysicsDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Events,
        Mouse,
        MouseConstraint
    } = Matter;

    // ===== RESET =====
    Composite.clear(engine.world, false);
    engine.gravity.y = 0;

    const w = render.options.width;
    const h = render.options.height;

    // ===== MODE =====
    let isAttract = true; // 🔁 toggle mode

    // ===== MAGNETS =====
    const magnetLeft = Bodies.circle(w / 2 - 150, h / 2, 30, {
        label: "magnet",
        inertia: Infinity,        // ❄ no rotation
        mass: 50,                 // 🔥 heavy magnet
        frictionAir: 0.05,
        render: { fillStyle: "#2563eb" }
    });

    const magnetRight = Bodies.circle(w / 2 + 150, h / 2, 30, {
        label: "magnet",
        inertia: Infinity,
        mass: 50,
        frictionAir: 0.05,
        render: { fillStyle: "#dc2626" }
    });

    World.add(engine.world, [magnetLeft, magnetRight]);

    // ===== IRON PARTICLES =====
    const particles = [];
    const COUNT = 200;

    for (let i = 0; i < COUNT; i++) {
        const p = Bodies.circle(
            Math.random() * w,
            Math.random() * h,
            4,
            {
                frictionAir: 0.03,
                restitution: 0.2,
                label: "iron",
                render: { fillStyle: "#e5e7eb" }
            }
        );
        particles.push(p);
    }

    World.add(engine.world, particles);

    // ===== MAGNETIC FORCE =====
    const MAGNET_STRENGTH = 0.00018;

    Events.on(engine, "beforeUpdate", () => {
        particles.forEach(p => {
            [magnetLeft, magnetRight].forEach(m => {
                const dx = m.position.x - p.position.x;
                const dy = m.position.y - p.position.y;
                const distSq = dx * dx + dy * dy + 80;

                let direction = 1;

                // 🔁 repel / attract logic
                if (!isAttract) direction = -1;

                const force = direction * MAGNET_STRENGTH / distSq;

                Body.applyForce(p, p.position, {
                    x: dx * force,
                    y: dy * force
                });
            });
        });
    });

    // ===== DRAG MAGNETS =====
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.9,
            damping: 0.1,
            render: { visible: false }
        }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // ===== TOGGLE MODE (SPACE KEY) =====
    const toggleMode = e => {
        if (e.code === "Space") {
            isAttract = !isAttract;

            magnetLeft.render.fillStyle = isAttract ? "#2563eb" : "#7c3aed";
            magnetRight.render.fillStyle = isAttract ? "#dc2626" : "#7c3aed";
        }
    };

    window.addEventListener("keydown", toggleMode);

    // ===== BOUNDS =====
    const walls = [
        Bodies.rectangle(w / 2, -20, w, 40, { isStatic: true }),
        Bodies.rectangle(w / 2, h + 20, w, 40, { isStatic: true }),
        Bodies.rectangle(-20, h / 2, 40, h, { isStatic: true }),
        Bodies.rectangle(w + 20, h / 2, 40, h, { isStatic: true })
    ];
    World.add(engine.world, walls);

    // ===== CLEANUP =====
    return () => {
        window.removeEventListener("keydown", toggleMode);
        Events.off(engine, "beforeUpdate");
        Composite.clear(engine.world, false);
    };
}

export function ClothWindZoneDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Constraint,
        Events,
        Mouse,
        MouseConstraint,
        Query
    } = Matter;

    Composite.clear(engine.world, false);
    engine.gravity.y = 1;

    const w = render.options.width;
    const h = render.options.height;
    const ctx = render.context;

    // ===== GRID CONFIG =====
    const COLS = 22;
    const ROWS = 14;
    const GAP = 26;
    const START_X = w / 2 - (COLS * GAP) / 2;
    const START_Y = 80;

    const nodes = [];
    const links = [];

    // ===== CREATE NODES =====
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const node = Bodies.circle(
                START_X + x * GAP,
                START_Y + y * GAP,
                2,
                {
                    frictionAir: 0.01,
                    density: 0.001,
                    inertia: Infinity,
                    render: { visible: false }
                }
            );

            if (y === 0) Body.setStatic(node, true);
            nodes.push(node);
        }
    }

    // ===== PHYSICS LINKS (INVISIBLE) =====
    const id = (x, y) => y * COLS + x;

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (x < COLS - 1)
                links.push(
                    Constraint.create({
                        bodyA: nodes[id(x, y)],
                        bodyB: nodes[id(x + 1, y)],
                        length: GAP,
                        stiffness: 0.9,
                        render: { visible: false }
                    })
                );

            if (y < ROWS - 1)
                links.push(
                    Constraint.create({
                        bodyA: nodes[id(x, y)],
                        bodyB: nodes[id(x, y + 1)],
                        length: GAP,
                        stiffness: 0.9,
                        render: { visible: false }
                    })
                );
        }
    }

    World.add(engine.world, [...nodes, ...links]);

    // ===== CUSTOM STRAIGHT RENDER =====
    Events.on(render, "afterRender", () => {
        ctx.beginPath();
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const a = nodes[id(x, y)];

                if (x < COLS - 1) {
                    const b = nodes[id(x + 1, y)];
                    ctx.moveTo(a.position.x, a.position.y);
                    ctx.lineTo(b.position.x, b.position.y);
                }

                if (y < ROWS - 1) {
                    const b = nodes[id(x, y + 1)];
                    ctx.moveTo(a.position.x, a.position.y);
                    ctx.lineTo(b.position.x, b.position.y);
                }
            }
        }

        ctx.stroke();
    });

    // ===== MOUSE INTERACTION (REAL FLOW) =====
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { render: { visible: false } }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, "mousemove", e => {
        if (!mouseConstraint.body) return;

        const pos = e.mouse.position;
        const near = Query.point(nodes, pos);

        near.forEach(n => {
            if (n.isStatic) return;
            Body.applyForce(n, n.position, {
                x: (pos.x - n.position.x) * 0.00001,
                y: (pos.y - n.position.y) * 0.00001
            });
        });
    });

    return () => {
        Composite.clear(engine.world, false);
    };
}

export function GlassShatterDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Events,
        Mouse,
        MouseConstraint
    } = Matter;

    // ===== RESET =====
    Composite.clear(engine.world, false);
    engine.gravity.y = 1;

    const w = render.options.width;
    const h = render.options.height;

    // ===== GROUND =====
    const ground = Bodies.rectangle(w / 2, h + 40, w, 80, {
        isStatic: true,
        friction: 1
    });
    World.add(engine.world, ground);

    // ===== GLASS PANEL =====
    const glassX = w / 2;
    const glassY = h / 2;
    const glassW = 420;
    const glassH = 220;

    let glassIntact = true;

    const glass = Bodies.rectangle(glassX, glassY, glassW, glassH, {
        isStatic: true,
        label: "glass",
        restitution: 0.02,
        friction: 0.9,
        render: {
            fillStyle: "rgba(180,220,255,0.35)",
            strokeStyle: "#93c5fd",
            lineWidth: 2
        }
    });

    World.add(engine.world, glass);

    // ===== THROW OBJECT =====
    const spawnBall = () => {
        const ball = Bodies.circle(
            120,
            h - 120,
            26,
            {
                label: "ball",
                density: 0.04,
                restitution: 0.2,
                friction: 0.6,
                render: { fillStyle: "#475569" }
            }
        );

        Body.setVelocity(ball, { x: 18, y: -6 });
        World.add(engine.world, ball);
    };

    // ===== SHATTER GLASS =====
    const shatterGlass = (impactPoint, impactVelocity) => {
        if (!glassIntact) return;
        glassIntact = false;

        World.remove(engine.world, glass);

        const shards = [];
        const SHARD_COUNT = 70;

        for (let i = 0; i < SHARD_COUNT; i++) {
            const cx = glassX - glassW / 2 + Math.random() * glassW;
            const cy = glassY - glassH / 2 + Math.random() * glassH;

            const dx = cx - impactPoint.x;
            const dy = cy - impactPoint.y;
            const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

            const size = Math.max(7, Math.min(22, dist * 0.12));

            const sides = 3 + Math.floor(Math.random() * 4);
            const verts = [];

            for (let a = 0; a < sides; a++) {
                const angle =
                    (Math.PI * 2 * a) / sides +
                    Math.random() * 0.5;

                verts.push({
                    x: cx + Math.cos(angle) * size * (0.6 + Math.random() * 0.4),
                    y: cy + Math.sin(angle) * size * (0.6 + Math.random() * 0.4)
                });
            }

            const shard = Bodies.fromVertices(
                cx,
                cy,
                verts,
                {
                    restitution: 0.03,
                    friction: 0.8,
                    frictionAir: 0.08,   // 🔑 blast killer
                    density: 0.0025,
                    render: {
                        fillStyle: "rgba(200,230,255,0.55)",
                        strokeStyle: "#bfdbfe",
                        lineWidth: 1
                    }
                },
                true
            );

            // ===== VERY SUBTLE IMPULSE =====
            const distanceFactor = Math.min(dist / 180, 1);
            const forceMag =
                impactVelocity * 0.00008 * (1 - distanceFactor);

            Body.applyForce(shard, shard.position, {
                x: (dx / dist) * forceMag,
                y: (dy / dist) * forceMag
            });

            shards.push(shard);
        }

        World.add(engine.world, shards);
    };

    // ===== COLLISION DETECTION =====
    Events.on(engine, "collisionStart", event => {
        if (!glassIntact) return;

        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;

            const glassBody =
                bodyA.label === "glass"
                    ? bodyA
                    : bodyB.label === "glass"
                    ? bodyB
                    : null;

            const other =
                glassBody === bodyA ? bodyB : bodyA;

            if (!glassBody || !other) return;

            const speed = other.speed;

            if (speed > 6) {
                glass.render.fillStyle = "rgba(253,224,71,0.45)";
            }
            if (speed > 9) {
                glass.render.fillStyle = "rgba(249,115,22,0.5)";
            }

            if (speed > 11) {
                shatterGlass(pair.collision.supports[0], speed);
            }
        });
    });

    // ===== MOUSE =====
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, "mousedown", () => {
        if (glassIntact) spawnBall();
    });

    // ===== CLEANUP =====
    return () => {
        Composite.clear(engine.world, false);
    };
}

export function WindTunnelLabDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Events,
        Mouse,
        MouseConstraint
    } = Matter;

    Composite.clear(engine.world, false);
    engine.gravity.y = 0;

    const w = render.options.width;
    const h = render.options.height;
    const ctx = render.context;

    // ===== BOUNDARY =====
    World.add(engine.world, [
        Bodies.rectangle(w / 2, -30, w, 60, { isStatic: true }),
        Bodies.rectangle(w / 2, h + 30, w, 60, { isStatic: true }),
        Bodies.rectangle(-30, h / 2, 60, h, { isStatic: true }),
        Bodies.rectangle(w + 30, h / 2, 60, h, { isStatic: true })
    ]);

    // ===== OBJECTS =====
    const paper = Bodies.rectangle(200, 200, 80, 40, {
        density: 0.0004,
        frictionAir: 0.02,
        render: { fillStyle: "#f8fafc" }
    });

    const block = Bodies.rectangle(200, 340, 40, 40, {
        density: 0.004,
        frictionAir: 0.01,
        render: { fillStyle: "#475569" }
    });

    World.add(engine.world, [paper, block]);

    // ===== ZONES =====
    const windOn = { value: false };

    const laminar = { x: 320, y: 80, w: 360, h: 420 };
    const turbulent = { x: 720, y: 80, w: 360, h: 420 };

    let t = 0;

    Events.on(engine, "beforeUpdate", () => {
        if (!windOn.value) return;
        t += 0.02;

        [paper, block].forEach(b => {
            const area = b.bounds.max.x - b.bounds.min.x;

            // Laminar = straight push
            if (
                b.position.x > laminar.x &&
                b.position.x < laminar.x + laminar.w
            ) {
                Body.applyForce(b, b.position, {
                    x: 0.00004 * area,
                    y: 0
                });
            }

            // Turbulent = shake
            if (
                b.position.x > turbulent.x &&
                b.position.x < turbulent.x + turbulent.w
            ) {
                Body.applyForce(b, b.position, {
                    x: 0.00003 * area,
                    y: Math.sin(t + b.position.y * 0.05) * 0.00002
                });
            }
        });
    });

    // ===== VISUAL GUIDE =====
    Events.on(render, "afterRender", () => {
        ctx.save();

        // Laminar box
        ctx.strokeStyle = "rgba(59,130,246,0.8)";
        ctx.strokeRect(laminar.x, laminar.y, laminar.w, laminar.h);
        ctx.fillStyle = "#3b82f6";
        ctx.fillText("LAMINAR WIND →", laminar.x + 10, laminar.y - 10);

        // Turbulent box
        ctx.strokeStyle = "rgba(239,68,68,0.8)";
        ctx.strokeRect(turbulent.x, turbulent.y, turbulent.w, turbulent.h);
        ctx.fillStyle = "#ef4444";
        ctx.fillText("TURBULENT WIND", turbulent.x + 10, turbulent.y - 10);

        // Status
        ctx.fillStyle = windOn.value ? "#22c55e" : "#f87171";
        ctx.fillText(
            windOn.value ? "WIND: ON (double-click to stop)" : "WIND: OFF (double-click to start)",
            20,
            30
        );

        ctx.restore();
    });

    // ===== MOUSE =====
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { render: { visible: false } }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    render.canvas.addEventListener("dblclick", () => {
        windOn.value = !windOn.value;
    });

    return () => Composite.clear(engine.world, false);
}

export function CannonDefenseDemo({ engine, render }) {
    const {
        Bodies,
        Body,
        World,
        Composite,
        Constraint,
        Events,
        Mouse,
        MouseConstraint,
        Vector
    } = Matter;

    Composite.clear(engine.world, false);
    engine.gravity.y = 1;

    const w = render.options.width;
    const h = render.options.height;

    // ================= GROUND =================
    const ground = Bodies.rectangle(w / 2, h + 40, w, 80, {
        isStatic: true,
        friction: 1
    });
    World.add(engine.world, ground);

    // ================= CANNON BASE =================
    const cannonBase = Bodies.rectangle(140, h - 80, 120, 60, {
        isStatic: true,
        render: { fillStyle: "#1e293b" }
    });

    // ================= CANNON BARREL =================
    const cannonBarrel = Bodies.rectangle(190, h - 110, 140, 24, {
        isStatic: true,
        render: { fillStyle: "#334155" }
    });

    World.add(engine.world, [cannonBase, cannonBarrel]);

    // ================= DRAG AIM SYSTEM =================
    let isDragging = false;
    let dragStart = null;
    let currentPower = 8;
    const MAX_POWER = 0.9; // 🔥 SIEGE LEVEL

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.1, render: { visible: false } }
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, "mousedown", e => {
        isDragging = true;
        dragStart = { ...e.mouse.position };
    });

    Events.on(mouseConstraint, "mousemove", e => {
        if (!isDragging) return;

        const dx = dragStart.x - e.mouse.position.x;
        const dy = dragStart.y - e.mouse.position.y;

        const angle = Math.atan2(dy, dx);
        Body.setAngle(cannonBarrel, angle);

        const dist = Math.min(120, Vector.magnitude({ x: dx, y: dy }));
        currentPower = (dist / 120) * MAX_POWER;
    });

    Events.on(mouseConstraint, "mouseup", () => {
        if (!isDragging) return;
        isDragging = false;

        // ===== FIRE =====
        const angle = cannonBarrel.angle;
        const ball = Bodies.circle(
    cannonBarrel.position.x + Math.cos(angle) * 90,
    cannonBarrel.position.y + Math.sin(angle) * 90,
    20,
    {
        density: 0.01,        // 🔥 HEAVIER BALL
        friction: 0.9,
        restitution: 0.02,
        frictionAir: 0.015,
        label: "ball",
        render: { fillStyle: "#020617" }
    }
);


        World.add(engine.world, ball);

        Body.applyForce(ball, ball.position, {
            x: Math.cos(angle) * currentPower,
            y: Math.sin(angle) * currentPower
        });

        currentPower = 0;
    });

    // ================= ENEMY SYSTEM =================
    let gameOver = false;

    const spawnEnemy = () => {
    if (gameOver) return;

    const enemy = Bodies.rectangle(
        cannonBase.position.x + 380,   // 👈 cannon ke SAMNE
        h - 120,
        50,
        50,
        {
            density: 0.03,
            friction: 0.9,
            restitution: 0.05,
            label: "enemy",
            render: { fillStyle: "#7c2d12" }
        }
    );

    // 👇 slow but deadly approach
    Body.setVelocity(enemy, { x: -1.6, y: 0 });

    World.add(engine.world, enemy);
};


    const enemyInterval = setInterval(spawnEnemy, 1600);

    // ================= COLLISION (GAME OVER) =================
    Events.on(engine, "collisionStart", e => {
        e.pairs.forEach(p => {
            const a = p.bodyA;
            const b = p.bodyB;

            if (
                (a.label === "enemy" && b === cannonBase) ||
                (b.label === "enemy" && a === cannonBase)
            ) {
                gameOver = true;
                engine.timing.timeScale = 0.3; // slow-mo death
                clearInterval(enemyInterval);
            }
        });
    });

    // ================= CLEANUP =================
    return () => {
        clearInterval(enemyInterval);
        Composite.clear(engine.world, false);
    };
}
