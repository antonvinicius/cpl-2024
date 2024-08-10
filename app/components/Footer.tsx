import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6 flex justify-center items-center text-center">
      <div>
        <p className="text-gray-400 text-sm">
          © 2024 Congresso Louvor. Todos os direitos reservados.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Contato: <a href="tel:+5511999999999" className="hover:text-white">+55 (11) 99999-9999</a> | 
          Email: <a href="mailto:contato@congressolouvor.com" className="hover:text-white">contato@congressolouvor.com</a>
        </p>
      </div>
    </footer>
  );
}
