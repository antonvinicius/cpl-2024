"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handlePurchaseClick = () => {
    router.push("/checkout");
  };

  const handleViewTicketsClick = () => {
    router.push("/my-tickets");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-green-700 bg-opacity-30 backdrop-blur-md text-white p-2 md:p-3 lg:p-4 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="cursor-pointer hover:opacity-80 transition duration-300">
          <Image
            src="/logo.png"
            alt="Congresso Louvor 2024"
            width={130} // Ajuste o tamanho da logo para ser menor em dispositivos móveis
            height={40} // Ajuste o tamanho da logo para ser menor em dispositivos móveis
          />
        </div>
        <div className="flex-shrink-0 md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
        <div className={`hidden md:flex md:items-center space-x-4`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePurchaseClick}
            className="bg-orange-500 hover:bg-orange-600 text-xs md:text-sm lg:text-base font-bold py-1 px-3 rounded-full shadow-lg transition-all duration-300"
          >
            Comprar Ingresso
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewTicketsClick}
            className="bg-teal-600 hover:bg-teal-700 text-xs md:text-sm lg:text-base font-bold py-1 px-3 rounded-full shadow-lg transition-all duration-300"
          >
            Meus Ingressos
          </motion.button>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ maxHeight: menuOpen ? "160px" : "0px" }}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out md:hidden"
      >
        <div className="flex flex-col items-start space-y-2 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePurchaseClick}
            className="w-full text-center bg-orange-500 hover:bg-orange-600 text-xs md:text-sm lg:text-base font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
          >
            Comprar Ingresso
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewTicketsClick}
            className="w-full text-center bg-teal-600 hover:bg-teal-700 text-xs md:text-sm lg:text-base font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
          >
            Meus Ingressos
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  );
}
