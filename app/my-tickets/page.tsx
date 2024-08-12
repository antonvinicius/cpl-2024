"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ticketDetails = {
  nome: "João da Silva",
  igreja: "Igreja Central",
  email: "joao.silva@example.com",
};

export default function MyTickets() {
  const [cpf, setCpf] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [errors, setErrors] = useState({ cpf: "", dob: "" });
  const router = useRouter();

  const validateCPF = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cleanCpf)) return false;

    const calculateDigit = (cpf: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < factor - 1; i++) {
        total += parseInt(cpf[i]) * (factor - i);
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const digit1 = calculateDigit(cleanCpf, 10);
    const digit2 = calculateDigit(cleanCpf, 11);

    return (
      digit1 === parseInt(cleanCpf[9]) && digit2 === parseInt(cleanCpf[10])
    );
  };

  const validateForm = () => {
    const newErrors = { cpf: "", dob: "" };

    if (!validateCPF(cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!dob) {
      newErrors.dob = "Data de nascimento inválida";
    } else if (isNaN(Date.parse(dob))) {
      newErrors.dob = "Data de nascimento inválida";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, "");
    const maskedValue = cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setCpf(maskedValue);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (cpf.replace(/\D/g, "") === "80283497068" && dob === "2000-01-01") {
        setTicket(ticketDetails);
      } else {
        setTicket(null);
      }
    }, 2000);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 text-white">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-stretch space-y-8 md:space-y-0 md:space-x-8">
        {/* Formulário */}
        <div className="flex-1 bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col justify-between">
          <form onSubmit={handleSearch}>
            <div>
              <h2 className="text-xl font-bold mb-6">Buscar Ingresso</h2>
              <div className="mb-4">
                <label
                  htmlFor="cpf"
                  className="block text-gray-400 mb-2 text-sm"
                >
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="text-red-500 text-sm mt-2">{errors.cpf}</p>
                )}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="dob"
                  className="block text-gray-400 mb-2 text-sm"
                >
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white text-sm"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-2">{errors.dob}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
              >
                {loading ? "Buscando..." : "Buscar Ingresso"}
              </button>
            </div>
          </form>
          <button
            onClick={handleBackToHome}
            className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg"
          >
            Voltar para a Página Principal
          </button>
        </div>

        {/* Detalhes do Ingresso */}
        <div className="flex-1 bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col justify-center">
          {loading ? (
            <p className="text-center text-gray-400 text-sm">Carregando...</p>
          ) : ticket ? (
            <div>
              <h2 className="text-xl font-bold mb-6">Detalhes do Ingresso</h2>
              <p className="text-sm mb-4">Nome: {ticket.nome}</p>
              <p className="text-sm mb-4">Igreja: {ticket.igreja}</p>
              <p className="text-sm mb-4">Email: {ticket.email}</p>
              <div className="flex justify-center mt-6">
                <Image
                  src="/qr-code.png"
                  width={200}
                  height={200}
                  alt="QR Code do Ingresso"
                />
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm">
              Nenhum ingresso encontrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
