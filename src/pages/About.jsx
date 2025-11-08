// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./About.css";

// const About = () => {
//   const navigate = useNavigate();

//   return (
//     <main className="about-container">
//       {/* Animated Background Shapes */}
//       {/* <div className="about-floating-shapes">
//         <span className="shape shape1"></span>
//         <span className="shape shape2"></span>
//         <span className="shape shape3"></span>
//         <span className="shape shape4"></span>
//       </div> */}

//       <section className="about-intro">
//         <h1 className="about-title">About This App</h1>
//         <p className="about-description">
//           This React application demonstrates <span className="highlight">oddly satisfying animations</span> of pulsing circles, waves, pendulums, and more.
//           Built with <span className="highlight">React functional components</span>, <span className="highlight">CSS animations</span>, and <span className="highlight">React Router</span> for seamless navigation.
//         </p>
//         <p className="about-description">
//           The goal is to create visually pleasing, smooth animations that you can <span className="highlight">customize in real-time</span> — colors, sizes, and speed.
//         </p>
//       </section>

//       <section className="about-features">
//         <h2 className="key">Key Features</h2>
//         <div className="feature-cards">
//           <div className="feature-card">
//             <h3>Interactive Animations</h3>
//             <p>Click any animation card to see it in action with real-time customization.</p>
//           </div>
//           <div className="feature-card">
//             <h3>50+ Animations</h3>
//             <p>From waves to pendulums, particles to gradients — a collection of mesmerizing effects.</p>
//           </div>
//           <div className="feature-card">
//             <h3>Fully Customizable</h3>
//             <p>Adjust colors, size, and speed to create your own satisfying animation experience.</p>
//           </div>
//         </div>
//       </section>

//       {/* <section className="about-skills">
//         <h2 className="">Tech Stack & Animation Skills</h2>
//         <div className="skill-bars">
//           <div className="skill">
//             <p>React</p>
//             <div className="skill-bar"><div className="skill-progress react"></div></div>
//           </div>
//           <div className="skill">
//             <p>CSS Animations</p>
//             <div className="skill-bar"><div className="skill-progress css"></div></div>
//           </div>
//           <div className="skill">
//             <p>JavaScript</p>
//             <div className="skill-bar"><div className="skill-progress js"></div></div>
//           </div>
//         </div>
//       </section>

//       <section className="about-cta">
//         <button className="gallery-button" onClick={() => navigate("/gallery")}>
//           Explore Gallery
//         </button>
//       </section> */}
//        <div className="bubbles">
//                     <img src="src/assets/bubble.png" />
//                     <img src="src/assets/bubble.png" />
//                     <img src="src/assets/bubble.png" />
//                     <img src="src/assets/bubble.png" />
//                     <img src="src/assets/bubble.png" />
//                     <img src="src/assets/bubble.png" />
//                     <img src="src/assets/bubble.png" />
//                 </div>
//     </main>
//   );
// };

// export default About;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";
import { FaSpa, FaGamepad, FaPalette, FaHeart } from "react-icons/fa";
import { GiSparkles, GiMagicSwirl } from "react-icons/gi";
import { IoChevronBack } from "react-icons/io5";

const About = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FaSpa className="feature-icon" />, title: "Relax", desc: "Unwind with calming visuals." },
    { icon: <GiSparkles className="feature-icon" />, title: "Create", desc: "Generate unique animations." },
    { icon: <FaGamepad className="feature-icon" />, title: "Play", desc: "A space for joyful discovery." },
    { icon: <FaPalette className="feature-icon" />, title: "Customize", desc: "Adjust colors, speed & mood." },
    { icon: <GiMagicSwirl className="feature-icon" />, title: "Explore", desc: "Try endless combinations." },
    { icon: <FaHeart className="feature-icon" />, title: "Favorite", desc: "Save animations you love." },
  ];
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <IoChevronBack className="back-icon" onClick={() => navigate("/")}/>
        <h2>About Us</h2>
      </div>

      {/* Title & Description */}
      <section className="about-section">
        {/* <h1>About Us</h1> */}
        <p>
          Welcome to your digital playground for relaxation and creativity. Our app is designed
          to generate soothing, satisfying animations that spark joy and inspire a moment of calm
          in your busy day. Explore, create, and find your moment of zen.
        </p>
      </section>

      {/* ✅ Auto-generating feature cards */}
      <div className="feature-grid">
        {features.map((item, index) => (
          <div className="feature-card" key={index}>
            {item.icon}
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="gallery-button" onClick={() => navigate("/gallery")}>
           Explore Gallery
         </button>
    </div>
  );
};

export default About;

