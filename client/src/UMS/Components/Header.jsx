import React from "react";
import { useTheme } from "../Components/ThemeContext.jsx";
import { useLocation } from "wouter";

function Header({ goToMyProfile, onLogout, onBack, username }) {
  const { toggleTheme, theme } = useTheme();
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/"); // fallback to home/login page
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-black shadow-lg text-white flex items-center px-8 py-4 h-16 justify-between font-sans">
      <div className="font-extrabold text-3xl tracking-wide">HeavySync</div>
      <div className="flex items-center gap-6">
        <button
          onClick={() => {
            if (typeof goToMyProfile === "function") {
              goToMyProfile();
            } else {
              // navigate with a random query param to force re-render
              navigate(`/myprofile?ts=${Date.now()}`);
            }
          }}
          className="w-10 h-10 rounded-full bg-gray-700 flex justify-center items-center text-2xl cursor-pointer select-none border-0 p-0 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="User Icon"
        >
          <div>👤</div>
        </button>
        <button
          onClick={onLogout}
          className="text-white bg-transparent border border-transparent cursor-pointer text-lg px-4 py-2 font-semibold rounded-md hover:bg-gray-700 hover:border-gray-700 transition duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Logout
        </button>
        <button
          onClick={handleBack}
          className="bg-transparent border border-white px-5 py-2 rounded-md text-white cursor-pointer font-semibold hover:bg-white hover:text-indigo-900 transition duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Back
        </button>
      </div>
    </header>
  );
}

export default Header;