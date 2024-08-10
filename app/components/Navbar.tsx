"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handlePurchaseClick = () => {
    router.push("/checkout");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold truncate">
          Congresso Louvor 2024
        </h1>
        <div className="flex-shrink-0 md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
        <div className={`hidden md:flex md:items-center`}>
          <button
            onClick={handlePurchaseClick}
            className="bg-orange-500 hover:bg-orange-600 text-xs md:text-sm lg:text-base font-bold py-2 px-3 lg:px-4 rounded whitespace-nowrap"
          >
            Quero comprar meu ingresso
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out md:hidden ${
          menuOpen ? "max-h-40" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-start space-y-2">
          <button
            onClick={handlePurchaseClick}
            className="w-full mt-2 text-center bg-orange-500 hover:bg-orange-600 text-xs md:text-sm lg:text-base font-bold py-2 px-3 lg:px-4 rounded whitespace-nowrap"
          >
            Quero comprar meu ingresso
          </button>
          {/* Adicione outros itens de menu aqui se houver */}
        </div>
      </div>
    </nav>
  );
}
