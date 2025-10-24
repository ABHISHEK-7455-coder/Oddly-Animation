import React, { useEffect, useRef, useState } from "react";
import animationsData from "../data/animationsData.json";

const Animation = ({ type, color, size = 50, speed }) => {
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
    if (!canvas.spheres) {
        // Create spheres with random properties including velocity
        canvas.spheres = Array.from({ length: data.count || 10 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (size) + size / 2,
            speedX: Math.random() * 2 - 1,  // Horizontal velocity (-1 to 1)
            speedY: Math.random() * 2 - 1,  // Vertical velocity (-1 to 1)
        }));
    }

    // Apply a global speed factor to all spheres
    const globalSpeed = 2;  // Adjust this value to control the overall speed

    // Update positions and draw the spheres
    canvas.spheres.forEach(sphere => {
        // Move the spheres based on their speed and the global speed factor
        sphere.x += sphere.speedX * speed;
        sphere.y += sphere.speedY * speed;

        // Apply boundary bounce (reverse direction if hitting edges)
        if (sphere.x <= 0 || sphere.x >= canvas.width) sphere.speedX = -sphere.speedX;
        if (sphere.y <= 0 || sphere.y >= canvas.height) sphere.speedY = -sphere.speedY;

        // Create radial gradient for each sphere
        const gradient = ctx.createRadialGradient(sphere.x, sphere.y, 0, sphere.x, sphere.y, sphere.size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");

        // Draw the sphere
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sphere.x, sphere.y, sphere.size, 0, Math.PI * 2);
        ctx.fill();
    });
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
                        p.y += Math.sin(p.angle) * speed;
                        p.x += Math.cos(p.angle) * speed;
                        // variable
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
                        p.dx += (mouse.x - p.x) * speed;
                        p.dy += (mouse.y - p.y) * speed;
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
                        s.z -= speed; //variable
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
                                    dy: Math.random() * speed
                                });
                            }
                        }
                    }
                    canvas.dots.forEach(d => {
                        ctx.fillStyle = "#ff6ec4";
                        ctx.beginPath();
                        ctx.arc(d.x, d.y, 3, 0, Math.PI * speed);
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
                    ctx.fillStyle = data.colors ? data.colors[0] : color;
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
                        arc.angle += speed;
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
            const phase = Math.sin((time + (r + c) * 100) * speed);  // Use the 'speed' variable
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
                    canvas.angle += speed;

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
                        const waveY = Math.sin(Date.now() * speed + offset) * data.amplitude + canvas.height / 2;
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

                        p.radius += p.direction * speed;

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
                        p.x += p.dx * speed;
                        p.y += p.dy * speed;

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
                            speed: Math.random() * speed
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
                            dx: Math.random() * speed * 2 - speed,
                            dy: Math.random() * speed * 2 - speed
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
                            speed: Math.random() * (speed)
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
                           dx: Math.random() * (speed * 2) - speed, 
            dy: Math.random() * (speed * 2) - speed
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
                            speed: speed
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
                            speed: speed
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
                        const force = Math.min(1 / dist, 0.05) * speed; // Attraction force
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
                    const angleX = Date.now() * 0.001 * speed;
                    const angleY = Date.now() * 0.001 * speed;

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

        // Adjust the branch length based on the speed variable
        const length = data.branchLength * (depth / data.maxDepth) * speed;

        // Calculate end point of the branch
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;

        // Draw the branch
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = data.colors[depth % data.colors.length];
        ctx.lineWidth = 2;
        ctx.stroke();

        // Recursively draw the left and right branches, adjusted by angle and depth
        drawTree(endX, endY, angle - data.angle * speed, depth - 1);  // Adjust angle by speed
        drawTree(endX, endY, angle + data.angle * speed, depth - 1);  // Adjust angle by speed
    };

    // Start drawing from the center bottom of the canvas, with an initial angle of -π/2 (upwards)
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
                        w.y = canvas.height / 2 + Math.sin(Date.now() * 0.002 * speed + w.phase + i) * 50;
                        if (i === 0) ctx.moveTo(w.x, w.y);
                        else ctx.lineTo(w.x, w.y);
                    });
                    ctx.stroke();
                    break;

                case "rotatingArcTrail":
                    if (!canvas.arcData) {
                        canvas.arcData = { angle: 0, radius: data.radiusRange[0], trail: [] };
                    }
                    const arcX2 = canvas.width / 2 + Math.cos(canvas.arcData.angle) * canvas.arcData.radius;
                    const arcY2 = canvas.height / 2 + Math.sin(canvas.arcData.angle) * canvas.arcData.radius;
                    canvas.arcData.trail.push({ x: arcX2, y: arcY2 });
                    if (canvas.arcData.trail.length > data.trailLength) canvas.arcData.trail.shift();
                    for (let i = 0; i < canvas.arcData.trail.length; i++) {
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = `rgba(255, 110, 196, ${1 - i / canvas.arcData.trail.length})`;
                        ctx.beginPath();
                        ctx.moveTo(canvas.arcData.trail[i].x, canvas.arcData.trail[i].y);
                        ctx.lineTo(canvas.arcData.trail[i + 1]?.x || arcX2, canvas.arcData.trail[i + 1]?.y || arcY2);
                        ctx.stroke();
                    }
                    canvas.arcData.angle += data.speedRange[0] * speed;
                    break;

                case "rotatingArcsMultiple":
                    for (let i = 0; i < data.count; i++) {
                        if (!canvas.arcData) canvas.arcData = [];
                        if (!canvas.arcData[i]) {
                            canvas.arcData[i] = { angle: Math.random() * Math.PI * 2, radius: Math.random() * (data.radiusRange[1] - data.radiusRange[0]) + data.radiusRange[0] };
                        }
                        const arcX = canvas.width / 2 + Math.cos(canvas.arcData[i].angle) * canvas.arcData[i].radius;
                        const arcY = canvas.height / 2 + Math.sin(canvas.arcData[i].angle) * canvas.arcData[i].radius;
                        ctx.lineWidth = data.arcWidth;
                        ctx.strokeStyle = data.colors[i % data.colors.length];
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.arcData[i].radius, 0, Math.PI * 2);
                        ctx.stroke();
                        canvas.arcData[i].angle += data.speedRange[0] * speed;
                    }
                    break;

                case "expandingRotatingArcs":
                    if (!canvas.arcData) {
                        canvas.arcData = { angle: 0, radius: data.radiusRange[0] };
                    }
                    const arcX3 = canvas.width / 2 + Math.cos(canvas.arcData.angle) * canvas.arcData.radius;
                    const arcY3 = canvas.height / 2 + Math.sin(canvas.arcData.angle) * canvas.arcData.radius;
                    ctx.lineWidth = data.arcWidth;
                    ctx.strokeStyle = data.colors[0];
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.arcData.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    canvas.arcData.angle += data.speedRange[0] * speed;
                    canvas.arcData.radius += data.expansionSpeed * speed;
                    if (canvas.arcData.radius > data.radiusRange[1]) canvas.arcData.radius = data.radiusRange[0];
                    break;

                case "liquidMetalFlow":
                    if (!canvas.flow) {
                        canvas.flow = { angle: 0, offsetX: 0, offsetY: 0 };
                    }
                    ctx.fillStyle = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle.addColorStop(0, data.colors[0]);
                    ctx.fillStyle.addColorStop(1, data.colors[1]);
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2 + Math.sin(canvas.flow.angle) * canvas.flow.offsetX, canvas.height / 2 + Math.cos(canvas.flow.angle) * canvas.flow.offsetY, data.sizeRange[0], 0, Math.PI * 2);
                    ctx.fill();
                    canvas.flow.angle += data.speedRange[0];
                    canvas.flow.offsetX += 0.5;
                    canvas.flow.offsetY += 0.5;
                    break;

                case "fractalLaserGrid":
                    if (!canvas.lasers) {
                        canvas.lasers = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            angle: Math.random() * Math.PI * 2
                        }));
                    }
                    canvas.lasers.forEach(laser => {
                        const x2 = laser.x + Math.cos(laser.angle) * 50;
                        const y2 = laser.y + Math.sin(laser.angle) * 50;
                        ctx.strokeStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(laser.x, laser.y);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                        laser.angle += speed;
                    });
                    break;

                case "soundWaveForm":
                    if (!canvas.waves) {
                        canvas.waves = Array.from({ length: data.count }, (_, i) => ({
                            x: i * 100 + 50,
                            y: Math.random() * canvas.height,
                            speed: Math.random() * speed
                        }));
                    }
                    canvas.waves.forEach(wave => {
                        ctx.strokeStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(wave.x, wave.y);
                        wave.y += Math.sin(Date.now() * wave.speed) * 20;
                        ctx.lineTo(wave.x + 50, wave.y);
                        ctx.stroke();
                    });
                    break;

                case "metamorphosisCircles":
                    if (!canvas.circles) {
                        canvas.circles = Array.from({ length: data.count }, (_, i) => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            radius: Math.random() * data.sizeRange[1] + data.sizeRange[0],
                            angle: Math.random() * Math.PI * 2
                        }));
                    }
                    canvas.circles.forEach(circle => {
                        ctx.fillStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.beginPath();
                        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                        ctx.fill();
                        circle.radius += Math.sin(Date.now() * speed * 0.001 + circle.angle) * 2;
                        if (circle.radius > data.sizeRange[1]) circle.radius = data.sizeRange[0];
                    });
                    break;

                case "pixelExplosion":
                    if (!canvas.pixels) {
                        canvas.pixels = Array.from({ length: data.count }, () => ({
                            x: canvas.width / 2,
                            y: canvas.height / 2,
                            size: Math.random() * 5 + 1,
                            speedX: (Math.random() * 2 - 1) * data.speed, // Speed in the X direction, adjusted by the speed variable
            speedY: (Math.random() * 2 - 1) * data.speed,
                        }));
                    }
                    canvas.pixels.forEach(pixel => {
                        ctx.fillStyle = data.colors[Math.floor(Math.random() * data.colors.length)];
                        ctx.beginPath();
                        ctx.arc(pixel.x, pixel.y, pixel.size, 0, Math.PI * 2);
                        ctx.fill();
                        pixel.x += pixel.speedX;
                        pixel.y += pixel.speedY;
                        pixel.size *= 0.98;
                    });
                    break;

                case "cosmicDrift":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: canvas.width / 2,
                            y: canvas.height / 2,
                            size: Math.random() * 3 + 1,
                            angle: Math.random() * 2 * Math.PI,
                            speed: Math.random() * (speed) + data.speedRange[0],
                            color: data.colors[Math.floor(Math.random() * data.colors.length)]
                        }));
                    }
                    canvas.particles.forEach(p => {
                        p.x += Math.cos(p.angle) * p.speed;
                        p.y += Math.sin(p.angle) * p.speed;
                        p.size *= 0.99;

                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();

                        if (p.size < 1) {
                            p.x = canvas.width / 2;
                            p.y = canvas.height / 2;
                            p.size = Math.random() * 3 + 1;
                        }
                    });
                    break;

                case "clockworkGeometry":
                    const centrX = canvas.width / 2;
                    const centrY = canvas.height / 2;
                    const radius = data.size;
                    const angleIncrement = Math.PI / 8;
                    const totalShapes = 8;

                    for (let i = 0; i < totalShapes; i++) {
                        const angle = i * angleIncrement + Date.now() *speed;
                        const x = centrX + Math.cos(angle) * radius;
                        const y = centrY + Math.sin(angle) * radius;
                        const size = Math.sin(angle) * radius / 2 + 10;

                        ctx.fillStyle = data.colors[i % data.colors.length];
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;

                case "quantumPulse":
                    if (!canvas.pulse) {
                        canvas.pulse = { x: canvas.width / 2, y: canvas.height / 2, size: 10, growing: true };
                    }

                    if (canvas.pulse.growing) {
                        canvas.pulse.size +=  speed;
                        if (canvas.pulse.size > canvas.width / 2) canvas.pulse.growing = false;
                    } else {
                        canvas.pulse.size -= speed;
                        if (canvas.pulse.size < 10) canvas.pulse.growing = true;
                    }

                    const gradient = ctx.createRadialGradient(canvas.pulse.x, canvas.pulse.y, 0, canvas.pulse.x, canvas.pulse.y, canvas.pulse.size);
                    gradient.addColorStop(0, data.colors[0]);
                    gradient.addColorStop(0.5, data.colors[1]);
                    gradient.addColorStop(1, data.colors[2]);

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(canvas.pulse.x, canvas.pulse.y, canvas.pulse.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case "liquidCrystalWaves":
                    if (!canvas.waves) {
                        canvas.waves = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            amplitude: Math.random() * 20 + 5,
                            // speed: Math.random() * 0.1 + 0.05
                        }));
                    }

                    canvas.waves.forEach(wave => {
                        wave.x += Math.cos(Date.now() * wave.speed) * wave.amplitude;
                        wave.y += Math.sin(Date.now() * wave.speed) * wave.amplitude;

                        const gradient = ctx.createRadialGradient(wave.x, wave.y, 0, wave.x, wave.y, wave.amplitude);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(0.5, data.colors[1]);
                        gradient.addColorStop(1, data.colors[2]);

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(wave.x, wave.y, wave.amplitude, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "expandingSpiral":
                    if (!canvas.spiral) {
                        canvas.spiral = {
                            angle: 0,
                            radius: 1,
                            // speed: Math.random() * 0.05 + 0.01,
                            growth: 0.5
                        };
                    }

                    const spiral = canvas.spiral;
                    spiral.angle += spiral.speed;
                    spiral.radius += spiral.growth;

                    const x = canvas.width / 2 + spiral.radius * Math.cos(spiral.angle);
                    const y = canvas.height / 2 + spiral.radius * Math.sin(spiral.angle);

                    const gradientt = ctx.createRadialGradient(x, y, 0, x, y, spiral.radius);
                    gradientt.addColorStop(0, data.colors[0]);
                    gradientt.addColorStop(1, data.colors[1]);

                    ctx.fillStyle = gradientt;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case "fallingParticles":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            size: Math.random() * 3 + 2,
                            // speed: Math.random() * 0.5 + 0.2
                        }));
                    }

                    canvas.particles.forEach(particle => {
                        particle.y += particle.speed;
                        if (particle.y > canvas.height) {
                            particle.y = -particle.size;
                        }

                        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "wavingRectangles":
                    if (!canvas.rectangles) {
                        canvas.rectangles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            width: Math.random() * 60 + 20,
                            height: Math.random() * 40 + 20,
                            // speed: Math.random() * 0.02 + 0.01,
                            waveAmplitude: Math.random() * 10 + 5
                        }));
                    }

                    canvas.rectangles.forEach(rect => {
                        rect.y += Math.sin(Date.now() * rect.speed) * rect.waveAmplitude;

                        const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);

                        ctx.fillStyle = gradient;
                        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                    });
                    break;

                case "smoothColorFlow":
                    if (!canvas.flow) {
                        canvas.flow = {
                            time: 0
                        };
                    }

                    const flow = canvas.flow;
                    flow.time += speed;

                    const gradienttt = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    gradienttt.addColorStop(0, data.colors[0]);
                    gradienttt.addColorStop(0.5, data.colors[1]);
                    gradienttt.addColorStop(1, data.colors[2]);

                    ctx.fillStyle = gradienttt;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    break;

                case "slowRippleCircles":
                    if (!canvas.ripples) {
                        canvas.ripples = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            size: Math.random() * (data.maxSize - data.minSize) + data.minSize,
                            // speed: Math.random() * 0.02 + 0.01
                        }));
                    }

                    canvas.ripples.forEach(ripple => {
                        ripple.size += ripple.speed;
                        if (ripple.size > data.maxSize) {
                            ripple.size = data.minSize;
                        }

                        const gradient = ctx.createRadialGradient(ripple.x, ripple.y, 0, ripple.x, ripple.y, ripple.size);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(ripple.x, ripple.y, ripple.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "gravityParticles":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            velocityX: Math.random() * 2 - 1,
                            velocityY: Math.random() * 2 - 1,
                            size: Math.random() * 5 + 3,
                            gravity: 0.1,
                            friction: 0.98
                        }));
                    }

                    canvas.particles.forEach(particle => {
                        // Apply gravity to the particle's vertical velocity
                        particle.velocityY += particle.gravity;

                        // Apply friction to slow down horizontal movement
                        particle.velocityX *= particle.friction;

                        // Update particle position
                        particle.x += particle.velocityX;
                        particle.y += particle.velocityY;

                        // Check for collision with the canvas borders
                        if (particle.x > canvas.width || particle.x < 0) {
                            particle.velocityX = -particle.velocityX;
                        }
                        if (particle.y > canvas.height) {
                            particle.velocityY = -particle.velocityY * 0.7; // bounce with reduced speed
                            particle.y = canvas.height;
                        }

                        // Draw the particle
                        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "windParticles":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            velocityX: Math.random() * 2 - 1,
                            velocityY: Math.random() * 2 - 1,
                            size: Math.random() * 5 + 3,
                            windSpeed: Math.random() * 0.5 + 0.1
                        }));
                    }

                    canvas.particles.forEach(particle => {
                        // Apply wind force to the horizontal velocity
                        particle.velocityX += particle.windSpeed;

                        // Update particle position
                        particle.x += particle.velocityX;
                        particle.y += particle.velocityY;

                        // Check for border collisions
                        if (particle.x > canvas.width || particle.x < 0) {
                            particle.velocityX = -particle.velocityX;
                        }
                        if (particle.y > canvas.height) {
                            particle.velocityY = -particle.velocityY;
                            particle.y = canvas.height;
                        }

                        // Draw the particle
                        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "interactiveGravityParticles":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            velocityX: Math.random() * 2 - 1,
                            velocityY: Math.random() * 2 - 1,
                            size: Math.random() * 5 + 2,
                            gravity: 0.1,
                            friction: 0.98
                        }));
                    }

                    canvas.particles.forEach(particle => {
                        // Apply gravity
                        particle.velocityY += particle.gravity;

                        // Apply friction
                        particle.velocityX *= particle.friction;
                        particle.velocityY *= particle.friction;

                        // Calculate attraction towards mouse (interactive)
                        const mouseX = canvas.mouse.x;
                        const mouseY = canvas.mouse.y;
                        const dx = mouseX - particle.x;
                        const dy = mouseY - particle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const force = Math.min(100, 1 / distance * 0.1);

                        particle.velocityX += dx * force;
                        particle.velocityY += dy * force;

                        // Update position
                        particle.x += particle.velocityX;
                        particle.y += particle.velocityY;

                        // Boundary conditions
                        if (particle.x > canvas.width || particle.x < 0) {
                            particle.velocityX = -particle.velocityX;
                        }
                        if (particle.y > canvas.height) {
                            particle.velocityY = -particle.velocityY;
                            particle.y = canvas.height;
                        }

                        // Draw the particle
                        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
                        gradient.addColorStop(0, data.colors[0]);
                        gradient.addColorStop(1, data.colors[1]);

                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    break;

                case "rotatingSquares":
                    if (!canvas.squares) {
                        const squareCount = 120;
                        const canvasCenterX = canvas.width / 2;
                        const canvasCenterY = canvas.height / 2;
                        canvas.squares = Array.from({ length: squareCount }, (_, i) => {
                            const square = {
                                size: 38,
                                rotationSpeed: 20,
                                delay: speed,
                                hueRotation: 3 * i,
                                borderWidth: 2 // Setting border width
                            };

                            // Centering the squares
                            if (i < 40) {
                                square.x = canvasCenterX + (i * 6) - 142;
                                square.y = canvasCenterY + 100;
                            } else if (i < 80) {
                                square.x = canvasCenterX + (i * -3) + 220;
                                square.y = canvasCenterY + (i * -5) + 305;
                            } else if (i < 120) {
                                square.x = canvasCenterX + (i * 3) - 260;
                                square.y = canvasCenterY + (i * 5) - 500;
                            }

                            if (!isFinite(square.x) || !isFinite(square.y)) {
                                console.error(`Invalid position for square ${i}`);
                                square.x = 0;
                                square.y = 0;
                            }

                            return square;
                        });
                    }

                    const timee = Date.now() / 1000;

                    // Background animation (same as previous)
                    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    // bgGradient.addColorStop(0, `hsl(${timee * 5 % 360}, 100%, 30%)`);
                    // bgGradient.addColorStop(1, `hsl(${(timee * 5 + 180) % 360}, 100%, 30%)`);
                    // ctx.fillStyle = bgGradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    canvas.squares.forEach((square, i) => {
                        // Rotation & Hue Calculation
                        const angle = (timee * 360 / square.rotationSpeed + square.delay) % 360;
                        const hue = (square.hueRotation + (timee * 10)) % 360;

                        // Create a border color gradient
                        const gradient = ctx.createLinearGradient(square.x, square.y, square.x + square.size, square.y + square.size);
                        gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
                        gradient.addColorStop(1, `hsl(${(hue + 20) % 360}, 100%, 50%)`);

                        ctx.save();
                        ctx.translate(square.x + square.size / 2, square.y + square.size / 2);
                        ctx.rotate((angle * Math.PI) / 180);

                        // Set the border width and color, leave the fill transparent
                        ctx.lineWidth = square.borderWidth;
                        ctx.strokeStyle = gradient;  // Apply gradient to border
                        ctx.fillStyle = 'transparent'; // Ensure background is transparent
                        ctx.beginPath();
                        ctx.rect(-square.size / 2, -square.size / 2, square.size, square.size);
                        ctx.stroke(); // Draw border
                        ctx.restore();
                    });
                    break;

                case "rotatingSquares":
                    if (!canvas.squares) {
                        canvas.squares = Array.from({ length: data.count }, () => ({
                            x: canvas.width / 2,  // center of the canvas
                            y: canvas.height / 2, // center of the canvas
                            size: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],  // size control
                            rotation: 0,
                            // speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0],  // speed control
                            color: data.colors[Math.floor(Math.random() * data.colors.length)],
                        }));
                    }

                    canvas.squares.forEach(square => {
                        square.rotation += square.speed;  // rotate the square

                        ctx.save();
                        ctx.translate(square.x, square.y);
                        ctx.rotate(square.rotation);

                        ctx.fillStyle = square.color;
                        ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size);  // square centered around (x, y)

                        ctx.restore();
                    });
                    break;

                case "pulsingCircles":
                    if (!canvas.circles) {
                        canvas.circles = Array.from({ length: data.count }, () => ({
                            x: canvas.width / 2,  // center of the canvas
                            y: canvas.height / 2, // center of the canvas
                            minSize: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],  // min size
                            maxSize: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],  // max size
                            // speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0],  // speed control
                            color: data.colors[Math.floor(Math.random() * data.colors.length)],
                            currentSize: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],
                            growing: true,  // circle starts by growing
                        }));
                    }

                    canvas.circles.forEach(circle => {
                        // Toggle between growing and shrinking
                        if (circle.growing) {
                            circle.currentSize += circle.speed;
                            if (circle.currentSize >= circle.maxSize) {
                                circle.growing = false;
                            }
                        } else {
                            circle.currentSize -= circle.speed;
                            if (circle.currentSize <= circle.minSize) {
                                circle.growing = true;
                            }
                        }

                        ctx.beginPath();
                        ctx.arc(circle.x, circle.y, circle.currentSize, 0, Math.PI * 2);
                        ctx.fillStyle = circle.color;
                        ctx.fill();
                    });
                    break;

                case "orbitingParticles":
                    if (!canvas.particles) {
                        canvas.particles = Array.from({ length: data.count }, () => ({
                            angle: Math.random() * Math.PI * 2,  // Random initial angle for orbit
                            radius: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],  // Radius control (size)
                            // speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0],  // Speed control
                            color: data.colors[Math.floor(Math.random() * data.colors.length)],
                        }));
                    }

                    canvas.particles.forEach(particle => {
                        // Update the position of each particle based on angle and speed
                        particle.angle += particle.speed;  // Increase the angle for orbiting effect
                        particle.x = canvas.width / 2 + Math.cos(particle.angle) * particle.radius;
                        particle.y = canvas.height / 2 + Math.sin(particle.angle) * particle.radius;

                        // Draw the particle (a small circle)
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
                        ctx.fillStyle = particle.color;
                        ctx.fill();
                    });
                    break;

                case "waveGrid":
                    const gridsize = 10;  // Define grid size (adjustable for control)
                    if (!canvas.gridSquares) {
                        canvas.gridSquares = Array.from({ length: gridsize * gridsize }, (_, i) => ({
                            x: (i % gridsize) * (canvas.width / gridsize),
                            y: Math.floor(i / gridsize) * (canvas.height / gridsize),
                            size: Math.random() * (data.sizeRange[1] - data.sizeRange[0]) + data.sizeRange[0],  // Square size control
                            // speed: Math.random() * (data.speedRange[1] - data.speedRange[0]) + data.speedRange[0],  // Speed control
                            offset: Math.random() * Math.PI * 2,  // Random phase for wave effect
                            color: data.colors[Math.floor(Math.random() * data.colors.length)],
                        }));
                    }

                    canvas.gridSquares.forEach(square => {
                        // Calculate new position based on sine wave for wave effect
                        const waveEffect = Math.sin(Date.now() * square.speed + square.offset);
                        square.y += waveEffect * 10;  // Change the vertical position

                        // Draw the square with the wave effect
                        ctx.fillStyle = square.color;
                        ctx.fillRect(square.x, square.y, square.size, square.size);
                    });
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

// AnimationRenderer.js
// import React from 'react';
// import { animationsData } from '../data/animationsData'; // Importing animation data

// const AnimationRenderer = () => {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '50px' }}>
//       {animationsData.map((animation) => {
//         // Dynamically creating the CSS for each animation
//         const animationStyle = `
//           @keyframes ${animation.name} {
//             ${animation.keyframes}
//           }
          
//           .${animation.name} {
//             animation: ${animation.name} ${animation.duration} infinite alternate;
//           }
//         `;

//         return (
//           <div key={animation.id}>
//             <style>{animationStyle}</style> {/* Injecting the CSS into the document */}
//             <div
//               className={animation.name} // Applying the animation class
//               style={{
//                 width: `${animation.size}px`,
//                 height: `${animation.size}px`,
//                 backgroundColor: animation.color,
//                 borderRadius: '50%',
//               }}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default AnimationRenderer;
