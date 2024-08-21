import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6 flex justify-center items-center text-center">
      <div>
        <p className="text-gray-400 text-sm">
          © 2024 Congresso Louvor. Todos os direitos reservados.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Contato:{" "}
          <a href="tel:+5569999240900" className="hover:text-white">
            +55 (69) 99924-0900
          </a>{" "}
          | Email:{" "}
          <a
            href="mailto:brenontenorio@yahoo.com.br"
            className="hover:text-white"
          >
            brenontenorio@yahoo.com.br
          </a>
        </p>
      </div>
    </footer>
  );
}
