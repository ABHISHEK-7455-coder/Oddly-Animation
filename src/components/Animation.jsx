import React, { useEffect, useRef, useState } from "react";
import animationsData from "../data/animationsData.json";

const Animation = ({ type, color = "#ff6ec4", size = 50, speed = 2.5 }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size relative to container
        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            setMouse({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };
        container.addEventListener("mousemove", handleMouseMove);

        let animationFrameId;
        const data = animationsData.find(a => a.type === type);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            switch (data?.type) {
                case "floatingSpheres":
                    for (let i = 0; i < (data.count || 10); i++) {
                        const x = Math.random() * canvas.width;
                        const y = Math.random() * canvas.height;
                        const sz = Math.random() * (size) + size / 2;
                        const gradient = ctx.createRadialGradient(x, y, 0, x, y, sz);
                        gradient.addColorStop(0, color);
                        gradient.addColorStop(1, "transparent");
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(x, y, sz, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;


                case "waveParticles":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            size: Math.random() * 5 + 2,
                            angle: Math.random() * 2 * Math.PI,
                            speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0]
                        }));
                    }
                    canvas.particles.forEach(p => {
                        p.y += Math.sin(p.angle) * 0.5;
                        p.x += Math.cos(p.angle) * 0.5;
                        p.angle += p.speed;
                        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "rainbowRibbon":
                    if (!canvas.trail) canvas.trail = [];
                    canvas.trail.push({ x: mouse.x, y: mouse.y });
                    if (canvas.trail.length > data.trailLength) canvas.trail.shift();
                    for (let i = 0; i < canvas.trail.length - 1; i++) {
                        ctx.strokeStyle = `hsl(${i * 10},100%,60%)`;
                        ctx.lineWidth = data.css?.lineWidth || 5;
                        ctx.beginPath();
                        ctx.moveTo(canvas.trail[i].x, canvas.trail[i].y);
                        ctx.lineTo(canvas.trail[i + 1].x, canvas.trail[i + 1].y);
                        ctx.stroke();
                    }
                    break;

                case "fractalBlossoms":
                    if (!canvas.circles) canvas.circles = [{ x: canvas.width / 2, y: canvas.height / 2, r: 50, angle: 0, dir: 1 }];
                    const newCircles = [];
                    canvas.circles.forEach(c => {
                        c.angle += 0.01 * c.dir;
                        ctx.beginPath();
                        ctx.arc(c.x + Math.cos(c.angle) * 50, c.y + Math.sin(c.angle) * 50, c.r, 0, Math.PI * 2);
                        ctx.strokeStyle = `hsl(${c.angle * 100},100%,60%)`;
                        ctx.stroke();
                        if (c.r > 5) newCircles.push({ x: c.x + Math.cos(c.angle) * 50, y: c.y + Math.sin(c.angle) * 50, r: c.r * 0.9, angle: c.angle, dir: -c.dir });
                    });
                    canvas.circles.push(...newCircles);
                    break;

                case "slime":
                    if (!canvas.slimePoints) {
                        canvas.slimePoints = Array.from({ length: data.points }, (_, i) => ({
                            x: canvas.width / 2 + Math.cos((i / data.points) * 2 * Math.PI) * 100,
                            y: canvas.height / 2 + Math.sin((i / data.points) * 2 * Math.PI) * 100,
                            dx: 0,
                            dy: 0
                        }));
                    }
                    ctx.fillStyle = data.colors[0] || "#ff6ec4";
                    ctx.beginPath();
                    canvas.slimePoints.forEach((p, i) => {
                        p.dx += (mouse.x - p.x) * 0.002;
                        p.dy += (mouse.y - p.y) * 0.002;
                        p.x += (p.dx *= 0.9);
                        p.y += (p.dy *= 0.9);
                    });
                    const points = canvas.slimePoints;
                    ctx.moveTo(points[0].x, points[0].y);
                    for (let i = 1; i < points.length; i++) {
                        const midX = (points[i].x + points[i - 1].x) / 2;
                        const midY = (points[i].y + points[i - 1].y) / 2;
                        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, midX, midY);
                    }
                    const midX = (points[0].x + points[points.length - 1].x) / 2;
                    const midY = (points[0].y + points[points.length - 1].y) / 2;
                    ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, midX, midY);
                    ctx.fill();
                    break;

                // Remaining 5 animations

                case "starfield":
                    if (!canvas.stars) {
                        canvas.stars = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            z: Math.random() * canvas.width
                        }));
                    }
                    canvas.stars.forEach(s => {
                        s.z -= data.speed || 2;
                        if (s.z <= 0) {
                            s.z = canvas.width;
                            s.x = Math.random() * canvas.width;
                            s.y = Math.random() * canvas.height;
                        }
                        const k = 128.0 / s.z;
                        const x = (s.x - canvas.width / 2) * k + canvas.width / 2;
                        const y = (s.y - canvas.height / 2) * k + canvas.height / 2;
                        ctx.fillStyle = "white";
                        ctx.fillRect(x, y, 2 * k, 2 * k);
                    });
                    break;

                case "bouncingDots":
                    if (!canvas.dots) {
                        const size = data.gridSize || 20;
                        const rows = Math.ceil(canvas.height / size);
                        const cols = Math.ceil(canvas.width / size);
                        canvas.dots = [];
                        for (let r = 0; r < rows; r++) {
                            for (let c = 0; c < cols; c++) {
                                canvas.dots.push({
                                    x: c * size,
                                    y: r * size,
                                    dy: Math.random() * 2 + 1
                                });
                            }
                        }
                    }
                    canvas.dots.forEach(d => {
                        ctx.fillStyle = "#ff6ec4";
                        ctx.beginPath();
                        ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
                        ctx.fill();
                        d.y += d.dy;
                        if (d.y > canvas.height) d.y = 0;
                    });
                    break;

                case "morphingBlob":
                    if (!canvas.blobPoints) {
                        const points = 12;
                        canvas.blobPoints = Array.from({ length: points }, (_, i) => ({
                            angle: (i / points) * 2 * Math.PI,
                            radius: data.size || 100,
                            offset: Math.random() * 0.5
                        }));
                    }
                    ctx.fillStyle = data.colors ? data.colors[0] : "#ff6ec4";
                    ctx.beginPath();
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    canvas.blobPoints.forEach((p, i) => {
                        const r = p.radius + Math.sin(Date.now() * 0.002 + p.offset) * 20;
                        const x = centerX + Math.cos(p.angle) * r;
                        const y = centerY + Math.sin(p.angle) * r;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    });
                    ctx.closePath();
                    ctx.fill();
                    break;

                case "liquidWaves":
                    if (!canvas.waves) {
                        canvas.waves = Array.from({ length: data.count }, (_, i) => ({
                            x: i * (canvas.width / data.count),
                            y: canvas.height / 2 + Math.sin(i) * 50
                        }));
                    }
                    ctx.strokeStyle = data.colors ? data.colors[0] : "#00f";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    canvas.waves.forEach((w, i) => {
                        w.y = canvas.height / 2 + Math.sin(Date.now() * 0.002 + i) * 50;
                        if (i === 0) ctx.moveTo(w.x, w.y);
                        else ctx.lineTo(w.x, w.y);
                    });
                    ctx.stroke();
                    break;

                case "glowingRings":
                    if (!canvas.rings) {
                        canvas.rings = Array.from({ length: data.count }, (_, i) => ({
                            radius: 50 + i * 30,
                            speed: 0.5 + i * 0.1
                        }));
                    }
                    canvas.rings.forEach(r => {
                        r.radius += r.speed;
                        if (r.radius > canvas.width) r.radius = 50;
                        ctx.strokeStyle = data.colors ? data.colors[Math.floor(Math.random() * data.colors.length)] : "#0ff";
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, canvas.height / 2, r.radius, 0, Math.PI * 2);
                        ctx.stroke();
                    });
                    break;

                case "rotatingArcs":
                    if (!canvas.arcs) {
                        canvas.arcs = Array.from({ length: data.count }, (_, i) => ({
                            angle: Math.random() * Math.PI * 2,
                            radius: 50 + i * data.radiusStep
                        }));
                    }
                    canvas.arcs.forEach((arc, i) => {
                        arc.angle += data.rotationSpeed;
                        const color = data.colors[i % data.colors.length];
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.arc(
                            canvas.width / 2,
                            canvas.height / 2,
                            arc.radius,
                            arc.angle,
                            arc.angle + data.arcLength * Math.PI * 2
                        );
                        ctx.stroke();
                    });
                    break;

                case "gridPulse":
                    const time = Date.now();
                    const gridSize = data.gridSize;
                    const cols = Math.ceil(canvas.width / gridSize);
                    const rows = Math.ceil(canvas.height / gridSize);

                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < cols; c++) {
                            const phase = Math.sin((time + (r + c) * 100) * data.pulseSpeed);
                            const size = (gridSize / 2) * (0.5 + 0.5 * phase);

                            const x = c * gridSize + gridSize / 2;
                            const y = r * gridSize + gridSize / 2;

                            ctx.fillStyle = data.colors[(r + c) % data.colors.length];

                            if (data.shape === "circle") {
                                ctx.beginPath();
                                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                                ctx.fill();
                            } else {
                                ctx.fillRect(x - size / 2, y - size / 2, size, size);
                            }
                        }
                    }
                    break;
                case "mandalaLines":
                    if (!canvas.angle) canvas.angle = 0;
                    canvas.angle += data.rotationSpeed;

                    const X = canvas.width / 2;
                    const Y = canvas.height / 2;
                    const spokes = data.spokes || 30;
                    const length = data.lineLength || 80;

                    for (let i = 0; i < spokes; i++) {
                        const angle = (i / spokes) * Math.PI * 2 + canvas.angle;
                        const x1 = X + Math.cos(angle) * 10;
                        const y1 = Y + Math.sin(angle) * 10;
                        const x2 = X + Math.cos(angle) * length;
                        const y2 = Y + Math.sin(angle) * length;

                        ctx.strokeStyle = data.colors[i % data.colors.length];
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                    break;
                case "orbitingDots":
                    if (!canvas.orbitAngles) {
                        canvas.orbitAngles = Array.from({ length: data.rings }, () => 0);
                    }

                    const centerX2 = canvas.width / 2;
                    const centerY2 = canvas.height / 2;

                    for (let r = 0; r < data.rings; r++) {
                        const radius = (r + 1) * data.radiusStep;
                        const dots = data.dotsPerRing;
                        canvas.orbitAngles[r] += data.speedStep * (r + 1);

                        for (let d = 0; d < dots; d++) {
                            const angle = (d / dots) * Math.PI * 2 + canvas.orbitAngles[r];
                            const x = centerX2 + Math.cos(angle) * radius;
                            const y = centerY2 + Math.sin(angle) * radius;

                            ctx.fillStyle = data.colors[d % data.colors.length];
                            ctx.beginPath();
                            ctx.arc(x, y, 4, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    break;

                case "waveLines":
                    if (!canvas.offsets) {
                        canvas.offsets = Array.from({ length: data.lineCount }, () => Math.random() * Math.PI * 2);
                    }

                    const step = canvas.width / data.lineCount;

                    for (let i = 0; i < data.lineCount; i++) {
                        const offset = canvas.offsets[i];
                        const waveY = Math.sin(Date.now() * data.speed + offset) * data.amplitude + canvas.height / 2;
                        const x1 = i * step;
                        const y1 = waveY;

                        const x2 = x1 + step;
                        const y2 = waveY;

                        ctx.strokeStyle = data.colors[i % data.colors.length];
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();

                        canvas.offsets[i] += data.frequency;
                    }
                    break;

                case "pulseCircles":
                    if (!canvas.pulseData) {
                        canvas.pulseData = Array.from({ length: data.count }, (_, i) => ({
                            radius: data.minSize + Math.random() * (data.maxSize - data.minSize),
                            direction: 1,
                            colorIndex: i % data.colors.length
                        }));
                    }

                    const centerX3 = canvas.width / 2;
                    const centerY3 = canvas.height / 2;

                    canvas.pulseData.forEach(p => {
                        ctx.fillStyle = data.colors[p.colorIndex];
                        ctx.beginPath();
                        ctx.arc(centerX3, centerY3, p.radius, 0, Math.PI * 2);
                        ctx.fill();

                        p.radius += p.direction * data.speed;

                        if (p.radius >= data.maxSize || p.radius <= data.minSize) {
                            p.direction *= -1;
                        }
                    });
                    break;

                case "glowingParticles":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            size: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],
                            dx: Math.random() * 2 - 1,
                            dy: Math.random() * 2 - 1,
                            speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0]
                        }));
                    }

                    canvas.particles.forEach(p => {
                        p.x += p.dx * p.speed;
                        p.y += p.dy * p.speed;

                        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                        ctx.fillStyle = `rgba(${parseInt(data.colors[0].slice(1, 3), 16)}, ${parseInt(data.colors[0].slice(3, 5), 16)}, ${parseInt(data.colors[0].slice(5, 7), 16)}, 0.5)`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "shiftingLines":
                    if (!canvas.lines) {
                        canvas.lines = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            speed: Math.random() * data.speed
                        }));
                    }

                    canvas.lines.forEach(line => {
                        line.x += line.speed;
                        if (line.x > canvas.width) line.x = -10;

                        ctx.strokeStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.lineWidth = data.lineWidth;
                        ctx.beginPath();
                        ctx.moveTo(line.x, 0);
                        ctx.lineTo(line.x, canvas.height);
                        ctx.stroke();
                    });
                    break;

                case "breathingWave":
                    if (!canvas.waveData) {
                        canvas.waveData = Array.from({ length: data.lineCount }, () => ({
                            amplitude: Math.random() * (data.maxSize - 50) + 50,
                            offset: Math.random() * Math.PI * 2,
                            angle: Math.random() * Math.PI * 2
                        }));
                    }

                    const X2 = canvas.width / 2;
                    const Y2 = canvas.height / 2;

                    canvas.waveData.forEach(wave => {
                        const size = Math.sin(Date.now() * data.speed + wave.offset) * wave.amplitude + data.maxSize;
                        const x1 = X2 + Math.cos(wave.angle) * size;
                        const y1 = Y2 + Math.sin(wave.angle) * size;

                        ctx.strokeStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(X2, Y2);
                        ctx.lineTo(x1, y1);
                        ctx.stroke();

                        wave.angle += 0.01;
                    });
                    break;
                case "shiftingGrid":
                    if (!canvas.gridLines) {
                        canvas.gridLines = Array.from({ length: canvas.width / data.gridSize }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            dx: Math.random() * data.speed * 2 - data.speed,
                            dy: Math.random() * data.speed * 2 - data.speed
                        }));
                    }

                    canvas.gridLines.forEach(line => {
                        line.x += line.dx;
                        line.y += line.dy;

                        if (line.x < 0 || line.x > canvas.width) line.dx *= -1;
                        if (line.y < 0 || line.y > canvas.height) line.dy *= -1;

                        ctx.strokeStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(line.x, 0);
                        ctx.lineTo(line.x, canvas.height);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(0, line.y);
                        ctx.lineTo(canvas.width, line.y);
                        ctx.stroke();
                    });
                    break;

                case "fadingCircles":
                    if (!canvas.circles) {
                        canvas.circles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            size: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],
                            opacity: 1,
                            speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0]
                        }));
                    }

                    canvas.circles.forEach(circle => {
                        circle.opacity -= circle.speed;
                        if (circle.opacity <= 0) circle.opacity = 1;

                        ctx.fillStyle = `rgba(${parseInt(data.colors[0].slice(1, 3), 16)}, ${parseInt(data.colors[0].slice(3, 5), 16)}, ${parseInt(data.colors[0].slice(5, 7), 16)}, ${circle.opacity})`;
                        ctx.beginPath();
                        ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "ripplingSquares":
                    if (!canvas.squares) {
                        canvas.squares = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            size: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],
                            dx: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0],
                            dy: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0]
                        }));
                    }

                    canvas.squares.forEach(square => {
                        square.x += square.dx;
                        square.y += square.dy;

                        if (square.x < 0 || square.x > canvas.width) square.dx *= -1;
                        if (square.y < 0 || square.y > canvas.height) square.dy *= -1;

                        ctx.fillStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.beginPath();
                        ctx.rect(square.x, square.y, square.size, square.size);
                        ctx.fill();
                    });
                    break;

                case "floatingCubes":
                    if (!canvas.cubes) {
                        canvas.cubes = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            z: Math.random() * 100,
                            size: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],
                            rotation: Math.random() * Math.PI * 2,
                            speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0]
                        }));
                    }

                    canvas.cubes.forEach(cube => {
                        cube.rotation += cube.speed;
                        const offsetX = Math.sin(cube.rotation) * 30;
                        const offsetY = Math.cos(cube.rotation) * 30;

                        ctx.fillStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.beginPath();
                        ctx.rect(cube.x + offsetX, cube.y + offsetY, cube.size, cube.size);
                        ctx.fill();
                    });
                    break;

                case "colorWave":
                    if (!canvas.waves) {
                        canvas.waves = Array.from({ length: data.count }, () => ({
                            offset: Math.random() * Math.PI * 2,
                            speed: data.speed
                        }));
                    }

                    canvas.waves.forEach(wave => {
                        const waveHeight = Math.sin(Date.now() * wave.speed + wave.offset) * 50;
                        const yPos = canvas.height / 2 + waveHeight;

                        ctx.fillStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.beginPath();
                        ctx.rect(0, yPos, canvas.width, 10);
                        ctx.fill();
                    });
                    break;

                // Particle System with Attraction Force
                case "particleAttraction":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            size: Math.random() * 5 + 2,
                            angle: Math.random() * 2 * Math.PI,
                            speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0],
                            dx: 0,
                            dy: 0
                        }));
                    }
                    canvas.particles.forEach(p => {
                        const X = mouse.x - p.x;
                        const Y = mouse.y - p.y;
                        const dist = Math.sqrt(X * X + Y * Y);
                        const force = Math.min(1 / dist, 0.05); // Attraction force
                        p.dx += (X / dist) * force;
                        p.dy += (Y / dist) * force;

                        p.x += p.dx;
                        p.y += p.dy;

                        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                // Rotating 3D Cubes
                case "rotatingCubes":
                    const centreX = canvas.width / 2;
                    const centreY = canvas.height / 2;
                    const angleX = Date.now() * 0.001;
                    const angleY = Date.now() * 0.001;

                    for (let i = 0; i < data.count; i++) {
                        const size = Math.random() * 50 + 20;
                        const x = Math.cos(i * Math.PI / data.count) * 200 + centreX;
                        const y = Math.sin(i * Math.PI / data.count) * 200 + centreY;
                        const z = 100 + Math.sin(Date.now() * 0.001 + i) * 100;

                        const rx = Math.cos(angleX + i) * size;
                        const ry = Math.sin(angleY + i) * size;

                        ctx.fillStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.fillRect(x + rx, y + ry, size, size);
                    }
                    break;

                // Fractal Tree Growth Animation
                case "fractalTree":
                    const drawTree = (x, y, angle, depth) => {
                        if (depth === 0) return;
                        const length = data.branchLength * (depth / data.maxDepth);
                        const endX = x + Math.cos(angle) * length;
                        const endY = y + Math.sin(angle) * length;

                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(endX, endY);
                        ctx.strokeStyle = data.colors[depth % data.colors.length];
                        ctx.lineWidth = 2;
                        ctx.stroke();

                        // Recursively draw branches
                        drawTree(endX, endY, angle - data.angle, depth - 1);
                        drawTree(endX, endY, angle + data.angle, depth - 1);
                    };
                    drawTree(canvas.width / 2, canvas.height, -Math.PI / 2, data.maxDepth);
                    break;

                // Fluid Dynamic Waves with Perlin Noise
                case "fluidWaves":
                    if (!canvas.waves) {
                        canvas.waves = Array.from({ length: data.count }, (_, i) => ({
                            x: i * (canvas.width / data.count),
                            y: canvas.height / 2 + Math.sin(i) * 50,
                            phase: Math.random() * Math.PI * 2
                        }));
                    }
                    ctx.strokeStyle = data.colors ? data.colors[0] : "#00f";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    canvas.waves.forEach((w, i) => {
                        w.y = canvas.height / 2 + Math.sin(Date.now() * 0.002 + w.phase + i) * 50;
                        if (i === 0) ctx.moveTo(w.x, w.y);
                        else ctx.lineTo(w.x, w.y);
                    });
                    ctx.stroke();
                    break;

                default:
                    break;
            }

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
            container.removeEventListener("mousemove", handleMouseMove);
        };
    }, [type, color, size, speed]);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "300px", position: "relative", overflow: "hidden" }}>
            <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
        </div>
    );
};

export default Animation;