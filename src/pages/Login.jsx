import React, { useState } from "react";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="login-page">
            <div className="logo-box">
                <div className="logo-circle"></div>
                <h1 className="logo-text">MeloMotion</h1>
            </div>

            <div className="login-card">
                <h1>Welcome Back</h1>

                <label className="label">Email</label>
                <div className="input-box">
                    <FaEnvelope className="icon" />
                    <input type="email" placeholder="Enter your email" />
                </div>

                <label className="label">Password</label>
                <div className="input-box">
                    <FaLock className="icon" />
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                    />
                    <AiOutlineEye
                        className="eye-icon"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                    />
                </div>

                <a href="#" className="forgot">Forgot Password?</a>

                <button className="login-btn">Login</button>

                <p className="signup-text">
                    Don't have an account? <a href="#">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
