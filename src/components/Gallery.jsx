import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";
import Animation from "../components/Animation";
import { animationData } from "../data/animationConfig.js"; // 50 animations ka data
import "./Gallery.css";

const Gallery = () => {
    const [selectedAnimation, setSelectedAnimation] = useState("fractalLaserGrid");
    const [color, setColor] = useState("#ef8bf4");
    const [size, setSize] = useState(50);
    const [speed, setSpeed] = useState(0.01);

    const navigate = useNavigate();

    return (
        <div className="gallery-container">
            {/* <div className="logo" onClick={() => navigate("/")}>
                <h2>MeloMotion</h2>
            </div> */}
            <Animation
                type={selectedAnimation}
                color={color}
                size={size}
                speed={speed}
            />

        </div>
    );
};

export default Gallery;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { animationData } from "../data/animationConfig";
// import "./Gallery.css";

// const Gallery = () => {
//     const navigate = useNavigate();

//     return (
//         <div className="gallery-screen">
//             <div className="gallery-header">
//                 <h2>My Animations</h2>
//                 <button className="add-btn">+</button>
//             </div>

//             <div className="animation-grid">
//                 {animationData.map((anim) => (
//                     <div
//                         key={anim.id}
//                         className="anim-card"
//                         style={{ backgroundImage: `url(${anim.thumbnail})` }}
//                         onClick={() => navigate(`/animation/${anim.id}`)}
//                     >
//                         <img src={anim.image} alt="" />
//                         <div className="anim-title">{anim.name}</div>
//                     </div>
//                 ))}
//             </div>

//             <div className="bottom-nav">
//                 <button onClick={() => navigate("/")} className="nav-item">Home</button>
//                 <button className="nav-item active">Animations</button>
//                 <button onClick={() => navigate("/profile")} className="nav-item">Profile</button>
//             </div>
//         </div>
//     );
// };

// export default Gallery;

