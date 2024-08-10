"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleCheckoutClick = () => {
    router.push("/checkout");
  };

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center text-center bg-cover bg-center bg-fixed p-4"
      style={{ backgroundImage: 'url("/hero.jpg")' }}
    >
      <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold mb-4 text-white">
          Participe do Congresso Louvor 2024
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-300">
          Venha participar de um evento incrível onde a música, adoração e
          ensinamentos se encontram para proporcionar uma experiência única de
          louvor e crescimento espiritual.
        </p>
        <button
          onClick={handleCheckoutClick}
          className="bg-green-600 hover:bg-green-700 text-sm md:text-base font-bold py-3 px-6 rounded inline-block text-white"
        >
          Quero comprar meu ingresso
        </button>
      </div>
    </section>
  );
}
