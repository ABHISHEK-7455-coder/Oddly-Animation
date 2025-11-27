import React, { useState, useRef } from "react";

const NOTES = [
    { key: "C", freq: 261.63 },
    { key: "D", freq: 293.66 },
    { key: "E", freq: 329.63 },
    { key: "F", freq: 349.23 },
    { key: "G", freq: 392.00 },
    { key: "A", freq: 440.00 },
    { key: "B", freq: 493.88 },
    { key: "C2", freq: 523.25 },
];

export default function PianoPlayer() {
    const audioCtx = useRef(null);
    const dest = useRef(null);
    const recorder = useRef(null);
    const chunks = useRef([]);

    const [isRecording, setIsRecording] = useState(false);
    const [savedAudio, setSavedAudio] = useState(null);

    // -------- PLAY NOTE --------
    const playNote = (freq) => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            dest.current = audioCtx.current.createMediaStreamDestination();
        }

        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();

        osc.frequency.value = freq;
        osc.type = "sawtooth"; // synth sound
        gain.gain.setValueAtTime(0.3, audioCtx.current.currentTime);

        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        gain.connect(dest.current);

        osc.start();
        osc.stop(audioCtx.current.currentTime + 0.4);
    };

    // -------- START RECORDING --------
    const startRecording = () => {
        if (!dest.current) return;

        recorder.current = new MediaRecorder(dest.current.stream);
        chunks.current = [];

        recorder.current.ondataavailable = (e) => {
            chunks.current.push(e.data);
        };

        recorder.current.onstop = () => {
            const blob = new Blob(chunks.current, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            setSavedAudio({ blob, url });
        };

        recorder.current.start();
        setIsRecording(true);
    };

    // -------- STOP RECORDING --------
    const stopRecording = () => {
        if (recorder.current && recorder.current.state !== "inactive") {
            recorder.current.stop();
        }
        setIsRecording(false);
    };

    // -------- DOWNLOAD AUDIO --------
    const downloadAudio = () => {
        if (!savedAudio) return;

        const a = document.createElement("a");
        a.href = savedAudio.url;
        a.download = "piano_recording.webm";
        a.click();
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>

            <h2 style={{ color: "#fff", marginBottom: "15px" }}>Synth Piano</h2>

            {/* PIANO KEYS */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {NOTES.map((n) => (
                    <button
                        key={n.key}
                        onClick={() => playNote(n.freq)}
                        style={{
                            width: "60px",
                            height: "160px",
                            background: "linear-gradient(180deg, #0ff, #0099ff)",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 0 12px #00e1ff, inset 0 0 5px #0055ff",
                            transition: "transform 0.1s, box-shadow 0.1s",
                            cursor: "pointer",
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = "scale(0.95)";
                            e.target.style.boxShadow = "0 0 20px #33ffff";
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "0 0 12px #00e1ff, inset 0 0 5px #0055ff";
                        }}
                    >
                        {n.key}
                    </button>
                ))}
            </div>

            {/* RECORD BUTTONS */}
            <div style={{ marginTop: "25px" }}>
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        style={{
                            padding: "10px 20px",
                            marginRight: "10px",
                            background: "#00ffcc",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        style={{
                            padding: "10px 20px",
                            marginRight: "10px",
                            background: "red",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            color: "#fff",
                            fontWeight: "bold",
                        }}
                    >
                        Stop Recording
                    </button>
                )}

                {savedAudio && (
                    <button
                        onClick={downloadAudio}
                        style={{
                            padding: "10px 20px",
                            background: "#00c3ff",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Download
                    </button>
                )}
            </div>
        </div>
    );
}
