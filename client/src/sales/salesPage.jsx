// src/Sales/SalesPage.jsx
import { useState } from "react";
import BillingPage from "./BillingPage.jsx";
import SalesReportPage from "./SalesReportPage.jsx";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("billing");
  const username = localStorage.getItem("username") || "User";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">HeavySync</h2>
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setActiveTab("billing")}
            className={`p-2 rounded text-left w-full ${
              activeTab === "billing" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab("salesReport")}
            className={`p-2 rounded text-left w-full ${
              activeTab === "salesReport" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            Sales Report
          </button>
        </nav>
        <div className="mt-auto">
          <p className="mb-2">Logged in as: {username}</p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-600 p-2 rounded hover:bg-red-700 w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "billing" && <BillingPage />}
        {activeTab === "salesReport" && <SalesReportPage />}
      </main>
    </div>
  );
}
