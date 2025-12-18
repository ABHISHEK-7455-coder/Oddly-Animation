import { animationData } from "../data/animationConfig";
import { useState, useEffect, useRef } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import "./Animation.css";

const Animation = () => {
    // ---------------- STATES ----------------
    const [selectedAnimation, setSelectedAnimation] = useState(0);
    const [showAnimationView, setShowAnimationView] = useState(false);

    const [speed, setSpeed] = useState(1);
    const [size, setSize] = useState(1);
    const [hueShift, setHueShift] = useState(20);
    const [isAudioPlaying, setIsAudioPlaying] = useState(true);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingsList, setRecordingsList] = useState(
        JSON.parse(localStorage.getItem("savedRecordings") || "[]")
    );

    const [isPlayingSaved, setIsPlayingSaved] = useState(false);
    const [playingVideoSrc, setPlayingVideoSrc] = useState(null);

    const [search, setSearch] = useState("");

    const [showShareMenuId, setShowShareMenuId] = useState(null);

    // ---------------- REFS ----------------
    const canvasRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const animationRef = useRef(null);
    const audioRef = useRef(null);

    // ---------------- LOAD RECORDINGS ----------------
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecordings")) || [];
        setRecordingsList(saved);
    }, []);

    // ---------------- RECORDING ----------------
    const startRecording = async () => {
        if (!canvasRef.current || !window.MediaRecorder) return alert("Recording not supported");

        const canvasStream = canvasRef.current.captureStream(30);
        const mediaRecorder = new MediaRecorder(canvasStream);

        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const reader = new FileReader();
            reader.onloadend = () => {
                const newRec = {
                    id: Date.now(),
                    name: `Recording ${recordingsList.length + 1}`,
                    data: reader.result,
                };
                const updated = [newRec, ...recordingsList];
                setRecordingsList(updated);
                localStorage.setItem("savedRecordings", JSON.stringify(updated));
            };
            reader.readAsDataURL(blob);
        };

        mediaRecorder.start();
        recorderRef.current = mediaRecorder;
        setIsRecording(true);
    };

    const stopRecording = () => {
        recorderRef.current?.stop();
        setIsRecording(false);
    };

    // ---------------- PLAY SAVED ----------------
    const playSavedRecording = (src) => {
        cancelAnimationFrame(animationRef.current);
        audioRef.current?.pause();
        setIsPlayingSaved(true);
        setPlayingVideoSrc(src);
    };

    const backToLive = () => {
        setIsPlayingSaved(false);
        setPlayingVideoSrc(null);
    };

    // ---------------- CANVAS ANIMATION ----------------
    useEffect(() => {
        if (!showAnimationView || isPlayingSaved) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const anim = animationData[selectedAnimation];
        const config = { ...anim.config, speed, size, hueShift };

        if (isAudioPlaying && anim.audio) {
            audioRef.current = new Audio(anim.audio);
            audioRef.current.loop = true;
            audioRef.current.play().catch(() => { });
        }

        const state = anim.init(canvas, config);

        const loop = () => {
            anim.animate(ctx, canvas, config, state);
            animationRef.current = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animationRef.current);
            audioRef.current?.pause();
            state.cleanup?.();
        };
    }, [showAnimationView, selectedAnimation, size, hueShift, speed, isAudioPlaying]);

    // ---------------- HELPERS ----------------
    const downloadWebM = (rec) => {
        const a = document.createElement("a");
        a.href = rec.data;
        a.download = `${rec.name}.webm`;
        a.click();
    };

    const filteredAnimations = animationData.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    // ====================== JSX ======================
    return (
        <div className="main-container">



            {/* ================= CARDS VIEW ================= */}
            {!showAnimationView && (
                <div className="container">
                    <div className="search-box">
                        <h3>Melo Motions Gallery</h3>
                        <input
                            placeholder="Search animations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="sidebar">
                        <div className="animations">
                            {filteredAnimations.map((anim) => (
                                <button
                                    key={anim.id}
                                    className="animation-btn"
                                    onClick={() => {
                                        setSelectedAnimation(anim.id);
                                        setShowAnimationView(true);
                                    }}
                                >
                                    <img src={anim.image} width="100%" height="150" />
                                    <div className="anim-name">{anim.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= ANIMATION VIEW ================= */}
            {showAnimationView && (
                <div className="container">
                    <div className="canvas-area">

                        {!isPlayingSaved ? (
                            <canvas ref={canvasRef} className="animation-canvas" />
                        ) : (
                            <>
                                <video
                                    src={playingVideoSrc}
                                    className="video-player"
                                    controls
                                    autoPlay
                                    loop
                                />
                                <button className="back-btn" onClick={backToLive}>
                                    Back
                                </button>
                            </>
                        )}

                        <button
                            className="back-btn"
                            onClick={() => {
                                setShowAnimationView(false);
                                setIsPlayingSaved(false);
                            }}
                        >
                            ✕ Close
                        </button>

                        {/* ========== CONTROLS ========== */}
                        <div className="dropdown-controls">
                            <div className="size-color">
                                <div className="size">
                                    <label>Size</label>
                                    <input
                                        className="range"
                                        type="range"
                                        min="0.3"
                                        max="2"
                                        step="0.1"
                                        value={size}
                                        onChange={(e) => setSize(+e.target.value)}
                                    />
                                </div>

                                <div className="color">
                                    <label>Color</label>
                                    <input
                                        className="range"
                                        type="range"
                                        min="0"
                                        max="360"
                                        step="10"
                                        value={hueShift}
                                        onChange={(e) => setHueShift(+e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="record-saved">
                                {!isRecording ? (
                                    <button className="record-btn start" onClick={startRecording}>
                                        Start Recording
                                    </button>
                                ) : (
                                    <button className="record-btn stop" onClick={stopRecording}>
                                        Stop Recording
                                    </button>
                                )}

                                {recordingsList.length > 0 && (
                                    <details className="dropdown-section inner">
                                        <summary>Saved Recordings</summary>
                                        <div className="recordings-items">
                                            {recordingsList.map((rec) => (
                                                <div key={rec.id} className="recording-item">
                                                    <button
                                                        className="play-btn"
                                                        onClick={() => playSavedRecording(rec.data)}
                                                    >
                                                        {rec.name}
                                                    </button>

                                                    <button
                                                        className="download-btn"
                                                        onClick={() => downloadWebM(rec)}
                                                    >
                                                        ⬇
                                                    </button>

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => {
                                                            const name = prompt("Rename", rec.name);
                                                            if (!name) return;
                                                            const updated = recordingsList.map((r) =>
                                                                r.id === rec.id ? { ...r, name } : r
                                                            );
                                                            setRecordingsList(updated);
                                                            localStorage.setItem("savedRecordings", JSON.stringify(updated));
                                                        }}
                                                    >
                                                        ✎
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => {
                                                            if (!window.confirm("Delete recording?")) return;
                                                            const updated = recordingsList.filter((r) => r.id !== rec.id);
                                                            setRecordingsList(updated);
                                                            localStorage.setItem("savedRecordings", JSON.stringify(updated));
                                                        }}
                                                    >
                                                        🗑
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Animation;
