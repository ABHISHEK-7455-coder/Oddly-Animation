import React, { useState } from "react";
import Animation from "../components/Animation";
import "./Home.css";

const Home = () => {
    const [color, setColor] = useState("#4caf50");
    const [speed, setSpeed] = useState(1.4);

    return (
        <main className="home-container">
            <h1 className="hero-title">Oddly Satisfying Wave</h1>
            <p className="hero-subtitle">Watch the smooth wave of circles pulse beautifully.</p>

            <Animation color={color} speed={speed} />

            <div className="controls">
                <label>
                    Circle Color:
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </label>

                <label>
                    Speed (seconds):
                    <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                </label>
            </div>
        </main>
    );
};

export default Home;
