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
    const [hueShift, setHueShift] = useState(0);
    const [isAudioPlaying, setIsAudioPlaying] = useState(true);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingsList, setRecordingsList] = useState(
        JSON.parse(localStorage.getItem("savedRecordings") || "[]")
    );
    const [isPlayingSaved, setIsPlayingSaved] = useState(false);
    const [playingVideoSrc, setPlayingVideoSrc] = useState(null);

    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecordings")) || [];
        setRecordingsList(saved);
    }, []);

    // 🎬 Start Recording
    const startRecording = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasStream = canvas.captureStream(60);
        const audioStream = audioRef.current
            ? audioRef.current.captureStream()
            : null;

        const combinedStream = audioStream
            ? new MediaStream([...canvasStream.getTracks(), ...audioStream.getTracks()])
            : canvasStream;

        const mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: "video/webm",
        });
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
                    data: reader.result,
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

    // ⏹️ Stop Recording
    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // 🎥 Play Saved Recording
    const playSavedRecording = (dataURL) => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // ✅ Convert Base64 -> Blob -> ObjectURL (mobile compatible)
        try {
            const base64 = dataURL.split(",")[1];
            const byteChars = atob(base64);
            const byteNumbers = new Array(byteChars.length)
                .fill()
                .map((_, i) => byteChars.charCodeAt(i));
            const blob = new Blob([new Uint8Array(byteNumbers)], {
                type: "video/webm",
            });
            const videoURL = URL.createObjectURL(blob);

            setPlayingVideoSrc(videoURL);
            setIsPlayingSaved(true);
        } catch (err) {
            console.error("Error playing saved video:", err);
        }
    };

    // 🔙 Back to Live Mode
    const backToLive = () => {
        if (playingVideoSrc) URL.revokeObjectURL(playingVideoSrc);
        setIsPlayingSaved(false);
        setPlayingVideoSrc(null);
    };

    // 🌀 Animation Render
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

    // 📱 Safe Download (mobile + desktop)
    const downloadRecording = (rec) => {
        try {
            const base64 = rec.data.split(",")[1];
            const byteChars = atob(base64);
            const byteNumbers = new Array(byteChars.length)
                .fill()
                .map((_, i) => byteChars.charCodeAt(i));
            const blob = new Blob([new Uint8Array(byteNumbers)], {
                type: "video/webm",
            });

            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${rec.name}.webm`;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        } catch (e) {
            console.error("Download failed:", e);
        }
    };

    return (
        <div className="main-container">
            <div className="mobile-dropdowns">
                <details className="dropdown-section dropdown-animation">
                    <summary>🎨 Animations</summary>
                    <div className="dropdown-content">
                        {animationData.map((anim) => (
                            <button
                                key={anim.id}
                                className={`animation-btn ${selectedAnimation === anim.id ? "active" : ""
                                    }`}
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
                                        {isAudioPlaying ? "🔊" : "🔇"}
                                    </button>
                                )}
                            </button>
                        ))}
                    </div>
                </details>

                <details className="dropdown-section">
                    <summary>⚙️ Controls</summary>
                    <div className="dropdown-content dropdown-controls">
                        <div className="size">
                            <label>Size: {size.toFixed(1)}x</label>
                            <input
                                type="range"
                                min="0.3"
                                max="2"
                                step="0.1"
                                value={size}
                                onChange={(e) => setSize(parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="color">
                            <label>Color Shift : {hueShift}°</label>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                step="10"
                                value={hueShift}
                                onChange={(e) => setHueShift(parseInt(e.target.value))}
                            />
                        </div>

                        {!isRecording ? (
                            <button className="record-btn start" onClick={startRecording}>
                                ⏺️ Start Recording
                            </button>
                        ) : (
                            <button className="record-btn stop" onClick={stopRecording}>
                                ⏹️ Stop Recording
                            </button>
                        )}

                        {recordingsList.length > 0 && (
                            <details className="dropdown-section inner">
                                <summary>🎞 Saved Recordings</summary>
                                <div className="recordings-items">
                                    {recordingsList.map((rec) => (
                                        <div key={rec.id} className="recording-item">
                                            <button
                                                className="play-btn"
                                                onClick={() => playSavedRecording(rec.data)}
                                            >
                                                ▶️ {rec.name}
                                            </button>
                                            <button
                                                className="download-btn"
                                                onClick={() => downloadRecording(rec)}
                                            >
                                                ⬇️
                                            </button>
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
                                                ❌
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                </details>
            </div>

            <div className="container">
                <div className="sidebar desktop-only">
                    <h1 className="sidebar-title">✨ Animations</h1>
                    {animationData.map((anim) => (
                        <button
                            key={anim.id}
                            className={`animation-btn ${selectedAnimation === anim.id ? "active" : ""
                                }`}
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
                                    {isAudioPlaying ? "🔊" : "🔇"}
                                </button>
                            )}
                        </button>
                    ))}
                </div>

                <div className="canvas-area">
                    {!isPlayingSaved ? (
                        <canvas ref={canvasRef} className="animation-canvas" />
                    ) : (
                        <>
                            <video
                                src={playingVideoSrc}
                                controls
                                autoPlay
                                muted
                                playsInline
                                className="video-player"
                            />
                            <button onClick={backToLive} className="back-btn">
                                🔙 Back to Live
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Animation;

