import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Login.css";
import assets from "../../assets/assets";

const Login = () => {
    const navigate = useNavigate();

    const [currState, setCurrState] = useState("Sign up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (currState === "Sign up") {

                const res = await axios.post(
                    "https://chat-app-2qez.onrender.com/api/auth/register",
                    {
                        name,
                        email,
                        password
                    }
                );

                alert(
                    res.data.message || "Registration Successful"
                );

                setCurrState("Login");
                setName("");
                setEmail("");
                setPassword("");
            }

            else {

                const res = await axios.post(
                    "https://chat-app-2qez.onrender.com/api/auth/login",
                    {
                        email,
                        password
                    }
                );

                alert("Login Successful");

                localStorage.setItem(
                    "token",
                    res.data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.user)
                );

                navigate("/chat");
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="login">

            <div className="login-container">

                <div className="login-left">

                    <img
                        src={assets.logo_icon}
                        alt="ChatApp"
                        className="login-logo-icon"
                    />

                    <h1>ChatApp</h1>

                    <p>Connect. Chat. Share.</p>

                </div>


                <div className="login-right">

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        <h2>
                            {currState === "Sign up"
                                ? "Create your account"
                                : "Welcome back"}
                        </h2>

                        <p className="form-subtitle">
                            {currState === "Sign up"
                                ? "Sign up to start chatting with your friends"
                                : "Login to continue chatting with your friends"}
                        </p>

                        {currState === "Sign up" && (
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="form-input"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        )}

                        <input
                            type="email"
                            placeholder="Email address"
                            className="form-input"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="form-input"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="submit"
                            className="login-button"
                        >
                            {currState === "Sign up"
                                ? "Sign Up"
                                : "Login"}
                        </button>

                        <div className="login-term">

                            <input
                                type="checkbox"
                                required
                            />

                            <p>
                                Agree to the terms of use &
                                privacy policy
                            </p>

                        </div>

                        <div className="or-divider">

                            <span></span>

                            <p>OR</p>

                            <span></span>

                        </div>

                        <div className="login-forget">

                            {currState === "Sign up" ? (

                                <p className="login-toggle">

                                    Already have an account?{" "}

                                    <span
                                        onClick={() =>
                                            setCurrState("Login")
                                        }
                                    >
                                        Login
                                    </span>

                                </p>

                            ) : (

                                <p className="login-toggle">

                                    Don't have an account?{" "}

                                    <span
                                        onClick={() =>
                                            setCurrState("Sign up")
                                        }
                                    >
                                        Sign Up
                                    </span>
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;