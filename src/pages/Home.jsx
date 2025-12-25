import React from "react";
import HeroSection from "../components/HeroSection";
import { animationData } from "../data/animationConfig";
import { useNavigate, NavLink } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="main-home-container">
            {/* BACKGROUND BLOBS */}
            <div className="bg-blob blob-primary"></div>
            <div className="bg-blob blob-accent"></div>
            <div className="bg-blob blob-purple"></div>

            {/* <!-- HERO SECTION --> */}
            <section className="hero-section">
                <div className="layout-container hero-container">
                    <div className="hero-grid">

                        {/* <!-- HERO TEXT --> */}
                        <div className="hero-content">
                            

                            <h1 className="hero-title">
                                Play. Break.<br />
                                <span className="text-gradient-primary">Feel the Physics.</span>
                            </h1>

                            <p className="hero-description">
                                A professional-grade playground for motion, sound, and realism.
                                Experience the web's physics engine like never before.
                            </p>

                            <div className="hero-actions">
                                <button className="btn-primary">
                                    <span><NavLink
                                        to="/gallery"
                                        classNameName={({ isActive }) =>
                                            `nav-link ${isActive ? "active" : ""}`
                                        }
                                        onClick={() => {
                                            handleLinkClick();
                                        }}
                                    >
                                        Enter the Playground
                                    </NavLink></span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>


                            </div>

                            <div className="hero-social-proof">
                                <div className="avatar-stack">
                                    <div className="avatar"></div>
                                    <div className="avatar"></div>
                                    <div className="avatar"></div>
                                </div>
                                <span>Loved by 10k+ developers</span>
                            </div>
                        </div>

                        {/* <!-- HERO VISUAL --> */}
                        <div className="hero-visual">
                            <div className="visual-glow"></div>

                            <div className="visual-card">
                                <div className="visual-header">
                                    <div className="window-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <span className="file-name">simulation.js</span>
                                </div>

                                <div className="visual-canvas">
                                    <div className="grid-overlay"></div>
                                    <div className="physics-ball"></div>
                                    <div className="question-ball">?</div>
                                    <div className="pulse-orb"></div>
                                </div>

                                <div className="piano-preview">
                                    <div className="key white"></div>
                                    <div className="key white"></div>
                                    <div className="key black"></div>
                                    <div className="key white"></div>
                                    <div className="key black"></div>
                                    <div className="key white"></div>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>
            </section>

            {/* <!-- CORE TECHNOLOGY --> */}
            <section className="core-tech">
                <div className="layout-container">
                    <div className="section-header">
                        <div className="section-text">
                            {/* <h4>Core Technology</h4> */}
                            <h2>Matter.js Playground</h2>
                            <p>
                                Experiment with rigid bodies, soft collisions, and gravity in our
                                interactive sandbox.
                            </p>
                        </div>

                    </div>

                    <div className="tech-grid">
                        <div className="tech-card">
                            <div className="tech-media" style={{
                                backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuC9_rsefN7tuO9QgCE1IylWQFH-nsBiaGxHMUtuGxEjnWbO43O9p16FXoAtWyKY6eV4O41QVmq8X2QzJV0094xWbajyQ-kLaS-8rVpCRakdvPQY0B0BDoqNBqOx91PtZA0ramr_vXTRC9XCY-UMbrH0Oz-BxgVMGi299wl8eFzOo0DKBJ76QOfnS1-A_EuG8CgzFiFgMouButrj1O2IQyR9jjwhmdKJCEDWjARLW_YKLyngHOLTInGkGrGmklMa6uiFKhHgrBwuxic)",
                                backgroundPosition: "center"
                            }}></div>
                            <h3>Soft Body Simulation</h3>
                            <p>Squishy, deformable objects that react naturally.</p>
                        </div>

                        <div className="tech-card">
                            <div className="tech-media" style={{
                                backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBMnwhl5sqedZrruXdDjP3TrlwdVGluEtCXncck8SBj6FL0mx056UEBPk_pYYBg94-3BBK7JVFgQjOJB9b7IypB_cQuJo-TzyZHEXew4XktDtArFe7EQlp7dw0_SxRtS28btY-DyFixQItnT6GK9GV3brdFbQ4I1JC66DC7-zthaaraSRXakqfnXgvJ5sTW4rrqzy40ToQY9AXZArdL5rmISWuVrj4K2O5Ojdum6PBgvhQNzxkyjTXC9SYVSKMH1rAPatgV4FP0jrw)",
                                backgroundPosition: "center"
                            }}></div>
                            <h3>Rigid Collisions</h3>
                            <p>High-precision collision physics.</p>
                        </div>

                        <div className="tech-card">
                            <div className="tech-media" style={{
                                backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBFXfEfU2vUDah6TztVtkdVKM2R4WYzMKCSDuvOQvLBGUKgZ73qabP3fWjt-xclS0FeVv82L-49yinP-a1GUYqpwBb6v0AaQ1hnSDwEM6SWexRzlIZV-0HyS5oOSJ_ZVMV499nzoGuv40_OHT9z5mha1vf3l1F5X4nFVn6A7UgX4W_zR6EZyErUdpdSLc3TlgfoZiD5wF2883wwlOc6eQMyITOFLpvOYoAlrgMIpNYYRR5lYOJPI3OurPylZZa4sbKn7gLXTHsB8hQ)",
                                backgroundPosition: "center"
                            }}></div>
                            <h3>Gravity Control</h3>
                            <p>Reverse gravity, zero-G, or black holes.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* <!-- SATISFYING LOOPS --> */}
            <section className="satisfying-loops">
                <div className="layout-container">
                    <div className="section-center">
                        <h1>Oddly Satisfying Animations</h1>
                        <p>Visual ASMR designed to calm your mind.</p>
                    </div>

                    <div className="loops-grid">
                        <div className="loop-card large" style={{
                            backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBeG7W-YfM5BNQqifujgYteWSngbQDrtQNEYNEBiGhPRIBReclt2LVU_2JIgCizuuaseOzIJtbncF308zmAqQNJb2kMhlggAhevoxqsv_2S_Jm9pCZjUAo_sIDO0ppt53nxMbg1cuXCNEaM4xlDeYgBFikUDep7HjPVTRotsJSoEe-lq5-ldkzPU44Ou8F4v1zb1P6x5aAYMwwW9-coE5lXtb-WGiE4jjs_deRqeeGCX-4G6UwS-FiHJb_-97YTxFN2p7yqufvutvg)",
                            backgroundPosition: "center"
                        }}></div>
                        <div className="loop-card" style={{
                            backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAlyfsk0dda8NsOPYwzTtVRzRYHrU-aCou5MrDBVMCSxuau28GMzdHZl-h3vln5JbzbOup7LoufU20wymd7EzdqOlkesm50diZu5bo2lDUv6l_CZ7tybZDx48r_lcLsodZg1PgsH0lMTkPLYSI01kpmlR5ga_p9sg-TgAIbYtthbddwWMyXmVjulDQJmL0kKvO0r5N-TYGareBTxKvXfzBsAGgXQ60Wml6J68d_DNdk-7BD80iMvpiQ0Q1hU05HowWbcAfI_2wuicI)",
                            backgroundPosition: "center"
                        }}></div>
                        <div className="loop-card" style={{
                            backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuASHKOjaIInxjlRlq8h-AtA3TIhS11TbzN2ShxcOsmxBGkHHIaqHkBT67YJWnMBckDrNPceZxiK1wuW_Kwy3VUk-Mjzh6cAZWI1_RD-lWJQOr8TYeCCI9xRDZ1p23YErHeHHd4IAahpiYPwBp2UpdJEiNqEZeyaUucFMndrROPzn7IJ86SRxYeCrKAoUxF21DSbPlRZb0PlXrolB3XlfCsbBpQdUCGH5gr_b0Ij8qA4USjbeZtMX5IiM9euXyWl3nBGiLDUVn0ylWk)",
                            backgroundPosition: "center"
                        }}></div>
                        <div className="loop-card wide" style={{
                            backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBlk7lzjDORcnF1A6VeiDvCpIgmj7VZj3lEhNLgaSQev6dQ2JINcAUbR-frIeWOtG381i-2w7VSJp_DzeojwpEwfc1NLA6qFtKChMnuq5ZJRl7zaKBAQnJAKH6-cd6XusYwjMPYpyv8NL4Vclay70BhSL_zDJbbZyHnQTsZMfgaBr3L75l9r0YTDz-WeZ6TpE2MCCJM5hnfIWb4nMIOyN_dG_s6ut81eBhF1XtrM6OTZJo3JFoSHlY6-BxPAeakH3bz7whI7nV73uM)",
                            backgroundPosition: "center"
                        }}></div>
                    </div>
                </div>
            </section>

            {/* <!-- PIANO EXPERIENCE --> */}
            <section className="piano-section">
                <div className="layout-container">
                    <div className="piano-card">
                        <div className="piano-content">
                            <div className="piano-badge">
                                <span className="material-symbols-outlined">music_note</span>
                                <span>Interactive Audio</span>
                            </div>

                            <h2>Piano Experience</h2>
                            <p>
                                A minimal virtual piano with responsive light waves and soothing
                                audio synthesis.
                            </p>

                            <button className="btn-primary">
                                <span><NavLink
                                    to="/piano-player"
                                    classNameName={({ isActive }) =>
                                        `nav-link ${isActive ? "active" : ""}`
                                    }

                                >
                                    Start Composing
                                </NavLink></span>
                                <span className="material-symbols-outlined">piano</span>
                            </button>
                        </div>

                        <div className="piano-visual">
                            <img src="https://dontcrytoys.com/cdn/shop/files/Papami_Piano.jpg?v=1742557775&width=1946" alt="piano board" width="100%"/>
                            {/* <div className="audio-bars"></div>
                            <div className="piano-keys"></div> */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
