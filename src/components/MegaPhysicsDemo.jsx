// ===== MegaPhysicsDemo.jsx =====
// Full UI + Renderer + Engine + Demo Switch with controls (Spawn, Pause/Resume, Gravity, Count)
// Includes AvalancheDemo, MixedDemo, ChainsDemo, ConstraintsDemo

import React, { useRef, useEffect, useState } from 'react';
import Matter from 'matter-js';
import { MixedDemo, ChainsDemo, ConstraintsDemo, AvalancheDemo, DoublePendulumDemo, WreckingBallDemo, TimescaleDemo, CompoundStackDemo, RopeBridgeDemo, NewtonsCradleDemo, ClothDemo, MagnetFieldDemo, 
    HelicopterRescueDemo
 } from './demos';
// import { AvalancheDemo } from './AvalancheDemo';
import './MatterJs.css';

export default function MegaPhysicsDemo() {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const mouseConstraintRef = useRef(null);
    const [activeDemo, setActiveDemo] = useState('mixed');
    const [gravity, setGravity] = useState(0.2);
    const [spawnCount, setSpawnCount] = useState(12);
    const [running, setRunning] = useState(true);

    let TimescaleDemoCleanup = null;


    useEffect(() => {
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const Mouse = Matter.Mouse;
        const MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create();
        engine.gravity.y = gravity;
        engineRef.current = engine;

        const width = sceneRef.current.clientWidth || 800;
        const height = sceneRef.current.clientHeight || 600;

        const render = Render.create({
            element: sceneRef.current,
            engine,
            options: {
                width, height,
                wireframes: false,
                background: '#0f172a'
            }
        });
        renderRef.current = render;

        // Add mouse constraint ONCE
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.2, render: { visible: true } }
        });
        Matter.World.add(engine.world, mouseConstraint);
        mouseConstraintRef.current = mouseConstraint;
        render.mouse = mouse;

        const runner = Matter.Runner.create();
        engine.timing.runner = runner;
        Matter.Runner.run(runner, engine);
        Render.run(render);

        window.addEventListener('resize', () => {
            const w = sceneRef.current.clientWidth;
            const h = sceneRef.current.clientHeight;
            render.bounds.max.x = w;
            render.bounds.max.y = h;
            render.options.width = w;
            render.options.height = h;
            render.canvas.width = w;
            render.canvas.height = h;
        });

        return () => {
            Matter.Render.stop(render);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            render.canvas && render.canvas.remove();
            render.textures = {};
        }
    }, []);

    useEffect(() => {
        if (engineRef.current) engineRef.current.gravity.y = gravity;
    }, [gravity]);

    // Clear all dynamic bodies + constraints but preserve MouseConstraint
    const handleClear = () => {
        if (!engineRef.current || !mouseConstraintRef.current) return;
        const engine = engineRef.current;
        const allBodies = Matter.Composite.allBodies(engine.world);
        const allConstraints = Matter.Composite.allConstraints(engine.world);
        for (const b of allBodies) {
            if (!b.isStatic && b !== mouseConstraintRef.current.bodyA && b !== mouseConstraintRef.current.bodyB) {
                Matter.Composite.remove(engine.world, b);
            }
        }
        for (const c of allConstraints) {
            if (c !== mouseConstraintRef.current.constraint) {
                Matter.Composite.remove(engine.world, c);
            }
        }
    };

    const handleSpawn = () => {
        if (!engineRef.current || !renderRef.current) return;
        const engine = engineRef.current;
        const render = renderRef.current;
        if (activeDemo === 'mixed') {
            MixedDemo({ engine, render, spawnCount });
        } else if (activeDemo === 'chains') {
            ChainsDemo({ engine, render, spawnCount });
        } else if (activeDemo === 'avalanche') {
            AvalancheDemo({ engine, render, spawnCount });
        } else if (activeDemo === 'constraints') {
            ConstraintsDemo({ engine, render });
        } else if (activeDemo === 'double') {
            DoublePendulumDemo({ engine, render });
        } else if (activeDemo === 'wreckingball') {
            WreckingBallDemo({ engine, render });
        } else if (activeDemo === 'timescale') {
            if (typeof TimescaleDemoCleanup === 'function') TimescaleDemoCleanup(); // previous cleanup
            TimescaleDemoCleanup = TimescaleDemo({ engine, render }); // store cleanup function
        } else if (activeDemo === "compound") {
            CompoundStackDemo({ engine, render });
        } else if (activeDemo === 'rope') {
            RopeBridgeDemo({ engine, render });
        } else if (activeDemo === 'cradle') {
            NewtonsCradleDemo({ engine, render });
        } else if (activeDemo === 'cloth') {
            ClothDemo({ engine, render });
        } else if (activeDemo === 'magnet') {
            MagnetFieldDemo({ engine, render });
        }
        else if (activeDemo === 'helicopter') {
           HelicopterRescueDemo({ engine, render });
        }
    };

    const handlePauseResume = () => {
        if (!engineRef.current) return;
        const engine = engineRef.current;
        if (running) {
            try { Matter.Runner.stop(engine.timing.runner); } catch (e) { }
        } else {
            const runner = Matter.Runner.create();
            engine.timing.runner = runner;
            Matter.Runner.run(runner, engine);
        }
        setRunning(!running);
    };

    useEffect(() => {
        handleClear(); // clear all bodies + constraints except mouse
        handleSpawn();
    }, [activeDemo, spawnCount]);

    return (
        <div className="matter-container">
            <div className="matter-controls">
                <button className={`btn ${activeDemo === 'mixed' ? 'btn-indigo' : 'btn-slate'}`} onClick={() => setActiveDemo('mixed')}>Mixed Physics</button>
                <button className={`btn ${activeDemo === 'chains' ? 'btn-teal' : 'btn-slate'}`} onClick={() => setActiveDemo('chains')}>Chains Demo</button>
                <button className={`btn ${activeDemo === 'avalanche' ? 'btn-yellow' : 'btn-slate'}`} onClick={() => setActiveDemo('avalanche')}>Avalanche Demo</button>
                <button className={`btn ${activeDemo === 'constraints' ? 'btn-purple' : 'btn-slate'}`} onClick={() => setActiveDemo('constraints')}>Constraints Demo</button>
                <button className={`btn ${activeDemo === 'double' ? 'btn-orange' : 'btn-slate'}`} onClick={() => setActiveDemo('double')}>Double Pendulum</button>
                <button className={`btn ${activeDemo === 'wreckingBall' ? 'btn-orange' : 'btn-slate'}`} onClick={() => setActiveDemo('wreckingball')}>Wrecking Ball</button>
                <button className={`btn ${activeDemo === 'wreckingBall' ? 'btn-orange' : 'btn-slate'}`} onClick={() => setActiveDemo('timescale')}>Time Scale</button>
                <button className={`btn ${activeDemo === 'compound' ? 'btn-green' : 'btn-slate'}`} onClick={() => setActiveDemo('compound')}>Compound Stack</button>
                <button className={`btn ${activeDemo === 'rope' ? 'btn-indigo' : 'btn-slate'}`} onClick={() => setActiveDemo('rope')}>Rope Bridge</button>
                <button className={`btn ${activeDemo === 'cradle' ? 'btn-indigo' : 'btn-slate'}`} onClick={() => setActiveDemo('cradle')}>Newton's Cradle</button>
                <button className={`btn ${activeDemo === 'cradle' ? 'btn-indigo' : 'btn-slate'}`} onClick={() => setActiveDemo('cloth')}>Cloth</button>
                <button className={`btn ${activeDemo === 'magnet' ? 'btn-pink' : 'btn-slate'}`}
                    onClick={() => setActiveDemo('magnet')}>
                    Magnet Fields
                </button>
                <button className={`btn ${activeDemo === 'cradle' ? 'btn-indigo' : 'btn-slate'}`} onClick={() => setActiveDemo('helicopter')}>Helicopter</button>

                <button className="btn btn-indigo" onClick={handleSpawn}>Spawn {spawnCount}</button>
                <button className="btn btn-yellow" onClick={handlePauseResume}>{running ? 'Pause' : 'Resume'}</button>
                <button className="btn btn-rose" onClick={handleClear}>Clear</button>

                <label>Gravity
                    <input type="range" min="-2" max="3" step="0.1" value={gravity} onChange={e => setGravity(parseFloat(e.target.value))} />
                    <span>{gravity.toFixed(1)}</span>
                </label>

                <label>Count
                    <input type="number" min="1" max="60" value={spawnCount} onChange={e => setSpawnCount(Math.max(1, Math.min(60, parseInt(e.target.value || '12', 10))))} />
                </label>

            </div>
            <div ref={sceneRef} className="scene-area" />
        </div>
    );
}