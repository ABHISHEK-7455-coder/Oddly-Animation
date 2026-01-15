// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Gallery from "./components/Gallery";
// import AnimatedBackground from "./AnimatedBackground";
// import "./App.css";

// function App() {
//     return (
//         <div>

//             <div>
//                 <Router>

//                     <Routes>
//                         <Route path="/" element={<><AnimatedBackground/><Header /><Home /></>} />
//                         <Route path="/about" element={<><AnimatedBackground/><Header /><About /></>} />
//                         <Route path="/gallery" element={<><Header /><Gallery /></>} />
//                         <Route path="/login" element={<><Header /><div className='text-center py-20'>Login Page (Coming Soon)</div></>} />
//                     </Routes>
//                 </Router>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./components/Gallery";
import PianoPlayer from "./components/PianoPlayer";
import Login from "./pages/Login";
import MegaPhysicsDemo from "./components/MegaPhysicsDemo";
import "./App.css";

function App() {
    return (
        <div>
            <Router>
                <Routes>

                    <Route
                        path="/"
                        element={
                            <>
                                <Header />
                                <Home />
                            </>
                        }
                    />

                    <Route
                        path="/about"
                        element={
                            <>
                                <Header />
                                <About />
                            </>
                        }
                    />

                    <Route
                        path="/gallery"
                        element={
                            <>
                                <Header />
                                <Gallery />
                            </>
                        }
                    />

                    <Route
                        path="/piano-player"
                        element={
                            <>
                                <Header />
                                <PianoPlayer />
                            </>
                        }
                    />

                    {/* ✅ MATTER DEMO PAGE */}
                    <Route
                        path="/matter.js"
                        element={
                            <>
                                <Header />
                                <MegaPhysicsDemo />
                            </>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <>
                                <Header />
                                <Login />
                            </>
                        }
                    />

                </Routes>
            </Router>

            <Footer />
        </div>
    );
}

export default App;
