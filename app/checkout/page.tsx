"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import heroImage from "/public/hero.jpg"; // Caminho da imagem hero.jpg

export default function CheckoutPage() {
  const router = useRouter();

  const handleCancelClick = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center py-12 px-4 overflow-hidden">
      {/* Fundo animado com tema dark e leves toques de verde */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-green-800 animate-gradientMove z-0"></div>
      <div className="relative z-10 text-white flex justify-center items-center ">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
          {/* Product Details Section */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                Congresso Louvor 2024
              </h1>
              <Image
                src={heroImage}
                alt="Congresso Louvor 2024"
                className="rounded-lg mb-4"
              />
              <p className="text-gray-300 mb-4">
                Participe de um evento único com muita música, adoração, e
                ensinamentos. Garanta seu ingresso e viva essa experiência de
                louvor e crescimento espiritual.
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-100">Total: R$ 99,00</p>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="w-full md:w-1/2 bg-gray-900 p-6">
            <h2 className="text-xl font-bold mb-6">Detalhes do Pagamento</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="name">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="cpf">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="dob">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  id="dob"
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="church">
                  Igreja
                </label>
                <select
                  id="church"
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                >
                  <option value="">Selecione sua igreja</option>
                  <option value="igreja1">Igreja 1</option>
                  <option value="igreja2">Igreja 2</option>
                  <option value="igreja3">Igreja 3</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 mb-2">
                  Forma de Pagamento
                </label>
                <div className="p-3 rounded bg-gray-800 border border-gray-600 text-white">
                  <p>PIX</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-4"
              >
                Finalizar Pagamento
              </button>

              <button
                type="button"
                onClick={handleCancelClick}
                className="w-full bg-red-400 hover:bg-red-500 text-white font-bold py-3 rounded-lg"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
