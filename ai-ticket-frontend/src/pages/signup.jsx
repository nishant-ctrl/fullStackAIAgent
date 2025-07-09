import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/api-client.js";
function Signup() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiClient.post("/auth/signup", form);
            if (response.status === 201) {
                localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.token)
                );
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                navigate("/");
            } else {
                alert("Signup failed");
            }
        } catch (error) {
            alert("Signup went wrong");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-sm shadow-xl bg-base-100">
                <form onSubmit={handleSignup} className="card-body">
                    <h2 className="card-title justify-center">Sign Up</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="input input-bordered"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input input-bordered"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-control mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
