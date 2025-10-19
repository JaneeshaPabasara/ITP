import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";

// UI 
import { Toaster } from "./components/ui/toaster.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { ThemeProvider } from "./UMS/Components/ThemeContext.jsx";

// Pages
import Login from "./UMS/Login.jsx";
import AdminPanel from "./AdminPanel.jsx";
import MyProfile from "./UMS/MyProfile.jsx";
import NotFound from "./pages/not-found.jsx";
import VehicleAppointment from "./vehicleAppointment/frontEnd/vehicleAppointments/components/sideBar.jsx";
import Purchasing from "./purchasing/frontend/src/modules/supplier/pages/Dashboard.jsx";
import Cashier from "./sales/salesPage.jsx";
import Users from "./UMS/Users.jsx";
import CreateUser from "./UMS/CreateUser.jsx";
import ProfileOverview from "./UMS/ProfileOverview";

function AppWrapper() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);
  const navigate = useNavigate();

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    localStorage.setItem("role", role);
    // redirect handled inside Login.jsx
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    alert("You have been successfully logged out.");
    navigate("/login");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ThemeProvider>
          <Routes>
            {/* Login Page */}
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

            {/* Admin */}
            <Route
              path="/AdminPanel/*"
              element={
                userRole === "admin" ? (
                  <AdminPanel userId={localStorage.getItem("userId")} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Cashier */}
            <Route
              path="/Cashier"
              element={
                userRole === "Cashier" ? (
                  <Cashier userId={localStorage.getItem("userId")} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Purchasing */}
            <Route
              path="/purchasing"
              element={
                userRole === "Purchasing" ? (
                  <Purchasing userId={localStorage.getItem("userId")} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Vehicle */}
            <Route
              path="/vehicleAppointment"
              element={
                userRole === "Vehicle" ? (
                  <VehicleAppointment userId={localStorage.getItem("userId")} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Other users */}
            <Route
              path="/users"
              element={
                (userRole === "Other" || userRole === "R005") ? (
                  <Users userId={localStorage.getItem("userId")} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="/user/:id" element={<ProfileOverview onBack={() => navigate(-1)} onLogout={handleLogout} />} />

            {/* My Profile */}
            <Route
              path="/myprofile"
              element={
                userRole ? (
                  <MyProfile userId={localStorage.getItem("userId")} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="/createuser" element={<CreateUser onBack={() => navigate(-1)} onLogout={handleLogout} />} />

            {/* Default */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default AppWrapper;
