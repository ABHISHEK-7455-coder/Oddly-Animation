import React, { useState, useRef, useEffect } from "react";
import "./PianoPlayer.css";

/**
 * Updated PianoPlayer (real-piano board UI)
 * - Uses your provided WAV file paths (kept unchanged)
 * - Reordered into physical piano layout (C3 -> C5)
 * - Real white + black key UI
 * - Keyboard (A-Z) support preserved via KEY_MAP
 * - Recording, save to localStorage, play, download, delete — same as before
 */

/* ---------- ORIGINAL file-path NOTES (kept as sources) ----------
   I kept your file paths exactly; only re-mapped them into the correct piano order below.
*/
const SOURCE_NOTES = [
    { key: "C3", file: "/piano/pianoAudio/A1v16.wav" },
    { key: "C#3", file: "/piano/pianoAudio/A2v16.wav" },
    { key: "D3", file: "/piano/pianoAudio/A3v16.wav" },
    { key: "D#3", file: "/piano/pianoAudio/A4v16.wav" },
    { key: "E3", file: "/piano/pianoAudio/A5v16.wav" },
    { key: "F3", file: "/piano/pianoAudio/A6v16.wav" },

    { key: "C4", file: "/piano/pianoAudio/C1v16.wav" },
    { key: "C#4", file: "/piano/pianoAudio/C2v16.wav" },
    { key: "D4", file: "/piano/pianoAudio/C3v16.wav" },
    { key: "D#4", file: "/piano/pianoAudio/C4v16.wav" },
    { key: "E4", file: "/piano/pianoAudio/C5v16.wav" },
    { key: "F4", file: "/piano/pianoAudio/C6v16.wav" },

    { key: "F#4", file: "/piano/pianoAudio/A1v15.wav" },
    { key: "G4", file: "/piano/pianoAudio/A2v15.wav" },
    { key: "G#4", file: "/piano/pianoAudio/A3v15.wav" },
    { key: "A4", file: "/piano/pianoAudio/A4v15.wav" },
    { key: "A#4", file: "/piano/pianoAudio/A5v15.wav" },
    { key: "B4", file: "/piano/pianoAudio/A6v15.wav" },

    { key: "F#3", file: "/piano/pianoAudio/C1v14.wav" },
    { key: "G3", file: "/piano/pianoAudio/C2v14.wav" },
    { key: "G#3", file: "/piano/pianoAudio/C3v14.wav" },
    { key: "A3", file: "/piano/pianoAudio/C4v14.wav" },
    { key: "A#3", file: "/piano/pianoAudio/C5v14.wav" },
    { key: "B3", file: "/piano/pianoAudio/C6v14.wav" },

    { key: "C5", file: "/piano/pianoAudio/A1v12.wav" },
];
// -------------------------------------------------------------------

/**
 * Re-order SOURCE_NOTES into actual piano physical layout from C3 -> C5
 * White keys (ordered): C3 D3 E3 F3 G3 A3 B3 C4 D4 E4 F4 G4 A4 B4 C5
 * Black keys (in-between): C#3 D#3 F#3 G#3 A#3 C#4 D#4 F#4 G#4 A#4
 */

// Small helper to build lookup quickly:
const SOURCE_MAP = {};
SOURCE_NOTES.forEach(n => { SOURCE_MAP[n.key] = n.file; });

// White keys (physical order)
const WHITE_KEYS_ORDER = [
  "C3","D3","E3","F3","G3","A3","B3",
  "C4","D4","E4","F4","G4","A4","B4","C5"
];

// Black keys with the white index they appear after (index into WHITE_KEYS_ORDER)
const BLACK_KEYS_INFO = [
  { key: "C#3", afterIndex: 0 },
  { key: "D#3", afterIndex: 1 },
  // no black between E & F
  { key: "F#3", afterIndex: 3 },
  { key: "G#3", afterIndex: 4 },
  { key: "A#3", afterIndex: 5 },

  { key: "C#4", afterIndex: 7 },
  { key: "D#4", afterIndex: 8 },
  { key: "F#4", afterIndex: 10 },
  { key: "G#4", afterIndex: 11 },
  { key: "A#4", afterIndex: 12 },
];

// Build white and black key arrays by pulling files from SOURCE_MAP (if missing keep file null)
const WHITE_KEYS = WHITE_KEYS_ORDER.map(k => ({ key: k, file: SOURCE_MAP[k] || null }));
const BLACK_KEYS = BLACK_KEYS_INFO.map(b => ({ key: b.key, file: SOURCE_MAP[b.key] || null, afterIndex: b.afterIndex }));

// KEYBOARD → NOTE MAP (kept same as you provided)
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

    // REAL PIANO NOTE PLAYER (keeps your decodeAudioData approach)
    const playNoteByFile = (file) => {
        if (!file) {
            // file missing — optionally show a toast or console
            console.warn("Sample not found for this key.");
            return;
        }

        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            dest.current = audioCtx.current.createMediaStreamDestination();
        }

        // fetch + decode + play
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
                // route to recorder destination as well
                if (dest.current) gain.connect(dest.current);

                source.start(0);
            })
            .catch(err => {
                console.error("playNote error:", err);
            });
    };

    // exposes old API name playNote(file)
    const playNote = (file) => playNoteByFile(file);

    // KEYBOARD (A–Z) event support
    useEffect(() => {
        const handleKey = (e) => {
            const noteName = KEY_MAP[e.key.toLowerCase()];
            if (!noteName) return;

            // find file for that noteName from our white/black sets
            const all = [...WHITE_KEYS, ...BLACK_KEYS];
            const noteObj = all.find(n => n.key === noteName);
            if (noteObj) playNote(noteObj.file);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // START RECORDING
    const startRecording = () => {
        if (!dest.current) {
            // ensure audioCtx and dest exist (user may not have pressed any key yet)
            audioCtx.current = audioCtx.current || new (window.AudioContext || window.webkitAudioContext)();
            dest.current = dest.current || audioCtx.current.createMediaStreamDestination();
        }

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
        if (recorder.current && recorder.current.state !== "inactive") recorder.current.stop();
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

    // compute black key left positions as percent relative to white key count
    const whiteCount = WHITE_KEYS.length;
    const leftPercentForBlack = (afterIndex) => {
        // left = (afterIndex + offset) * 100/whiteCount
        const offset = 0.65; // tweak for visual centering
        const percent = ((afterIndex + offset) / whiteCount) * 100;
        return `${percent}%`;
    };

    return (
        <div className="piano-container">
            <h2 className="piano-title">Piano Board</h2>

            {/* PIANO BOARD */}
            <div className="piano-board">

                {/* White keys row */}
                <div className="white-keys">
                    {WHITE_KEYS.map((n) => (
                        <button
                            key={n.key}
                            className="white-key"
                            onMouseDown={() => playNote(n.file)}
                            onTouchStart={() => playNote(n.file)}
                            title={n.key}
                        >
                            <div className="key-label">{n.key}</div>
                        </button>
                    ))}
                </div>

                {/* Black keys overlay */}
                <div className="black-keys">
                    {BLACK_KEYS.map((n, idx) => (
                        <button
                            key={n.key}
                            className="black-key"
                            style={{ left: leftPercentForBlack(n.afterIndex) }}
                            onMouseDown={() => playNote(n.file)}
                            onTouchStart={() => playNote(n.file)}
                            title={n.key}
                        >
                            <div className="key-label-black">{n.key}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* RECORD BUTTONS */}
            <div className="record-row">
                {!isRecording ? (
                    <button className="record-btn" onClick={startRecording}>Start Recording</button>
                ) : (
                    <button className="stop-btn" onClick={stopRecording}>Stop Recording</button>
                )}
            </div>

            {/* SAVED LIST */}
            <h3 className="saved-title">Saved Recordings</h3>

            {audioList.length === 0 && <p className="no-audio">No audio saved.</p>}

            <ul className="saved-list">
                {audioList.map((audio) => (
                    <li className="saved-item" key={audio.id}>
                        <span className="saved-name">{audio.name}</span>

                        <div className="saved-items-btn">
                            <button className="list-btn play-btn" onClick={() => new Audio(audio.url).play()}>Play</button>

                            <button className="list-btn download-btn" onClick={() => downloadAudio(audio.url, audio.name)}>Download</button>

                            <button className="list-btn delete-btn" onClick={() => deleteAudio(audio.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
