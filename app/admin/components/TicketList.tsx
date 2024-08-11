"use client";

import { useState } from "react";

export default function TicketList() {
  const [search, setSearch] = useState("");
  const tickets = [
    {
      nome: "João Silva",
      igreja: "Igreja A",
      cpf: "123.456.789-00",
      email: "joao@example.com",
    },
    {
      nome: "Maria Souza",
      igreja: "Igreja B",
      cpf: "987.654.321-00",
      email: "maria@example.com",
    },
    // Adicione mais ingressos conforme necessário
  ];

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.nome.toLowerCase().includes(search.toLowerCase()) ||
      ticket.igreja.toLowerCase().includes(search.toLowerCase()) ||
      ticket.cpf.includes(search) ||
      ticket.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Listagem de Ingressos</h1>
      <input
        type="text"
        placeholder="Buscar ingressos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-6 rounded bg-gray-800 text-white placeholder-gray-400"
      />
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-700 p-4 rounded-lg"
            >
              <div>
                <p className="font-bold">{ticket.nome}</p>
                <p className="text-sm text-gray-400">{ticket.igreja}</p>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <p className="text-sm text-gray-400">{ticket.cpf}</p>
                <p className="text-sm text-gray-400">{ticket.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Nenhum ingresso encontrado.</p>
        )}
      </div>
    </div>
  );
}
