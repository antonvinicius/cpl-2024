"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();

  const handleCheckoutClick = () => {
    router.push("/checkout");
  };

  const handleMyTicketsClick = () => {
    router.push("/my-tickets");
  };

  return (
    <section
      className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen bg-cover bg-center bg-fixed p-8 lg:p-16"
      style={{
        backgroundImage: 'url("/hero.jpg")',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
        paddingTop: "5rem",
      }}
    >
      {/* Coluna da Imagem */}
      <div className="w-full lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0 order-1 lg:order-2">
        <motion.img
          src="/banner.png"
          className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          alt="Banner"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Coluna de Texto e Botões */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0 lg:pr-8 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold mb-4 text-white">
            Viva a Experiência do Congresso Presbiteriano de Louvor 2024
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4 lg:mb-8">
            Junte-se a nós para um evento transformador de adoração e
            crescimento espiritual. Garanta seu lugar agora!
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center lg:justify-start">
            <motion.button
              onClick={handleCheckoutClick}
              className="bg-[#dd5b33] hover:bg-[#c94f2d] text-white text-sm md:text-base font-bold py-3 px-6 rounded transition-transform duration-300 transform hover:scale-105"
            >
              Comprar Ingresso
            </motion.button>
            <motion.button
              onClick={handleMyTicketsClick}
              className="border border-[#dd5b33] text-[#dd5b33] hover:bg-[#dd5b33] hover:text-white text-sm md:text-base font-bold py-3 px-6 rounded transition-transform duration-300 transform hover:scale-105"
            >
              Já tenho um ingresso
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
