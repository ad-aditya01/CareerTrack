import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            const response = await api.post("/auth/login", {
                email: email,
                password: password
            });

            console.log("Login response:", response.data);

            // Store JWT token
            localStorage.setItem("token", response.data.token);

            console.log("JWT stored successfully");

            setMessage("Login successful!");

            // Navigate to Dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            if (error.response) {
                setMessage(
                    error.response.data?.message ||
                    "Invalid email or password"
                );
            } else {
                setMessage("Unable to connect to server");
            }
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>CareerTrack</h1>

                <p className="login-subtitle">
                    Track your career journey
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    <button type="submit">
                        Login
                    </button>

                    {message && (
                        <p>{message}</p>
                    )}

                </form>

            </div>

        </div>
    );
}

export default Login;