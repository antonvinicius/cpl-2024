"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="md:hidden p-4">
        <button onClick={toggleSidebar}>
          <Bars3Icon className="h-8 w-8 text-white" />
        </button>
      </div>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={closeSidebar}
        ></div>
      )}
      <div className={`flex-grow p-6 ${sidebarOpen ? "hidden md:block" : "block"}`}>
        {children}
      </div>
    </div>
  );
}
