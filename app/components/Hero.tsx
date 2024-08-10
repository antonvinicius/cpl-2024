"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const handlePurchaseClick = () => {
    router.push('/checkout');
  };

  return (
    <section className="container mx-auto flex flex-col-reverse md:flex-row items-center py-16 px-4 md:px-8">
      <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0 md:mr-10">
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold mb-4 leading-tight">
          Participe do Congresso Louvor 2024
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed">
          Venha participar de um evento incrível onde a música, adoração e
          ensinamentos se encontram para proporcionar uma experiência única
          de louvor e crescimento espiritual.
        </p>
        <button
          onClick={handlePurchaseClick}
          className="bg-green-600 hover:bg-green-700 text-sm md:text-base font-bold py-3 px-6 rounded inline-block"
        >
          Quero comprar meu ingresso
        </button>
      </div>
      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          src="/hero.jpg"
          alt="Imagem do Congresso"
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </div>
    </section>
  );
}
