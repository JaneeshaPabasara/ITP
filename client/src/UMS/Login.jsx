import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login:", { email, password });

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200) {
        const { token, userId, user } = response.data;
        const role = user.role;

        console.log("Role from API:", role);
        console.log("User object:", user);

        // Store user data
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("email", user.email);

        // Update parent App state
        onLoginSuccess(role);

        console.log("🔁 Invoking role-based redirect...");
        switch (role) {
          case "admin":
            navigate("/AdminPanel");
            break;
          case "Cashier":
            navigate("/Cashier");
            break;
          case "Purchasing":
            navigate("/purchasing");
            break;
          case "Vehicle":
            navigate("/vehicleAppointment");
            break;
          case "Other":
            navigate("/users");
            break;
          default:
            navigate("/myProfile");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    }
  };

  // Helper for styling the error message
  const getMessageColor = () => {
    if (!error) return "";
    if (error.toLowerCase().includes("invalid") || error.toLowerCase().includes("error"))
      return "text-red-600 bg-red-100 border-red-300";
    if (error.toLowerCase().includes("success"))
      return "text-green-600 bg-green-100 border-green-300";
    return "text-gray-700 bg-gray-100 border-gray-300";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg max-w-md w-full p-10">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg mb-8 text-center">
          HeavySync
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl px-4 py-3 bg-white/70 placeholder-gray-500 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-50 transition duration-300 shadow-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl px-4 py-3 bg-white/70 placeholder-gray-500 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-50 transition duration-300 shadow-sm"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-red-500 via-orange-600 to-yellow-600 text-white font-semibold py-3 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-60"
          >
            Login
          </button>
        </form>
        {error && (
          <p
            className={`mt-6 p-3 rounded-lg border text-center font-semibold min-h-[1.5rem] ${getMessageColor()}`}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
