import React from "react";
import HeroSection from "../components/HeroSection";
import { animationData } from "../data/animationConfig";
import { useNavigate, NavLink } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* BACKGROUND BLOBS */}
      <div class="bg-blob blob-primary"></div>
      <div class="bg-blob blob-accent"></div>
      <div class="bg-blob blob-purple"></div>

      {/* <!-- NAVBAR --> */}
      {/* <nav class="navbar">
    <div class="glass-panel">
      <div class="layout-container">
        <div class="navbar-inner">
          <div class="navbar-left">
            <div class="brand">
              <div class="brand-icon">
                <span class="material-symbols-outlined">category</span>
              </div>
              <h2 class="brand-title">PhysicsPlay</h2>
            </div>
          </div>

          <div class="navbar-right">
            <div class="nav-links">
              <a href="#">Playground</a>
              <a href="#">Showcase</a>
              <a href="#">About</a>
            </div>
            <button class="nav-cta">Sign Up</button>
          </div>

          <div class="nav-mobile">
            <span class="material-symbols-outlined">menu</span>
          </div>
        </div>
      </div>
    </div>
  </nav> */}

      {/* <!-- HERO SECTION --> */}
      <section class="hero-section">
        <div class="layout-container hero-container">
          <div class="hero-grid">

            {/* <!-- HERO TEXT --> */}
            <div class="hero-content">
              {/* <div class="version-badge">
            <span class="pulse-dot"></span>
            <span>v2.0 Available Now</span>
          </div> */}

              <h1 class="hero-title">
                Play. Break.<br />
                <span class="text-gradient-primary">Feel the Physics.</span>
              </h1>

              <p class="hero-description">
                A professional-grade playground for motion, sound, and realism.
                Experience the web's physics engine like never before.
              </p>

              <div class="hero-actions">
                <button class="btn-primary">
                  <span><NavLink
                    to="/gallery"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => {
                      handleLinkClick();
                    }}
                  >
                    Enter the Playground
                  </NavLink></span>
                  <span class="material-symbols-outlined">arrow_forward</span>
                </button>

                {/* <button class="btn-secondary">
                  <span class="material-symbols-outlined">play_circle</span>
                  Watch Demo
                </button> */}
              </div>

              <div class="hero-social-proof">
                <div class="avatar-stack">
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                </div>
                <span>Loved by 10k+ developers</span>
              </div>
            </div>

            {/* <!-- HERO VISUAL --> */}
            <div class="hero-visual">
              <div class="visual-glow"></div>

              <div class="visual-card">
                <div class="visual-header">
                  <div class="window-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span class="file-name">simulation.js</span>
                </div>

                <div class="visual-canvas">
                  <div class="grid-overlay"></div>
                  <div class="physics-ball"></div>
                  <div class="question-ball">?</div>
                  <div class="pulse-orb"></div>
                </div>

                <div class="piano-preview">
                  <div class="key white"></div>
                  <div class="key white"></div>
                  <div class="key black"></div>
                  <div class="key white"></div>
                  <div class="key black"></div>
                  <div class="key white"></div>
                </div>
              </div>
            </div>

          </div>

          {/* <div class="scroll-indicator">
        <span>Explore</span>
        <span class="material-symbols-outlined">keyboard_arrow_down</span>
      </div> */}
        </div>
      </section>

      {/* <!-- CORE TECHNOLOGY --> */}
      <section class="core-tech">
        <div class="layout-container">
          <div class="section-header">
            <div class="section-text">
              {/* <h4>Core Technology</h4> */}
              <h2>Matter.js Playground</h2>
              <p>
                Experiment with rigid bodies, soft collisions, and gravity in our
                interactive sandbox.
              </p>
            </div>
            {/* <a href="#" class="section-link">
          Explore Documentation
          <span class="material-symbols-outlined">arrow_right_alt</span>
        </a> */}
          </div>

          <div class="tech-grid">
            <div class="tech-card">
              <div class="tech-media" style={{
                backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuC9_rsefN7tuO9QgCE1IylWQFH-nsBiaGxHMUtuGxEjnWbO43O9p16FXoAtWyKY6eV4O41QVmq8X2QzJV0094xWbajyQ-kLaS-8rVpCRakdvPQY0B0BDoqNBqOx91PtZA0ramr_vXTRC9XCY-UMbrH0Oz-BxgVMGi299wl8eFzOo0DKBJ76QOfnS1-A_EuG8CgzFiFgMouButrj1O2IQyR9jjwhmdKJCEDWjARLW_YKLyngHOLTInGkGrGmklMa6uiFKhHgrBwuxic)",
                backgroundPosition: "center"
              }}></div>
              <h3>Soft Body Simulation</h3>
              <p>Squishy, deformable objects that react naturally.</p>
            </div>

            <div class="tech-card">
              <div class="tech-media" style={{
                backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBMnwhl5sqedZrruXdDjP3TrlwdVGluEtCXncck8SBj6FL0mx056UEBPk_pYYBg94-3BBK7JVFgQjOJB9b7IypB_cQuJo-TzyZHEXew4XktDtArFe7EQlp7dw0_SxRtS28btY-DyFixQItnT6GK9GV3brdFbQ4I1JC66DC7-zthaaraSRXakqfnXgvJ5sTW4rrqzy40ToQY9AXZArdL5rmISWuVrj4K2O5Ojdum6PBgvhQNzxkyjTXC9SYVSKMH1rAPatgV4FP0jrw)",
                backgroundPosition: "center"
              }}></div>
              <h3>Rigid Collisions</h3>
              <p>High-precision collision physics.</p>
            </div>

            <div class="tech-card">
              <div class="tech-media" style={{
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
      <section class="satisfying-loops">
        <div class="layout-container">
          <div class="section-center">
            <h1>Oddly Satisfying Animations</h1>
            <p>Visual ASMR designed to calm your mind.</p>
          </div>

          <div class="loops-grid">
            <div class="loop-card large" style={{
              backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBeG7W-YfM5BNQqifujgYteWSngbQDrtQNEYNEBiGhPRIBReclt2LVU_2JIgCizuuaseOzIJtbncF308zmAqQNJb2kMhlggAhevoxqsv_2S_Jm9pCZjUAo_sIDO0ppt53nxMbg1cuXCNEaM4xlDeYgBFikUDep7HjPVTRotsJSoEe-lq5-ldkzPU44Ou8F4v1zb1P6x5aAYMwwW9-coE5lXtb-WGiE4jjs_deRqeeGCX-4G6UwS-FiHJb_-97YTxFN2p7yqufvutvg)",
              backgroundPosition: "center"
            }}></div>
            <div class="loop-card" style={{
              backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAlyfsk0dda8NsOPYwzTtVRzRYHrU-aCou5MrDBVMCSxuau28GMzdHZl-h3vln5JbzbOup7LoufU20wymd7EzdqOlkesm50diZu5bo2lDUv6l_CZ7tybZDx48r_lcLsodZg1PgsH0lMTkPLYSI01kpmlR5ga_p9sg-TgAIbYtthbddwWMyXmVjulDQJmL0kKvO0r5N-TYGareBTxKvXfzBsAGgXQ60Wml6J68d_DNdk-7BD80iMvpiQ0Q1hU05HowWbcAfI_2wuicI)",
              backgroundPosition: "center"
            }}></div>
            <div class="loop-card" style={{
              backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuASHKOjaIInxjlRlq8h-AtA3TIhS11TbzN2ShxcOsmxBGkHHIaqHkBT67YJWnMBckDrNPceZxiK1wuW_Kwy3VUk-Mjzh6cAZWI1_RD-lWJQOr8TYeCCI9xRDZ1p23YErHeHHd4IAahpiYPwBp2UpdJEiNqEZeyaUucFMndrROPzn7IJ86SRxYeCrKAoUxF21DSbPlRZb0PlXrolB3XlfCsbBpQdUCGH5gr_b0Ij8qA4USjbeZtMX5IiM9euXyWl3nBGiLDUVn0ylWk)",
              backgroundPosition: "center"
            }}></div>
            <div class="loop-card wide" style={{
              backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBlk7lzjDORcnF1A6VeiDvCpIgmj7VZj3lEhNLgaSQev6dQ2JINcAUbR-frIeWOtG381i-2w7VSJp_DzeojwpEwfc1NLA6qFtKChMnuq5ZJRl7zaKBAQnJAKH6-cd6XusYwjMPYpyv8NL4Vclay70BhSL_zDJbbZyHnQTsZMfgaBr3L75l9r0YTDz-WeZ6TpE2MCCJM5hnfIWb4nMIOyN_dG_s6ut81eBhF1XtrM6OTZJo3JFoSHlY6-BxPAeakH3bz7whI7nV73uM)",
              backgroundPosition: "center"
            }}></div>
          </div>
        </div>
      </section>

      {/* <!-- PIANO EXPERIENCE --> */}
      <section class="piano-section">
        <div class="layout-container">
          <div class="piano-card">
            <div class="piano-content">
              <div class="piano-badge">
                <span class="material-symbols-outlined">music_note</span>
                <span>Interactive Audio</span>
              </div>

              <h2>Piano Experience</h2>
              <p>
                A minimal virtual piano with responsive light waves and soothing
                audio synthesis.
              </p>

              <button class="btn-primary">
                <span><NavLink
                  to="/piano-player"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }

                >
                  Start Composing
                </NavLink></span>
                <span class="material-symbols-outlined">piano</span>
              </button>
            </div>

            <div class="piano-visual">
              <div class="audio-bars"></div>
              <div class="piano-keys"></div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- FOOTER --> */}
      {/* <footer class="footer">
    <div class="layout-container footer-grid">
      <div class="footer-brand">
        <div class="brand">
          <div class="brand-icon">
            <span class="material-symbols-outlined">category</span>
          </div>
          <span class="brand-title">PhysicsPlay</span>
        </div>
        <p>
          Designed with precision, code, and a passion for interactive web
          experiences.
        </p>
      </div>

      <div class="footer-links">
        <div>
          <h4>Product</h4>
          <a href="#">Features</a>
          <a href="#">Showcase</a>
          <a href="#">Pricing</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href="#">Documentation</a>
          <a href="#">API</a>
          <a href="#">Community</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2024 PhysicsPlay Inc. All rights reserved.</p>
      </div>
    </div>
  </footer> */}
    </>
  );
};

export default Home;
