import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./components/Gallery";
import "./App.css";
import { div } from "framer-motion/client";

function App() {
    return (
        <div>
            <div>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/login" element={<div className='text-center py-20'>Login Page (Coming Soon)</div>} />
                    </Routes>

                </Router>
               
            </div>
            <Footer />
        </div>
    );
}

export default App;
