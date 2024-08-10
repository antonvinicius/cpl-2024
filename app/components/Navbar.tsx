import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold truncate">
          Congresso Louvor 2024
        </h1>
        <div className="flex-shrink-0">
          <a
            href="#ingresso"
            className="bg-orange-500 hover:bg-orange-600 text-xs md:text-sm lg:text-base font-bold py-2 px-3 lg:px-4 rounded whitespace-nowrap"
          >
            Quero comprar meu ingresso
          </a>
        </div>
      </div>
    </nav>
  );
}
