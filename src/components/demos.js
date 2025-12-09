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
    const { Bodies, Constraint, Composites, World, Body } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    const wallThickness = 60;

    // ==== Walls & Floor ====
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

    // ==== ROPE BRIDGE ====
    const segmentW = 60;
    const segmentH = 24;
    const segments = 12;

    const bridgeY = height * 0.45;
    const bridgeX = width * 0.15;

    const rope = Composites.stack(
        bridgeX, bridgeY,
        segments, 1,
        0, 0,
        (x, y) => Bodies.rectangle(x, y, segmentW, segmentH, {
            friction: 0.6,
            density: 0.002,
            render: { fillStyle: "#8b8f95" }
        })
    );

    Composites.chain(rope, 0.4, 0, 0.6, 0, {
        stiffness: 1,
        render: { visible: true, strokeStyle: "#94a3b8", lineWidth: 3 }
    });

    const anchorLeft = Bodies.rectangle(
        bridgeX - 40,
        bridgeY,
        20, 20,
        { isStatic: true, render: { fillStyle: "#f8fafc" } }
    );
    const anchorRight = Bodies.rectangle(
        bridgeX + segments * segmentW + 40,
        bridgeY,
        20, 20,
        { isStatic: true, render: { fillStyle: "#f8fafc" } }
    );

    World.add(engine.world, [anchorLeft, anchorRight]);

    World.add(engine.world,
        Constraint.create({
            bodyA: rope.bodies[0],
            pointB: anchorLeft.position,
            stiffness: 1,
            render: { visible: true, strokeStyle: "#94a3b8", lineWidth: 3 }
        })
    );

    World.add(engine.world,
        Constraint.create({
            bodyA: rope.bodies[rope.bodies.length - 1],
            pointB: anchorRight.position,
            stiffness: 1,
            render: { visible: true, strokeStyle: "#94a3b8", lineWidth: 3 }
        })
    );

    World.add(engine.world, rope);

    // ==== PLAYER BODY ====
    const playerWidth = 26;
    const playerHeight = 48;

    const player = Bodies.rectangle(
        bridgeX + 40,           // start at left of bridge
        bridgeY - 40,
        playerWidth,
        playerHeight,
        {
            friction: 0.6,
            restitution: 0,
            density: 0.004,
            render: { fillStyle: "#4ade80" }  // green player
        }
    );

    // Feet for stability (small circles)
    const leftFoot = Bodies.circle(player.position.x - 10, player.position.y + 20, 6, {
        friction: 1,
        density: 0.004,
        render: { fillStyle: "#22c55e" }
    });

    const rightFoot = Bodies.circle(player.position.x + 10, player.position.y + 20, 6, {
        friction: 1,
        density: 0.004,
        render: { fillStyle: "#22c55e" }
    });

    // Constraints to keep feet attached to body
    const footConstraints = [
        Constraint.create({
            bodyA: player,
            bodyB: leftFoot,
            pointA: { x: -10, y: 22 },
            stiffness: 0.8,
            render: { visible: false }
        }),
        Constraint.create({
            bodyA: player,
            bodyB: rightFoot,
            pointA: { x: 10, y: 22 },
            stiffness: 0.8,
            render: { visible: false }
        })
    ];

    World.add(engine.world, [player, leftFoot, rightFoot, ...footConstraints]);

    // ==== PLAYER AUTO-WALK LOGIC ====
    Matter.Events.on(engine, "beforeUpdate", () => {
        // gentle walking force
        Body.setVelocity(player, { x: 1.2, y: player.velocity.y });

        // keep player upright
        Body.setAngle(player, 0);

        // adjust feet to stay underneath
        Body.setPosition(leftFoot, {
            x: player.position.x - 10,
            y: player.position.y + 22
        });

        Body.setPosition(rightFoot, {
            x: player.position.x + 10,
            y: player.position.y + 22
        });
    });

    // ==== FALLING BLOCKS ====
    for (let i = 0; i < 6; i++) {
        const box = Bodies.rectangle(
            width * 0.4 + i * 60,
            0,
            36, 36,
            {
                friction: 0.5,
                density: 0.002,
                render: { fillStyle: "#F5C45A" }
            }
        );
        World.add(engine.world, box);
    }
}

export function NewtonsCradleDemo({ engine, render }) {
    const { Composites, World, Bodies, Body } = Matter;

    const width = render.options.width;
    const height = render.options.height;

    // optional floor (so balls don't drop out of screen)  
    const floor = Bodies.rectangle(width/2, height + 50, width + 200, 100, {
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

    return () => {};
}

// ===== HelicopterRescueDemo =====
// High-quality helicopter + swinging rope + rescue crate
// Usage: export function HelicopterRescueDemo({ engine, render }) { ... }

export function HelicopterRescueDemo({ engine, render }) {
  const { Bodies, Body, Composite, Composites, Constraint, World, Events, Vector } = Matter;

  const width = render.options.width || window.innerWidth;
  const height = render.options.height || window.innerHeight;

  // --- static world (floor + side walls) ---
  const wallThickness = 80;
  const floor = Bodies.rectangle(
    width / 2,
    height + wallThickness / 2,
    width + 2 * wallThickness,
    wallThickness,
    { isStatic: true, render: { fillStyle: '#0b1220' } }
  );
  const left = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#0b1220' } });
  const right = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#0b1220' } });

  World.add(engine.world, [floor, left, right]);

  // --- some scenery buildings to rescue from ---
  const buildings = [];
  const buildingCols = 5;
  const baseX = Math.max(180, width * 0.25);
  for (let i = 0; i < buildingCols; i++) {
    const bw = 90 + Math.round(Math.random() * 40);
    const bh = 160 + Math.round(Math.random() * 220);
    const bx = baseX + i * (bw + 20);
    const by = height - wallThickness - bh / 2;
    const building = Bodies.rectangle(bx, by, bw, bh, {
      isStatic: true,
      render: { fillStyle: '#1f2937' }
    });
    buildings.push(building);
  }
  World.add(engine.world, buildings);

  // --- helicopter body (dynamic) ---
  const heliW = 160;
  const heliH = 40;
  const heliStartX = Math.max(120, width * 0.12);
  const heliStartY = Math.max(80, height * 0.15);

  const helicopter = Bodies.rectangle(heliStartX, heliStartY, heliW, heliH, {
    frictionAir: 0.02,
    density: 0.004,
    render: {
      fillStyle: '#3b82f6', // blue helicopter body
      strokeStyle: '#93c5fd',
      lineWidth: 2
    }
  });

  // cockpit circle for aesthetic
  const cockpit = Bodies.circle(heliStartX + heliW / 3, heliStartY, 16, {
    isSensor: true,
    render: { fillStyle: '#60a5fa' }
  });

  World.add(engine.world, [helicopter, cockpit]);

  // rotor (visual) - we'll keep it kinematic: position + angle driven each frame
  const rotor = Bodies.rectangle(helicopter.position.x, helicopter.position.y - heliH / 2 - 6, heliW * 0.9, 6, {
    isStatic: true, // static so it doesn't add physics complexity, we'll update position manually
    render: { fillStyle: '#111827' }
  });
  World.add(engine.world, rotor);

  // --- rope / rescue chain ---
  const ropeSegments = 10;
  const segW = 8;
  const segH = 22;
  const ropeStartX = helicopter.position.x;
  const ropeStartY = helicopter.position.y + heliH / 2 + 6;
  const rope = Composites.stack(ropeStartX - 0, ropeStartY + 20, ropeSegments, 1, 0, 0, (x, y) => {
    return Bodies.rectangle(x, y, segW, segH, {
      collisionFilter: { group: Body.nextGroup(true) },
      chamfer: 2,
      density: 0.0015,
      friction: 0.5,
      render: { fillStyle: '#9ca3af' }
    });
  });

  Composites.chain(rope, 0.5, 0, -0.5, 0, {
    stiffness: 0.9,
    length: 2,
    render: { visible: true, strokeStyle: '#94a3b8', lineWidth: 3 }
  });

  // attach top rope link to helicopter via constraint
  const topConstraint = Constraint.create({
    bodyA: helicopter,
    pointA: { x: 0, y: heliH / 2 },
    bodyB: rope.bodies[0],
    pointB: { x: 0, y: -segH / 2 },
    length: 2,
    stiffness: 1,
    render: { visible: false }
  });

  // rescue crate at the end (or "person")
  const crateW = 44;
  const crateH = 34;
  const lastLink = rope.bodies[rope.bodies.length - 1];
  const crate = Bodies.rectangle(lastLink.position.x, lastLink.position.y + segH + crateH / 2, crateW, crateH, {
    density: 0.006,
    friction: 0.6,
    restitution: 0.0,
    render: { fillStyle: '#f59e0b' } // golden crate
  });

  const endConstraint = Constraint.create({
    bodyA: lastLink,
    pointA: { x: 0, y: segH / 2 },
    bodyB: crate,
    pointB: { x: 0, y: -crateH / 2 },
    length: 2,
    stiffness: 1,
    render: { visible: false }
  });

  World.add(engine.world, [rope, topConstraint, crate, endConstraint]);

  // --- helper: keep cockpit visually attached to helicopter position ---
  Events.on(engine, 'beforeUpdate', () => {
    // position rotor and cockpit to helicopter
    Body.setPosition(rotor, { x: helicopter.position.x, y: helicopter.position.y - heliH / 2 - 6 });
    Body.setPosition(cockpit, { x: helicopter.position.x + heliW / 3, y: helicopter.position.y });
  });

  // --- rotor spin and helicopter movement / sway ---
  let rotorAngle = 0;
  let heliDir = 1; // 1 = right, -1 = left
  const heliSpeed = Math.max(1.0, (width / 1200)); // adaptive speed
  Events.on(engine, 'afterUpdate', () => {
    // rotor spin (visual)
    rotorAngle += 0.8; // speed of blade rotation
    Body.setAngle(rotor, rotorAngle);

    // gentle horizontal patrol movement
    // change direction near edges
    const margin = 120;
    if (helicopter.position.x > width - margin) heliDir = -1;
    else if (helicopter.position.x < margin) heliDir = 1;

    // set velocity while preserving Y velocity from interactions
    Body.setVelocity(helicopter, { x: heliDir * heliSpeed, y: helicopter.velocity.y });

    // small automatic yaw/pitch stabilization (so helicopter doesn't spin)
    Body.setAngle(helicopter, 0);
  });

  // --- wind gusts to make rope sway more natural ---
  let gustTimer = 0;
  Events.on(engine, 'beforeUpdate', () => {
    gustTimer += 1;
    if (gustTimer % 160 === 0) {
      // apply a random sideways impulse to crate & rope
      const forceMag = 0.0035;
      const dir = (Math.random() > 0.5) ? 1 : -1;
      Body.applyForce(crate, crate.position, { x: dir * forceMag, y: -0.0006 });
    }
  });

  // --- optional: make crate drop when clicked (user could drag) ---
  // We'll add a tiny collision filter so mouse can grab the crate (global mouseConstraint already present)

  // --- falling objects to rescue from (debris) ---
  const debris = [];
  for (let i = 0; i < 6; i++) {
    const box = Bodies.rectangle(
      buildings[0] ? buildings[0].position.x + (Math.random() * 60 - 30) : width * 0.4 + i * 60,
      height - wallThickness - (Math.random() * 80 + 40),
      28 + Math.random() * 30,
      28 + Math.random() * 30,
      { density: 0.002, friction: 0.6, render: { fillStyle: '#ef4444' } }
    );
    debris.push(box);
    World.add(engine.world, box);
  }

  // --- camera-like small follow (visual only) ---
  // We won't change canvas transform (to keep things simple); user can always pan externally.

  // --- cleanup handler (so if you store and call it before switching demos, events won't leak) ---
  const cleanup = () => {
    // remove engine events by removing all listeners we've added
    Events.off(engine, 'beforeUpdate');
    Events.off(engine, 'afterUpdate');

    // remove created bodies/constraints (MegaPhysics handleClear removes non-static bodies,
    // but if you want immediate cleanup, remove these explicitly)
    try {
      Composite.remove(engine.world, helicopter);
      Composite.remove(engine.world, rotor);
      Composite.remove(engine.world, cockpit);
      Composite.remove(engine.world, rope);
      Composite.remove(engine.world, crate);
      Composite.remove(engine.world, topConstraint);
      Composite.remove(engine.world, endConstraint);
      debris.forEach(d => Composite.remove(engine.world, d));
      buildings.forEach(b => Composite.remove(engine.world, b));
    } catch (e) {
      // ignore if already removed
    }
  };

  // return cleanup so caller can call it when switching demos
  return cleanup;
}
