import React, { useState, useRef, useEffect } from "react";

const NOTES = [
    { key: "C", freq: 901.63 },
    { key: "D", freq: 293.66 },
    { key: "E", freq: 329.63 },
    { key: "F", freq: 349.23 },
    { key: "G", freq: 392.00 },
    { key: "A", freq: 440.00 },
    { key: "B", freq: 493.88 },
    { key: "A2", freq: 223.25 },
    { key: "B2", freq: 723.25 },
    { key: "G2", freq: 823.25 },
];

export default function PianoPlayer() {
    const audioCtx = useRef(null);
    const dest = useRef(null);
    const recorder = useRef(null);
    const chunks = useRef([]);

    const [isRecording, setIsRecording] = useState(false);
    const [savedAudio, setSavedAudio] = useState(null);
    const [audioList, setAudioList] = useState([]);

    // -------- LOAD SAVED DATA FROM LOCAL STORAGE --------
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("piano_audios")) || [];
        setAudioList(stored);
    }, []);

    // -------- SAVE TO LOCAL STORAGE --------
    const saveToLocalStorage = (audioObj) => {
        const updated = [...audioList, audioObj];
        setAudioList(updated);
        localStorage.setItem("piano_audios", JSON.stringify(updated));
    };

    // -------- PLAY NOTE --------
    const playNote = (freq) => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            dest.current = audioCtx.current.createMediaStreamDestination();
        }

        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();

        osc.frequency.value = freq;
        osc.type = "sawtooth";
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

            const audioObj = {
                id: Date.now(),
                blob,
                url,
                name: "Piano_" + Date.now(),
            };

            setSavedAudio(audioObj);
            saveToLocalStorage({ id: audioObj.id, url: audioObj.url, name: audioObj.name });
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
    const downloadAudio = (url, name) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = name + ".webm";
        a.click();
    };

    // -------- DELETE AUDIO --------
    const deleteAudio = (id) => {
        const updated = audioList.filter((a) => a.id !== id);
        setAudioList(updated);
        localStorage.setItem("piano_audios", JSON.stringify(updated));
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#fff", marginBottom: "15px" }}>Synth Piano</h2>

            {/* ================== PIANO KEYS ================== */}
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
                            // boxShadow: "0 0 12px #00e1ff, inset 0 0 5px #0055ff",
                            transition: "transform 0.1s, box-shadow 0.1s",
                            cursor: "pointer",
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = "scale(0.95)";
                            // e.target.style.boxShadow = "0 0 20px #33ffff";
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = "scale(1)";
                            // e.target.style.boxShadow =
                                "0 0 12px #00e1ff, inset 0 0 5px #0055ff";
                        }}
                    >
                        {n.key}
                    </button>
                ))}
            </div>

            {/* ================== RECORDING BUTTONS ================== */}
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
            </div>

            {/* ================== SAVED AUDIO LIST ================== */}
            <h3 style={{ marginTop: "30px", color: "#fff" }}>Saved Recordings</h3>

            {audioList.length === 0 && (
                <p style={{ color: "#aaa" }}>No audio saved yet.</p>
            )}

            <ul style={{ listStyle: "none", padding: 0 }}>
                {audioList.map((audio) => (
                    <li
                        key={audio.id}
                        style={{
                            margin: "10px 0",
                            background: "#1b1b1b",
                            padding: "12px",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span style={{ color: "#0ff" }}>{audio.name}</span>

                        <div>
                            <button
                                onClick={() => new Audio(audio.url).play()}
                                style={{
                                    padding: "6px 12px",
                                    marginRight: "8px",
                                    background: "#0ff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Play
                            </button>

                            <button
                                onClick={() => downloadAudio(audio.url, audio.name)}
                                style={{
                                    padding: "6px 12px",
                                    marginRight: "8px",
                                    background: "#00c3ff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Download
                            </button>

                            <button
                                onClick={() => deleteAudio(audio.id)}
                                style={{
                                    padding: "6px 12px",
                                    background: "red",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
