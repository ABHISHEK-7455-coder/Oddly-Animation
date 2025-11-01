

import { animationData } from "../data/animationConfig";
import { useState, useEffect, useRef } from 'react';

const Animation = () => {
    const [selectedAnimation, setSelectedAnimation] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [size, setSize] = useState(1);
    const [hueShift, setHueShift] = useState(0);
    const [isAudioPlaying, setIsAudioPlaying] = useState(true);

    // 🎥 Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingsList, setRecordingsList] = useState(JSON.parse(localStorage.getItem("savedRecordings") || "[]"));
    const [isPlayingSaved, setIsPlayingSaved] = useState(false);
    const [playingVideoSrc, setPlayingVideoSrc] = useState(null);

    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const audioRef = useRef(null);

    // 🧠 Load saved recordings
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecordings")) || [];
        setRecordingsList(saved);
    }, []);

    // 🎬 Start recording
    const startRecording = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasStream = canvas.captureStream(60);
        const audioStream = audioRef.current ? audioRef.current.captureStream() : null;
        const combinedStream = audioStream
            ? new MediaStream([...canvasStream.getTracks(), ...audioStream.getTracks()])
            : canvasStream;

        const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const newRecording = {
                    id: Date.now(),
                    name: `Recording ${recordingsList.length + 1}`,
                    data: reader.result
                };
                const updatedList = [newRecording, ...recordingsList];
                setRecordingsList(updatedList);
                localStorage.setItem("savedRecordings", JSON.stringify(updatedList));
            };
        };

        mediaRecorder.start();
        recorderRef.current = mediaRecorder;
        setIsRecording(true);
    };

    // ⏹️ Stop recording
    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // 🎥 Play Saved Recording in Canvas Area
    const playSavedRecording = (videoSrc) => {
        // Stop current animation + audio
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Set video source to play in place of animation
        setPlayingVideoSrc(videoSrc);
        setIsPlayingSaved(true);
    };

    // 🔙 Back to Live Mode
    const backToLive = () => {
        setIsPlayingSaved(false);
        setPlayingVideoSrc(null);
    };

    // 🌀 Animation Logic
    useEffect(() => {
        if (isPlayingSaved) return; // don't run live animation when playing saved video

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const currentAnim = animationData[selectedAnimation];
        const config = { ...currentAnim.config, speed, size, hueShift };

        if (isAudioPlaying && currentAnim.audio) {
            const audio = new Audio(currentAnim.audio);
            audio.volume = 0.6;
            audio.loop = true;
            audio.play().catch((err) => console.warn("Audio play failed:", err));
            audioRef.current = audio;
        }

        const state = currentAnim.init(canvas, config);
        const animate = () => {
            currentAnim.animate(ctx, canvas, config, state);
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (state.cleanup) state.cleanup();
        };
    }, [selectedAnimation, speed, size, hueShift, isAudioPlaying, isPlayingSaved]);

    return (
        <div style={{
            display: 'flex',
            height: '82.5vh',
            width: '87vw',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            {/* Sidebar */}
            <div style={{
                width: '300px',
                background: 'rgba(20, 20, 40, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                overflowY: 'auto',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.5)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '30px',
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    ✨ Satisfying Animations
                </h1>

                {/* Controls */}
                <div style={{
                    marginBottom: '30px',
                    padding: '15px',
                    background: 'rgb(40, 40, 80)',
                    borderRadius: '12px',
                    border: '1px solid rgba(100, 100, 255, 0.2)',
                    position: "sticky",
                    top: "0"
                }}>
                    <label style={{ color: '#fff', fontSize: '13px' }}>
                        Size: {size.toFixed(1)}x
                    </label>
                    <input
                        type="range"
                        min="0.3"
                        max="2"
                        step="0.1"
                        value={size}
                        onChange={(e) => setSize(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: '#667eea' }}
                    />
                    <label style={{ color: '#fff', fontSize: '13px' }}>
                        Color Shift: {hueShift}°
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        step="10"
                        value={hueShift}
                        onChange={(e) => setHueShift(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#667eea' }}
                    />

                    {/* Recording Buttons */}
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            style={{
                                width: "100%", padding: 10, marginTop: 20,
                                background: "#4CAF50", color: "#fff", border: "none",
                                borderRadius: 8, cursor: "pointer", fontWeight: "600"
                            }}
                        >
                            ⏺️ Start Recording
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            style={{
                                width: "100%", padding: 10, marginTop: 20,
                                background: "#f44336", color: "#fff", border: "none",
                                borderRadius: 8, cursor: "pointer", fontWeight: "600"
                            }}
                        >
                            ⏹️ Stop Recording
                        </button>
                    )}

                    {/* 🎞 Saved Recordings List */}
                    {recordingsList.length > 0 && (
                        <div style={{ marginTop: 25 }}>
                            <h3 style={{ color: "#fff", marginBottom: 10 }}>🎞 Saved Recordings</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {recordingsList.map((rec) => {
                                    // 🧹 Clean base64 string
                                    const base64 = rec.data.split(",").pop();
                                    const byteChars = atob(base64);
                                    const byteNums = new Array(byteChars.length)
                                        .fill()
                                        .map((_, i) => byteChars.charCodeAt(i));
                                    const blob = new Blob([new Uint8Array(byteNums)], { type: "video/webm" });
                                    const videoURL = URL.createObjectURL(blob);

                                    return (
                                        <div
                                            key={rec.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                background: "rgba(255,255,255,0.1)",
                                                padding: "8px 5px",
                                                borderRadius: "6px",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                            }}
                                        >
                                            <button
                                                onClick={() => playSavedRecording(rec.data)}
                                                style={{
                                                    flex: 1,
                                                    textAlign: "left",
                                                    background: "transparent",
                                                    color: "#fff",
                                                    border: "none",
                                                    fontSize: "14px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ▶️ {rec.name}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const a = document.createElement("a");
                                                    a.href = videoURL;
                                                    a.download = `${rec.name}.webm`;
                                                    a.click();
                                                    URL.revokeObjectURL(videoURL);
                                                }}
                                                style={{
                                                    marginLeft: 8,
                                                    background: "rgba(0, 200, 0, 0.2)",
                                                    color: "#00ff99",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    padding: "4px 8px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ⬇️
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Delete "${rec.name}"?`)) {
                                                        const updated = recordingsList.filter((r) => r.id !== rec.id);
                                                        setRecordingsList(updated);
                                                        localStorage.setItem("savedRecordings", JSON.stringify(updated));
                                                    }
                                                }}
                                                style={{
                                                    marginLeft: 8,
                                                    background: "rgba(255, 0, 0, 0.2)",
                                                    color: "#ff5555",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    padding: "4px 8px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    )}
                </div>

                {/* Animation Buttons */}
                {animationData.map((anim) => (
                    <button
                        key={anim.id}
                        onClick={() => {
                            setIsPlayingSaved(false);
                            setSelectedAnimation(anim.id);
                        }}
                        style={{
                            width: "90%",
                            padding: "10px",
                            margin: "8px auto",
                            background: selectedAnimation === anim.id
                                ? "rgba(102, 126, 234, 0.3)"
                                : "rgba(255,255,255,0.1)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {anim.name}
                        {selectedAnimation === anim.id && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (audioRef.current) {
                                        if (isAudioPlaying) audioRef.current.pause();
                                        else audioRef.current.play();
                                    }
                                    setIsAudioPlaying(!isAudioPlaying);
                                }}
                                style={{
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "16px",
                                    background: "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isAudioPlaying ? "🔊" : "🔇"}
                            </button>
                        )}
                    </button>
                ))}

            </div>

            {/* Canvas / Video Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative'
            }}>
                {!isPlayingSaved ? (
                    <canvas
                        ref={canvasRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '16px',
                            boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
                            background: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    />
                ) : (
                    <>
                        <video
                            src={playingVideoSrc}
                            controls
                            autoPlay
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "16px",
                                background: "#000",
                                objectFit: "cover",
                            }}
                        />
                        <button
                            onClick={backToLive}
                            style={{
                                position: "absolute",
                                top: 20,
                                right: 20,
                                background: "#667eea",
                                color: "#fff",
                                padding: "10px 15px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            🔙 Back to Live
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Animation;
