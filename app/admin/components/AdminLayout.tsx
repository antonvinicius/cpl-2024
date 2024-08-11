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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Botão do menu hambúrguer no mobile */}
        <div className="p-4">
          <button onClick={toggleSidebar}>
            <Bars3Icon className="h-8 w-8 text-white" />
          </button>
        </div>

        {/* Sidebar para mobile */}
        <div
          className={`fixed z-40 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } top-0 left-0 w-64 h-full bg-gray-800`}
        >
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Overlay para fechar a sidebar no mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black opacity-50"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Conteúdo principal no mobile */}
        <div className="p-6">{children}</div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Sidebar para desktop */}
        <div className="w-64 bg-gray-800">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Conteúdo principal no desktop */}
        <div className="flex-grow p-6 max-w-screen-xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
