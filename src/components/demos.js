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
        } catch (e) {}
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
