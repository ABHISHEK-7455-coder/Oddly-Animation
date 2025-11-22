// import { animationData } from "../data/animationConfig";
// import { useState, useEffect, useRef } from "react";
// import "./Animation.css";

// const Animation = () => {
//   const [selectedAnimation, setSelectedAnimation] = useState(0);
//   const [speed, setSpeed] = useState(1);
//   const [size, setSize] = useState(1);
//   const [hueShift, setHueShift] = useState(0);
//   const [isAudioPlaying, setIsAudioPlaying] = useState(true);

//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingsList, setRecordingsList] = useState(
//     JSON.parse(localStorage.getItem("savedRecordings") || "[]")
//   );
//   const [isPlayingSaved, setIsPlayingSaved] = useState(false);
//   const [playingVideoSrc, setPlayingVideoSrc] = useState(null);

//   const recorderRef = useRef(null);
//   const chunksRef = useRef([]);
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("savedRecordings")) || [];
//     setRecordingsList(saved);
//   }, []);

//   // 🎬 Start Recording
//   const startRecording = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const canvasStream = canvas.captureStream(60);
//     const audioStream = audioRef.current
//       ? audioRef.current.captureStream()
//       : null;

//     const combinedStream = audioStream
//       ? new MediaStream([...canvasStream.getTracks(), ...audioStream.getTracks()])
//       : canvasStream;

//     const mediaRecorder = new MediaRecorder(combinedStream, {
//       mimeType: "video/webm",
//     });
//     chunksRef.current = [];

//     mediaRecorder.ondataavailable = (e) => {
//       if (e.data.size > 0) chunksRef.current.push(e.data);
//     };

//     mediaRecorder.onstop = () => {
//       const blob = new Blob(chunksRef.current, { type: "video/webm" });
//       const reader = new FileReader();
//       reader.readAsDataURL(blob);
//       reader.onloadend = () => {
//         const newRecording = {
//           id: Date.now(),
//           name: `Recording ${recordingsList.length + 1}`,
//           data: reader.result,
//         };
//         const updatedList = [newRecording, ...recordingsList];
//         setRecordingsList(updatedList);
//         localStorage.setItem("savedRecordings", JSON.stringify(updatedList));
//       };
//     };

//     mediaRecorder.start();
//     recorderRef.current = mediaRecorder;
//     setIsRecording(true);
//   };

//   // ⏹️ Stop Recording
//   const stopRecording = () => {
//     if (recorderRef.current) {
//       recorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // 🎥 Play Saved Recording
//   const playSavedRecording = (dataURL) => {
//     if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }

//     // ✅ Convert Base64 -> Blob -> ObjectURL (mobile compatible)
//     try {
//       const base64 = dataURL.split(",")[1];
//       const byteChars = atob(base64);
//       const byteNumbers = new Array(byteChars.length)
//         .fill()
//         .map((_, i) => byteChars.charCodeAt(i));
//       const blob = new Blob([new Uint8Array(byteNumbers)], {
//         type: "video/webm",
//       });
//       const videoURL = URL.createObjectURL(blob);

//       setPlayingVideoSrc(videoURL);
//       setIsPlayingSaved(true);
//     } catch (err) {
//       console.error("Error playing saved video:", err);
//     }
//   };

//   // 🔙 Back to Live Mode
//   const backToLive = () => {
//     if (playingVideoSrc) URL.revokeObjectURL(playingVideoSrc);
//     setIsPlayingSaved(false);
//     setPlayingVideoSrc(null);
//   };

//   // 🌀 Animation Render
//   useEffect(() => {
//     if (isPlayingSaved) return;

//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }

//     const currentAnim = animationData[selectedAnimation];
//     const config = { ...currentAnim.config, speed, size, hueShift };

//     if (isAudioPlaying && currentAnim.audio) {
//       const audio = new Audio(currentAnim.audio);
//       audio.volume = 0.6;
//       audio.loop = true;
//       audio.play().catch((err) => console.warn("Audio play failed:", err));
//       audioRef.current = audio;
//     }

//     const state = currentAnim.init(canvas, config);
//     const animate = () => {
//       currentAnim.animate(ctx, canvas, config, state);
//       animationRef.current = requestAnimationFrame(animate);
//     };
//     animate();

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//       }
//       if (state.cleanup) state.cleanup();
//     };
//   }, [selectedAnimation, speed, size, hueShift, isAudioPlaying, isPlayingSaved]);

//   // 📱 Safe Download (mobile + desktop)
//   const downloadRecording = (rec) => {
//     try {
//       const base64 = rec.data.split(",")[1];
//       const byteChars = atob(base64);
//       const byteNumbers = new Array(byteChars.length)
//         .fill()
//         .map((_, i) => byteChars.charCodeAt(i));
//       const blob = new Blob([new Uint8Array(byteNumbers)], {
//         type: "video/webm",
//       });

//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `${rec.name}.webm`;
//       a.style.display = "none";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(a.href);
//     } catch (e) {
//       console.error("Download failed:", e);
//     }
//   };

//   return (
//     <div className="main-container">
//       <div className="mobile-dropdowns">
//         <details className="dropdown-section dropdown-animation">
//           <summary>🎨 Animations</summary>
//           <div className="dropdown-content">
//             {animationData.map((anim) => (
//               <button
//                 key={anim.id}
//                 className={`animation-btn ${
//                   selectedAnimation === anim.id ? "active" : ""
//                 }`}
//                 onClick={() => {
//                   setIsPlayingSaved(false);
//                   setSelectedAnimation(anim.id);
//                 }}
//               >
//                 {anim.name}
//                 {selectedAnimation === anim.id && (
//                   <button
//                     className="audio-toggle"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (audioRef.current) {
//                         if (isAudioPlaying) audioRef.current.pause();
//                         else audioRef.current.play();
//                       }
//                       setIsAudioPlaying(!isAudioPlaying);
//                     }}
//                   >
//                     {isAudioPlaying ? "🔊" : "🔇"}
//                   </button>
//                 )}
//               </button>
//             ))}
//           </div>
//         </details>

//         <details className="dropdown-section">
//           <summary>⚙️ Controls</summary>
//           <div className="dropdown-content dropdown-controls">
//             <div className="size">
//               <label>Size: {size.toFixed(1)}x</label>
//               <input
//                 type="range"
//                 min="0.3"
//                 max="2"
//                 step="0.1"
//                 value={size}
//                 onChange={(e) => setSize(parseFloat(e.target.value))}
//               />
//             </div>

//             <div className="color">
//               <label>Color Shift : {hueShift}°</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="360"
//                 step="10"
//                 value={hueShift}
//                 onChange={(e) => setHueShift(parseInt(e.target.value))}
//               />
//             </div>

//             {!isRecording ? (
//               <button className="record-btn start" onClick={startRecording}>
//                 ⏺️ Start Recording
//               </button>
//             ) : (
//               <button className="record-btn stop" onClick={stopRecording}>
//                 ⏹️ Stop Recording
//               </button>
//             )}

//             {recordingsList.length > 0 && (
//               <details className="dropdown-section inner">
//                 <summary>🎞 Saved Recordings</summary>
//                 <div className="recordings-items">
//                   {recordingsList.map((rec) => (
//                     <div key={rec.id} className="recording-item">
//                       <button
//                         className="play-btn"
//                         onClick={() => playSavedRecording(rec.data)}
//                       >
//                         ▶️ {rec.name}
//                       </button>
//                       <button
//                         className="download-btn"
//                         onClick={() => downloadRecording(rec)}
//                       >
//                         ⬇️
//                       </button>
//                       <button
//                         className="delete-btn"
//                         onClick={() => {
//                           if (window.confirm(`Delete "${rec.name}"?`)) {
//                             const updated = recordingsList.filter(
//                               (r) => r.id !== rec.id
//                             );
//                             setRecordingsList(updated);
//                             localStorage.setItem(
//                               "savedRecordings",
//                               JSON.stringify(updated)
//                             );
//                           }
//                         }}
//                       >
//                         ❌
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </details>
//             )}
//           </div>
//         </details>
//       </div>

//       <div className="container">
//         <div className="sidebar desktop-only">
//           <h1 className="sidebar-title">✨ Animations</h1>
//           {animationData.map((anim) => (
//             <button
//               key={anim.id}
//               className={`animation-btn ${
//                 selectedAnimation === anim.id ? "active" : ""
//               }`}
//               onClick={() => {
//                 setIsPlayingSaved(false);
//                 setSelectedAnimation(anim.id);
//               }}
//             >
//               {anim.name}
//               {selectedAnimation === anim.id && (
//                 <button
//                   className="audio-toggle"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (audioRef.current) {
//                       if (isAudioPlaying) audioRef.current.pause();
//                       else audioRef.current.play();
//                     }
//                     setIsAudioPlaying(!isAudioPlaying);
//                   }}
//                 >
//                   {isAudioPlaying ? "🔊" : "🔇"}
//                 </button>
//               )}
//             </button>
//           ))}
//         </div>

//         <div className="canvas-area">
//           {!isPlayingSaved ? (
//             <canvas ref={canvasRef} className="animation-canvas" />
//           ) : (
//             <>
//               <video
//                 src={playingVideoSrc}
//                 controls
//                 autoPlay
//                 muted
//                 playsInline
//                 className="video-player"
//               />
//               <button onClick={backToLive} className="back-btn">
//                 🔙 Back to Live
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Animation;

import { animationData } from "../data/animationConfig";
import { useState, useEffect, useRef } from "react";
import "./Animation.css";

const Animation = () => {
    const [selectedAnimation, setSelectedAnimation] = useState(0);
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

    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState("");

    const canvasRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const animationRef = useRef(null);
    const audioRef = useRef(null);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent);

    // 🌀 Load recordings on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecordings")) || [];
        setRecordingsList(saved);
    }, []);

    // 🎬 Start recording
    const startRecording = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Browser compatibility check
        if (!window.MediaRecorder || isSafari) {
            alert("🎥 Recording not supported on this browser (Safari / Vivo).");
            return;
        }

        try {
            const canvasStream = canvas.captureStream(30);
            const audioStream = audioRef.current
                ? audioRef.current.captureStream()
                : null;

            const combinedStream = audioStream
                ? new MediaStream([...canvasStream.getTracks(), ...audioStream.getTracks()])
                : canvasStream;

            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: "video/webm;codecs=vp9,opus",
            });

            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                const base64 = await blobToBase64(blob);
                const newRecording = {
                    id: Date.now(),
                    name: `Recording ${recordingsList.length + 1}`,
                    data: base64,
                };

                const updated = [newRecording, ...recordingsList];
                setRecordingsList(updated);
                localStorage.setItem("savedRecordings", JSON.stringify(updated));
                alert("✅ Recording saved successfully!");
            };

            mediaRecorder.start();
            recorderRef.current = mediaRecorder;
            setIsRecording(true);
        } catch (err) {
            console.error(err);
            alert("⚠️ Unable to start recording on this browser.");
        }
    };

    // ⏹️ Stop recording
    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // 🧩 Convert Blob to Base64
    const blobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    // ▶️ Play Saved Recording
    const playSavedRecording = (videoSrc) => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setIsPlayingSaved(true);
        setPlayingVideoSrc(videoSrc);
    };

    // 🔙 Back to Live Animations
    const backToLive = () => {
        setIsPlayingSaved(false);
        setPlayingVideoSrc(null);
    };

    // 🌀 Main Animation Logic
    useEffect(() => {
        if (isPlayingSaved) return;

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
            audio.volume = 0.5;
            audio.loop = true;
            audio.play().catch(() => { });
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

    const filteredAnimations = animationData.filter(anim =>
        anim.name.toLowerCase().includes(search.toLowerCase())
    );

    const startEditing = (item) => {
        setEditingId(item.id);
        setNewName(item.name);
    };

    const saveNewName = (id) => {
        const updated = savedList.map(item =>
            item.id === id ? { ...item, name: newName } : item
        );

        setSavedList(updated);
        localStorage.setItem("savedAnimations", JSON.stringify(updated));
        setEditingId(null);
    };

    return (
        <div className="main-container">
            {/* Mobile Dropdowns */}
            <div className="mobile-dropdowns">
                <details className="dropdown-section dropdown-animation">
                    <summary>
                        <span className="material-symbols-outlined">palette</span> Animations
                    </summary>
                    <div className="dropdown-content">
                        {filteredAnimations.map((anim) => (
                            <button
                                key={anim.id}
                                className={`animation-btn ${selectedAnimation === anim.id ? "active" : ""}`}
                                onClick={() => {
                                    setIsPlayingSaved(false);
                                    setSelectedAnimation(anim.id);
                                }}
                            >
                                {anim.name}
                                {selectedAnimation === anim.id && (
                                    <button
                                        className="audio-toggle"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (audioRef.current) {
                                                if (isAudioPlaying) audioRef.current.pause();
                                                else audioRef.current.play();
                                            }
                                            setIsAudioPlaying(!isAudioPlaying);
                                        }}
                                    >
                                        <span className="material-symbols-outlined">
                                            {isAudioPlaying ? "volume_up" : "volume_off"}
                                        </span>
                                    </button>
                                )}
                            </button>
                        ))}
                    </div>
                </details>

                <details className="dropdown-section">
                    <summary>
                        <span className="material-symbols-outlined">tune</span> Customize Here
                    </summary>
                </details>
            </div>

            {/* Desktop Layout */}
            <div className="container">
                <div className="sidebar desktop-only">
                    <h1 className="sidebar-title">
                        <span className="material-symbols-outlined">auto_awesome</span> Explore more ...
                    </h1>
                    <div className="animations">
                        {filteredAnimations.map((anim) => (
                            <button
                                key={anim.id}
                                className={`animation-btn ${selectedAnimation === anim.id ? "active" : ""}`}
                                onClick={() => {
                                    setIsPlayingSaved(false);
                                    setSelectedAnimation(anim.id);
                                }}
                            >
                                <img src={anim.image} width="100%" height="150px" style={{ borderRadius: "0px" }} />
                                <div className="anim-name">
                                    {anim.name}
                                    {selectedAnimation === anim.id && (
                                        <button
                                            className="audio-toggle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (audioRef.current) {
                                                    if (isAudioPlaying) audioRef.current.pause();
                                                    else audioRef.current.play();
                                                }
                                                setIsAudioPlaying(!isAudioPlaying);
                                            }}
                                        >
                                            <span className="material-symbols-outlined">
                                                {isAudioPlaying ? "volume_up" : "volume_off"}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="canvas-area">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search animations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
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
                                playsInline
                                muted
                            />
                            <button onClick={backToLive} className="back-btn">
                                <span className="material-symbols-outlined">arrow_back</span> Back to Live
                            </button>
                        </>
                    )}

                    <div className="dropdown-content dropdown-controls">
                        <div className="size-color">
                            <div className="speed">
                                <label>Speed : </label>
                                <div className="input">
                                    <input
                                        className="range"
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        value={speed}
                                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                    />
                                    {speed.toFixed(1)}x
                                </div>
                            </div>

                            <div className="size">
                                <label>Size : </label>
                                <div className="input">
                                    <input
                                        className="range"
                                        type="range"
                                        min="0.3"
                                        max="2"
                                        step="0.1"
                                        value={size}
                                        onChange={(e) => setSize(parseFloat(e.target.value))}
                                    />
                                    {size.toFixed(1)}x
                                </div>
                            </div>

                            <div className="color">
                                <label>Color Shift : </label>
                                <div className="input">
                                    <input
                                        className="range"
                                        type="range"
                                        min="0"
                                        max="360"
                                        step="10"
                                        value={hueShift}
                                        onChange={(e) => setHueShift(parseInt(e.target.value))}
                                    />
                                    {hueShift}°
                                </div>
                            </div>
                        </div>

                        <div className="record-saved">
                            {/* Record Buttons */}
                            {!isRecording ? (
                                <button className="record-btn start" onClick={startRecording}>
                                    {/* <span className="material-symbols-outlined">arrow_down</span>  */}
                                    Start Recording
                                </button>
                            ) : (
                                <button className="record-btn stop" onClick={stopRecording}>
                                    <span className="material-symbols-outlined">stop_circle</span> Stop Recording
                                </button>
                            )}

                            {/* Saved Recordings */}
                            {recordingsList.length > 0 && (
                                <details className="dropdown-section inner">
                                    <summary>
                                        <span className="material-symbols-outlined">movie</span> Saved Recordings
                                    </summary>

                                    <div className="recordings-items">
                                        {recordingsList.map((rec) => (
                                            <div key={rec.id} className="recording-item">

                                                {/* If editing this item */}
                                                {editingId === rec.id ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="rename-input"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                        />

                                                        <button
                                                            className="save-btn"
                                                            onClick={() => {
                                                                const updated = recordingsList.map((r) =>
                                                                    r.id === rec.id ? { ...r, name: newName } : r
                                                                );

                                                                setRecordingsList(updated);
                                                                localStorage.setItem(
                                                                    "savedRecordings",
                                                                    JSON.stringify(updated)
                                                                );

                                                                setEditingId(null);
                                                                setNewName("");
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined">check</span>
                                                        </button>

                                                        <button
                                                            className="cancel-btn"
                                                            onClick={() => {
                                                                setEditingId(null);
                                                                setNewName("");
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined">close</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Play Button */}
                                                        <button
                                                            className="play-btn"
                                                            onClick={() => playSavedRecording(rec.data)}
                                                        >
                                                            {/* <span className="material-symbols-outlined">play_arrow</span> */}
                                                            <span>{rec.name}</span>
                                                        </button>

                                                        {/* Download */}
                                                        <button
                                                            className="download-btn"
                                                            onClick={() => {
                                                                const a = document.createElement("a");
                                                                a.href = rec.data;
                                                                a.download = `${rec.name}.webm`;
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined">download</span>
                                                        </button>

                                                        {/* Edit */}
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => {
                                                                setEditingId(rec.id);
                                                                setNewName(rec.name);
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => {
                                                                if (window.confirm(`Delete "${rec.name}"?`)) {
                                                                    const updated = recordingsList.filter(
                                                                        (r) => r.id !== rec.id
                                                                    );
                                                                    setRecordingsList(updated);
                                                                    localStorage.setItem(
                                                                        "savedRecordings",
                                                                        JSON.stringify(updated)
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Animation;
