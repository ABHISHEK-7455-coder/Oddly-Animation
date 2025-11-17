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
import AnimationPage from "./pages/AnimationPage";  // ✅ NEW PAGE
import AnimatedBackground from "./AnimatedBackground";
import "./App.css";
import  LogIn  from "C:/OddlyAnimation/src/pages/Login.jsx";

function App() {
    return (
        <div>
            <Router>
                <Routes>

                    {/* ✅ HOME PAGE */}
                    <Route 
                        path="/" 
                        element={
                            <>
                                <AnimatedBackground />
                                <Header />
                                <Home />
                            </>
                        } 
                    />

                    {/* ✅ ABOUT PAGE */}
                    <Route 
                        path="/about" 
                        element={
                            <>
                                <AnimatedBackground />
                                <Header />
                                <About />
                            </>
                        } 
                    />

                    {/* ✅ GALLERY PAGE */}
                    <Route 
                        path="/gallery" 
                        element={
                            <>
                                {/* <Header /> */}
                                <Gallery />
                            </>
                        } 
                    />

                    {/* ✅ INDIVIDUAL ANIMATION DISPLAY PAGE */}
                    <Route 
                        path="/animation/:id" 
                        element={
                            <>
                                <Header />
                                {/* <AnimationPage /> */}
                            </>
                        } 
                    />

                    {/* ✅ LOGIN PAGE (Coming Soon) */}
                    <Route 
                        path="/login" 
                        element={
                            <>
                                <Header />
                                <LogIn />
                                {/* <div className='text-center py-20'>Login Page (Coming Soon)</div> */}
                            </>
                        } 
                    />

                </Routes>
            </Router>

            {/* ✅ Footer Sab Pages ke neeche fix rahega */}
            <Footer />
        </div>
    );
}

export default App;
