import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="container mx-auto text-center md:text-left">
        <div className="md:flex md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2024 Congresso Louvor. Todos os direitos reservados.
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              Contato:{" "}
              <a
                href="tel:+5511999999999"
                className="hover:text-white"
              >
                +55 (11) 99999-9999
              </a>{" "}
              | Email:{" "}
              <a
                href="mailto:contato@congressolouvor.com"
                className="hover:text-white"
              >
                contato@congressolouvor.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
