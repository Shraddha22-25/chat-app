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
                    name, email, password
                }
            );

            alert(res.data.message);setCurrState("Login");setName(""); setEmail("");setPassword("");
              } 
              else {

            const res = await axios.post(
                "https://chat-app-2qez.onrender.com/api/auth/login",
                {
                    email,
                    password
                }
            );

            alert(res.data.message);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/chat");
        }

    } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
    }
};

return (
    <div className="login">
        <img src={assets.logo_big} alt="" className="logo" />

        <form className="login-form" onSubmit={handleSubmit}>

            <h2>{currState}</h2>

            {currState === "Sign up" && (
                <input type="text" placeholder="Username" className="form-input" value={name}
                    onChange={(e) => setName(e.target.value)}required/>
            )}
            <input type="email" placeholder="Email address" className="form-input" value={email}
                onChange={(e) => setEmail(e.target.value)} required/>

              <input  type="password" placeholder="Password" className="form-input" value={password}
                onChange={(e) => setPassword(e.target.value)} required/>

            <button type="submit"> {currState === "Sign up"? "Create Account": "Login Now"}</button>

            <div className="login-term">
                <input type="checkbox" required />
                <p>Agree to the terms of use & privacy policy</p>
            </div>

            <div className="login-forget">
                {currState === "Sign up" ? (
                    <p className="login-toggle">
                        Already have an account?{" "}
                        <span onClick={() => setCurrState("Login")}>
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className="login-toggle">
                        Create an account{" "}
                        <span onClick={() => setCurrState("Sign up")}>
                            Click here
                        </span>
                    </p>
                )}
            </div>

        </form>
    </div>
);

};

export default Login;