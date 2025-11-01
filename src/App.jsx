import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./components/Gallery";
import AnimatedBackground from "./AnimatedBackground";
import "./App.css";

function App() {
    return (
        <div>
            
            <div>
                <Router>
                    
                    <Routes>
                        <Route path="/" element={<><AnimatedBackground/><Header /><Home /></>} />
                        <Route path="/about" element={<><AnimatedBackground/><Header /><About /></>} />
                        <Route path="/gallery" element={<><Header /><Gallery /></>} />
                        <Route path="/login" element={<div className='text-center py-20'>Login Page (Coming Soon)</div>} />
                    </Routes>
                </Router>
            </div>
            <Footer />
        </div>
    );
}

export default App;