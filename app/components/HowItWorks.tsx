import React from 'react';
import { CreditCardIcon, EnvelopeIcon, TicketIcon } from "@heroicons/react/24/solid";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-800 p-8">
      <div className="container mx-auto px-4 md:px-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white">Como Funciona</h3>
        <div className="flex flex-col md:flex-row justify-around">
          <div className="mb-8 md:mb-0 md:w-1/3 px-4">
            <CreditCardIcon className="w-16 h-16 mx-auto text-green-500" />
            <h4 className="text-xl font-bold mt-4 text-white">Você compra o ingresso</h4>
            <p className="text-gray-300 mt-2">
              Selecione e compre seu ingresso de forma rápida e segura.
            </p>
          </div>
          <div className="mb-8 md:mb-0 md:w-1/3 px-4">
            <EnvelopeIcon className="w-16 h-16 mx-auto text-green-500" />
            <h4 className="text-xl font-bold mt-4 text-white">Recebe o comprovante via email</h4>
            <p className="text-gray-300 mt-2">
              Após a compra, você receberá o comprovante diretamente no seu email.
            </p>
          </div>
          <div className="md:w-1/3 px-4">
            <TicketIcon className="w-16 h-16 mx-auto text-green-500" />
            <h4 className="text-xl font-bold mt-4 text-white">Apresenta o comprovante no evento</h4>
            <p className="text-gray-300 mt-2">
              Mostre o comprovante na entrada do evento para ter acesso ao congresso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
