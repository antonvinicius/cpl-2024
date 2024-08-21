"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import { Tables } from "../api/supabase/supabase";
import { supabase } from "../supabase-front/client";

type Ticket = Tables<"tickets">;
type Church = Tables<"churches">;

type TicketWithChurch = Ticket & {
  church: {
    church_name: string;
  };
};

export default function TicketList() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const [tickets, setTickets] = useState<TicketWithChurch[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchCpf, setSearchCpf] = useState<string>("");
  const [selectedChurch, setSelectedChurch] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Função para buscar os dados, usando useCallback para memoização
  const fetchData = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("tickets")
      .select("*, church:churches(church_name)", { count: "exact" })
      .order("payer_name");

    if (filterStatus) {
      query = query.eq("payment_status", filterStatus);
    }

    if (searchTerm) {
      query = query.ilike("payer_name", `%${searchTerm}%`);
    }

    if (searchCpf) {
      query = query.ilike("payer_cpf", `%${searchCpf}%`);
    }

    if (selectedChurch) {
      query = query.eq("church_id", selectedChurch);
    }

    query = query
      .order("payment_status", { ascending: true })
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

    const { data: tickets, count, error } = await query;
    const { data: churches } = await supabase.from("churches").select("*");

    if (!error) {
      setTickets(tickets || []);
      setTotalTickets(count || 0);
      setChurches(churches || []);
    }

    setLoading(false);
  }, [filterStatus, searchTerm, searchCpf, selectedChurch, currentPage]);

  useEffect(() => {
    const subscription = supabase
      .channel("payment_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        (payload) => {
          fetchData(); // Atualiza os dados mantendo os filtros atuais
        },
      )
      .subscribe();

    // Cleanup da subscrição
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reseta a página para 1 sempre que um filtro é alterado
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm, searchCpf, selectedChurch]);

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const response = await fetch("/api/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    if (data.valid) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    validateToken();
  }, [router]);

  if (!isLoggedIn) {
    return null; // Ou pode exibir um carregamento
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const translateStatus = (status: string) => {
    return status === "approved" ? "Aprovado" : "Pendente";
  };

  const totalPages = Math.ceil(totalTickets / itemsPerPage);

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-900 text-white">
        <div className="flex flex-col md:flex-row mb-4 gap-2">
          <input
            type="text"
            placeholder="Buscar por nome"
            className="input input-bordered bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por CPF"
            className="input input-bordered bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2"
            onChange={(e) => setSearchCpf(e.target.value)}
          />
          <select
            className="select select-bordered bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="approved">Aprovado</option>
            <option value="pending">Pendente</option>
          </select>
          <select
            className="select select-bordered bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2"
            onChange={(e) => setSelectedChurch(Number(e.target.value))}
          >
            <option value="">Todas as Igrejas</option>
            {churches.map((church) => (
              <option key={church.id} value={church.id}>
                {church.church_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p>Total de registros: {totalTickets}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-300">
                  <th className="py-2 px-4 border-b border-gray-700 truncate">
                    Nome
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700 truncate">
                    Email
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700 truncate">
                    CPF
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700 truncate">
                    Valor Pago
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700 truncate">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700 truncate">
                    Igreja
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600 transition-colors duration-200`}
                  >
                    <td className="py-2 px-4 border-b border-gray-700">
                      {ticket.payer_name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {ticket.payer_email}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {ticket.payer_cpf}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {formatCurrency(ticket.payment_amount)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.payment_status === "approved"
                            ? "bg-green-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {translateStatus(ticket.payment_status)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {ticket.church?.church_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center">
              <p>
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
