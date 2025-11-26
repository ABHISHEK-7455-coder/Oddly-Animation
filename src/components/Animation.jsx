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
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // adjust path if needed

// --- FFmpeg (new SDK)
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

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

    // --- NEW: states for download format menu ---
    const [showFormatMenuId, setShowFormatMenuId] = useState(null); // id of recording showing format menu
    const [selectedRec, setSelectedRec] = useState(null);
    const [isConverting, setIsConverting] = useState(false);

    // --- NEW: share menu state (inline) ---
    const [showShareMenuId, setShowShareMenuId] = useState(null);

    const canvasRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const animationRef = useRef(null);
    const audioRef = useRef(null);

    // --- ffmpeg instance ref ---
    const ffmpegRef = useRef(null);
    const ffmpegLoadingRef = useRef(false);

    // Browser flags
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent);

    // Simple toast fallback (replace with your toast if you have one)
    const showToast = (msg) => {
        try {
            // prefer non-blocking notification if available
            // Replace this with your toast component call if you have one
            alert(msg);
        } catch {
            console.log(msg);
        }
    };

    // 🌀 Load recordings on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedRecordings")) || [];
        setRecordingsList(saved);
    }, []);

    // ---------- FFmpeg loader (NEW SDK) ----------
    // NOTE: For Vite you must copy ffmpeg core files to /assets/ffmpeg via vite-plugin-static-copy.
    // Example coreURL: "/assets/ffmpeg/ffmpeg-core.js"
    const ensureFfmpeg = async () => {
        try {
            if (!ffmpegRef.current) {
                ffmpegRef.current = new FFmpeg();
            }
            // load only once
            if (!ffmpegRef.current.loaded && !ffmpegLoadingRef.current) {
                ffmpegLoadingRef.current = true;
                try {
                    await ffmpegRef.current.load({
                        // These paths assume you copied core files to /assets/ffmpeg
                        coreURL: "/assets/ffmpeg/ffmpeg-core.js",
                        wasmURL: "/assets/ffmpeg/ffmpeg-core.wasm",
                        workerURL: "/assets/ffmpeg/ffmpeg-core.worker.js",
                    });
                } catch (err) {
                    console.error("ffmpeg load failed", err);
                    showToast("ffmpeg failed to load (conversion unavailable)");
                } finally {
                    ffmpegLoadingRef.current = false;
                }
            }
        } catch (e) {
            console.error("ensureFfmpeg error", e);
        }
    };

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

    // 🧩 Convert DataURL (base64) to Blob
    const dataURLToBlob = (dataURL) => {
        // dataURL example: "data:video/webm;base64,AAAA..."
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

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
        const updated = recordingsList.map(item =>
            item.id === id ? { ...item, name: newName } : item
        );

        setRecordingsList(updated);
        localStorage.setItem("savedRecordings", JSON.stringify(updated));
        setEditingId(null);
    };

    const copyToClipboard = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999px";
            textArea.style.top = "-999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            return new Promise((resolve, reject) => {
                if (document.execCommand("copy")) {
                    resolve();
                } else {
                    reject();
                }
                document.body.removeChild(textArea);
            });
        }
    };

    // ----------------- Upload & Share (Firebase + Direct share) -----------------

    async function getActualBlob(localUrl) {
        try {
            const res = await fetch(localUrl);
            const blob = await res.blob();
            return blob;
        } catch (e) {
            console.error("Blob fetch error:", e);
            return null;
        }
    }


    // Upload base64 dataURL to Firebase Storage and return URL
    const uploadRecordingDataURL = async (rec) => {
        try {
            if (!rec) throw new Error("record not found");
            // ensure `storage` import exists (uncomment at top if needed)
            if (typeof storage === "undefined") {
                console.warn("Firebase 'storage' is not defined. Make sure to import it from your firebase config.");
                throw new Error("Firebase storage not available");
            }
            const uid = crypto.randomUUID();
            const fileRef = ref(storage, `recordings/${uid}.webm`);
            await uploadString(fileRef, rec.data, 'data_url');
            const url = await getDownloadURL(fileRef);
            return url;
        } catch (err) {
            console.error("uploadRecordingDataURL error", err);
            throw err;
        }
    };

    // Existing function (kept) but improved error handling & toast
    const uploadAndShareById = async (id) => {
        try {
            const rec = recordingsList.find(r => r.id === id);
            if (!rec) {
                console.error('uploadAndShareById: record not found for id', id);
                showToast('Upload failed: record not found');
                return;
            }

            console.log('Uploading record:', rec);
            showToast('Uploading...');

            const url = await uploadRecordingDataURL(rec);

            await copyToClipboard(url);
            showToast('Share link copied!');
            console.log('Share URL:', url);
        } catch (err) {
            console.error('uploadAndShareById error', err);
            showToast('Upload failed!');
        } finally {
            setShowShareMenuId(null);
            setShowFormatMenuId(null);
        }
    };

    // Direct share (Web Share API) — share video file directly
    const shareWebmDirectById = async (id) => {
        try {
            const rec = recordingsList.find(r => r.id === id);
            if (!rec) {
                showToast("Record not found");
                return;
            }

            const blob = dataURLToBlob(rec.data);
            const file = new File([blob], `${rec.name}.webm`, { type: blob.type });

            // Feature-detect sharing files
            const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });

            if (canShareFiles) {
                try {
                    await navigator.share({
                        title: rec.name,
                        text: "Check out this animation",
                        files: [file],
                    });
                    showToast("Shared successfully!");
                } catch (err) {
                    console.log("share cancelled or failed", err);
                    showToast("Sharing cancelled or failed");
                }
            } else {
                // Fallback: offer download + optional copy link (upload to firebase if user wants link)
                // We'll trigger a download so user can manually share the file from their device
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${rec.name}.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showToast("Download started (sharing not supported on this device).");
            }
        } catch (err) {
            console.error("shareWebmDirectById error", err);
            showToast("Direct share failed");
        } finally {
            setShowShareMenuId(null);
        }
    };

    // ----------------- Download helpers (MP4/GIF fixes) -----------------

    const downloadWebM = (rec) => {
        if (!rec) return;
        const a = document.createElement("a");
        a.href = rec.data;
        a.download = `${rec.name}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setShowFormatMenuId(null);
    };

    const downloadJSON = (rec) => {
        if (!rec) return;
        // If your recordings include config, put it here; otherwise save metadata only
        const json = {
            id: rec.id,
            name: rec.name,
            // animationConfig: rec.config || {}
        };
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${rec.name}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setShowFormatMenuId(null);
    };

    const downloadAsMP4 = async (rec) => {
        if (!rec) return;
        setIsConverting(true);
        showToast("Converting to MP4...");

        try {
            await ensureFfmpeg();
            const ffmpeg = ffmpegRef.current;

            // write webm input (rec.data is a dataURL)
            await ffmpeg.writeFile("input.webm", await fetchFile(rec.data));

            // execute conversion using new API (run)
            await ffmpeg.run(
                "-i", "input.webm",
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-crf", "23",
                "output.mp4"
            );

            // read output
            const data = await ffmpeg.readFile("output.mp4");
            const blob = new Blob([data], { type: "video/mp4" });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${rec.name}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (err) {
            console.error("MP4 conversion error", err);
            showToast("MP4 conversion failed");
        } finally {
            setIsConverting(false);
            setShowFormatMenuId(null);

            // cleanup if available
            try { await ffmpegRef.current.deleteFile("input.webm"); } catch (e) { }
            try { await ffmpegRef.current.deleteFile("output.mp4"); } catch (e) { }
        }
    };

    const downloadAsGIF = async (rec) => {
        if (!rec) return;
        setIsConverting(true);
        showToast("Converting to GIF...");

        try {
            await ensureFfmpeg();
            const ffmpeg = ffmpegRef.current;

            await ffmpeg.writeFile("input.webm", await fetchFile(rec.data));

            // palette generation
            await ffmpeg.run(
                "-i", "input.webm",
                "-vf", "fps=12,scale=480:-1:flags=lanczos,palettegen",
                "palette.png"
            );

            // gif generation using palette
            await ffmpeg.run(
                "-i", "input.webm",
                "-i", "palette.png",
                "-filter_complex",
                "fps=12,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse",
                "output.gif"
            );

            const data = await ffmpeg.readFile("output.gif");
            const blob = new Blob([data], { type: "image/gif" });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${rec.name}.gif`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (err) {
            console.error("GIF conversion error", err);
            showToast("GIF conversion failed");
        } finally {
            setIsConverting(false);
            setShowFormatMenuId(null);

            try { await ffmpegRef.current.deleteFile("input.webm"); } catch (e) { }
            try { await ffmpegRef.current.deleteFile("palette.png"); } catch (e) { }
            try { await ffmpegRef.current.deleteFile("output.gif"); } catch (e) { }
        }
    };

    // ----------------- end helpers -----------------

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
                            {/* SHARE - kept visually same, now toggles inline share menu */}
                            {/* <button className="share-btn" onClick={() => uploadAndShare(rec)}>
                                <span className="material-symbols-outlined">share</span>
                            </button> */}
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

                                                {/* PLAY */}
                                                <button className="play-btn" onClick={() => playSavedRecording(rec.data)}>
                                                    <span className="material-symbols-outlined">play_arrow</span>
                                                    <span>{rec.name}</span>
                                                </button>

                                                {/* DOWNLOAD (opens format menu) */}
                                                <button
                                                    className="download-btn"
                                                    onClick={() => {
                                                        setSelectedRec(rec);
                                                        // toggle inline menu for this record
                                                        setShowFormatMenuId(prev => (prev === rec.id ? null : rec.id));
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined">download</span>
                                                </button>

                                                {/* Inline format menu (minimal, placed next to buttons) */}
                                                {showFormatMenuId === rec.id && (
                                                    <div className="format-menu-inline">
                                                        <button
                                                            disabled={isConverting}
                                                            onClick={() => downloadWebM(rec)}
                                                        >
                                                            .webm
                                                        </button>
                                                        <button
                                                            disabled={isConverting}
                                                            onClick={() => downloadAsMP4(rec)}
                                                        >
                                                            .mp4
                                                        </button>
                                                        <button
                                                            disabled={isConverting}
                                                            onClick={() => downloadAsGIF(rec)}
                                                        >
                                                            .gif
                                                        </button>
                                                        <button
                                                            disabled={isConverting}
                                                            onClick={() => downloadJSON(rec)}
                                                        >
                                                            .json
                                                        </button>
                                                        <button
                                                            className="format-close"
                                                            onClick={() => setShowFormatMenuId(null)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                )}

                                                {/* SHARE (now toggles an inline share menu with two options) */}
                                                <div style={{ display: "inline-block", position: "relative" }}>
                                                    <button
                                                        className="share-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedRec(rec);
                                                            setShowShareMenuId(prev => (prev === rec.id ? null : rec.id));
                                                            // close other menus
                                                            setShowFormatMenuId(null);
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined">share</span>
                                                    </button>

                                                    {showShareMenuId === rec.id && (
                                                        <div className="share-menu-inline" onClick={(e) => e.stopPropagation()}>
                                                            <button className="share-btn" 
                                                                onClick={() => shareWebmDirectById(rec.id)}
                                                                disabled={isConverting}
                                                            >
                                                                Share Video
                                                            </button>
                                                            {/* <button className="share-btn"
                                                                onClick={() => uploadAndShareById(rec.id)}
                                                                disabled={isConverting}
                                                            >
                                                                Share Link (Upload)
                                                            </button> */}
                                                            <button className="format-close" onClick={() => setShowShareMenuId(null)}>✕</button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* EDIT NAME */}
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => {
                                                        const newName = prompt("Rename recording:", rec.name);
                                                        if (!newName) return;

                                                        const updated = recordingsList.map((r) =>
                                                            r.id === rec.id ? { ...r, name: newName } : r
                                                        );

                                                        setRecordingsList(updated);
                                                        localStorage.setItem("savedRecordings", JSON.stringify(updated));
                                                        showToast("Name updated");
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => {
                                                        if (window.confirm(`Delete "${rec.name}"?`)) {
                                                            const updated = recordingsList.filter((r) => r.id !== rec.id);
                                                            setRecordingsList(updated);
                                                            localStorage.setItem("savedRecordings", JSON.stringify(updated));
                                                            showToast("Recording deleted");
                                                        }
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
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
        </div>

    );
};

export default Animation;
