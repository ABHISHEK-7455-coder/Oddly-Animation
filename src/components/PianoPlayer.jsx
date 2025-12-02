import React, { useState, useRef, useEffect } from "react";
import "./PianoPlayer.css"

const NOTES = [
    { key: "C3", file: "/piano/44.1khz16bit/A1v16.wav" },
    { key: "C#3", file: "/piano/44.1khz16bit/A2v16.wav" },
    { key: "D3", file: "/piano/44.1khz16bit/A3v16.wav" },
    { key: "D#3", file: "/piano/44.1khz16bit/A4v16.wav" },
    { key: "E3", file: "/piano/44.1khz16bit/A5v16.wav" },
    { key: "F3", file: "/piano/44.1khz16bit/A6v16.wav" },

    { key: "C4", file: "/piano/44.1khz16bit/C1v16.wav" },
    { key: "C#4", file: "/piano/44.1khz16bit/C2v16.wav" },
    { key: "D4", file: "/piano/44.1khz16bit/C3v16.wav" },
    { key: "D#4", file: "/piano/44.1khz16bit/C4v16.wav" },
    { key: "E4", file: "/piano/44.1khz16bit/C5v16.wav" },
    { key: "F4", file: "/piano/44.1khz16bit/C6v16.wav" },

    { key: "F#4", file: "/piano/44.1khz16bit/A1v15.wav" },
    { key: "G4", file: "/piano/44.1khz16bit/A2v15.wav" },
    { key: "G#4", file: "/piano/44.1khz16bit/A3v15.wav" },
    { key: "A4", file: "/piano/44.1khz16bit/A4v15.wav" },
    { key: "A#4", file: "/piano/44.1khz16bit/A5v15.wav" },
    { key: "B4", file: "/piano/44.1khz16bit/A6v15.wav" },

    { key: "F#3", file: "/piano/44.1khz16bit/C1v14.wav" },
    { key: "G3", file: "/piano/44.1khz16bit/C2v14.wav" },
    { key: "G#3", file: "/piano/44.1khz16bit/C3v14.wav" },
    { key: "A3", file: "/piano/44.1khz16bit/C4v14.wav" },
    { key: "A#3", file: "/piano/44.1khz16bit/C5v14.wav" },
    { key: "B3", file: "/piano/44.1khz16bit/C6v14.wav" },

    { key: "C5", file: "/piano/44.1khz16bit/A1v12.wav" },
];

// KEYBOARD → NOTE MAP
const KEY_MAP = {
    a: "C4",
    b: "C#4",
    c: "D4",
    d: "D#4",
    e: "E4",
    f: "F4",
    g: "F#4",
    h: "G4",
    i: "G#4",
    j: "A4",
    k: "A#4",
    l: "B4",
    m: "C5",
    n: "F#3",
    o: "D3",
    p: "D#3",
    q: "E3",
    r: "C3",
    s: "F3",
    t: "G3",
    u: "G#3",
    v: "A3",
    w: "A#3",
    x: "B3",
    y: "C5",
    z: "C#3"
};


export default function PianoPlayer() {
    const audioCtx = useRef(null);
    const dest = useRef(null);
    const recorder = useRef(null);
    const chunks = useRef([]);

    const [isRecording, setIsRecording] = useState(false);
    const [audioList, setAudioList] = useState([]);

    // LOAD SAVED AUDIO
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("piano_audios")) || [];
        setAudioList(stored);
    }, []);

    // SAVE AUDIO
    const saveToLocalStorage = (audioObj) => {
        const updated = [...audioList, audioObj];
        setAudioList(updated);
        localStorage.setItem("piano_audios", JSON.stringify(updated));
    };

    // REAL PIANO NOTE PLAYER
    const playNote = (file) => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            dest.current = audioCtx.current.createMediaStreamDestination();
        }

        fetch(file)
            .then((res) => res.arrayBuffer())
            .then((buf) => audioCtx.current.decodeAudioData(buf))
            .then((decoded) => {
                const source = audioCtx.current.createBufferSource();
                const gain = audioCtx.current.createGain();

                source.buffer = decoded;
                gain.gain.value = 1.0;

                source.connect(gain);
                gain.connect(audioCtx.current.destination);
                gain.connect(dest.current);

                source.start(0);
            });
    };

    // 🎹 KEYBOARD EVENT SUPPORT
    useEffect(() => {
        const handleKey = (e) => {
            const noteName = KEY_MAP[e.key.toLowerCase()];
            if (!noteName) return;

            const noteObj = NOTES.find((n) => n.key === noteName);
            if (noteObj) playNote(noteObj.file);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // START RECORDING
    const startRecording = () => {
        recorder.current = new MediaRecorder(dest.current.stream);
        chunks.current = [];

        recorder.current.ondataavailable = (e) => chunks.current.push(e.data);

        recorder.current.onstop = () => {
            const blob = new Blob(chunks.current, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);

            const audioObj = {
                id: Date.now(),
                url,
                name: "Piano_" + Date.now(),
            };

            saveToLocalStorage(audioObj);
        };

        recorder.current.start();
        setIsRecording(true);
    };

    // STOP RECORDING
    const stopRecording = () => {
        if (recorder.current.state !== "inactive") recorder.current.stop();
        setIsRecording(false);
    };

    // DOWNLOAD
    const downloadAudio = (url, name) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = name + ".webm";
        a.click();
    };

    // DELETE
    const deleteAudio = (id) => {
        const updated = audioList.filter((a) => a.id !== id);
        setAudioList(updated);
        localStorage.setItem("piano_audios", JSON.stringify(updated));
    };

    return (
        <div className="piano-container">
            <h2 className="piano-title">Real Piano</h2>

            {/* PIANO KEYS */}
            <div className="piano-keys">
                {NOTES.map((n) => (
                    <button
                        key={n.key}
                        className="piano-key"
                        onClick={() => playNote(n.file)}
                    >
                        {n.key}
                    </button>
                ))}
            </div>

            {/* RECORD BUTTONS */}
            {!isRecording ? (
                <button className="record-btn" onClick={startRecording}>
                    Start Recording
                </button>
            ) : (
                <button className="stop-btn" onClick={stopRecording}>
                    Stop Recording
                </button>
            )}

            {/* SAVED LIST */}
            <h3 className="saved-title">Saved Recordings</h3>

            {audioList.length === 0 && <p className="no-audio">No audio saved.</p>}

            <ul className="saved-list">
                {audioList.map((audio) => (
                    <li className="saved-item" key={audio.id}>
                        <span className="saved-name">{audio.name}</span>

                        <div className="saved-items-btn">
                            <button
                                className="list-btn play-btn"
                                onClick={() => new Audio(audio.url).play()}
                            >
                                Play
                            </button>

                            <button
                                className="list-btn download-btn"
                                onClick={() => downloadAudio(audio.url, audio.name)}
                            >
                                Download
                            </button>

                            <button
                                className="list-btn delete-btn"
                                onClick={() => deleteAudio(audio.id)}
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