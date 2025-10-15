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
