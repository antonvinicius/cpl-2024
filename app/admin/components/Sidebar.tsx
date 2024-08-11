"use client";

import { useRouter } from "next/navigation";
import {
  HomeIcon,
  TicketIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/solid";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();

  const handleNavigation = (path) => {
    toggleSidebar(); // Fecha a sidebar ao navegar
    router.push(path);
  };

  const handleLogout = () => {
    toggleSidebar(); // Fecha a sidebar ao sair
    localStorage.setItem("user", "");
    router.push("/"); // Redireciona para a página principal
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 p-6 z-40 transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 md:w-64 md:min-h-screen`}
    >
      <div className="flex items-center mb-8">
        <HomeIcon className="h-8 w-8 text-white mr-2" />
        <span className="text-2xl font-bold">Admin Panel</span>
      </div>
      <nav className="space-y-4">
        <button
          onClick={() => handleNavigation("/admin")}
          className="flex items-center p-2 rounded bg-gray-700 hover:bg-gray-600 w-full text-left"
        >
          <TicketIcon className="h-5 w-5 text-white mr-3" />
          <span>Ingressos</span>
        </button>
        <button
          onClick={() => handleNavigation("/admin/validate-ticket")}
          className="flex items-center p-2 rounded bg-gray-700 hover:bg-gray-600 w-full text-left"
        >
          <TicketIcon className="h-5 w-5 text-white mr-3" />
          <span>Validar Ingresso</span>
        </button>
      </nav>
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded bg-gray-700 hover:bg-gray-600 w-full text-left"
        >
          <ArrowLeftCircleIcon className="h-5 w-5 text-white mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
