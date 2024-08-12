"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import heroImage from "/public/hero.jpg"; // Caminho da imagem hero.jpg
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    dob: "",
    church: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cpf: "",
    dob: "",
    church: "",
  });

  const handleCancelClick = () => {
    router.push("/");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, "");
    // Adiciona a máscara
    const maskedValue = cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setFormData({ ...formData, [id]: maskedValue });
  };

  const validateCPF = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
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
    const newErrors = {
      name: "",
      email: "",
      cpf: "",
      dob: "",
      church: "",
    };

    // Validação do nome
    if (!formData.name) {
      newErrors.name = "Campo obrigatório";
    } else if (formData.name.split(" ").length < 2) {
      newErrors.name = "Você deve informar um sobrenome";
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Campo obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validação do CPF
    if (!formData.cpf) {
      newErrors.cpf = "Campo obrigatório";
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    // Validação da data de nascimento
    if (!formData.dob) {
      newErrors.dob = "Campo obrigatório";
    } else if (isNaN(Date.parse(formData.dob))) {
      newErrors.dob = "Data de nascimento inválida";
    }

    // Validação da igreja
    if (!formData.church) {
      newErrors.church = "Selecione uma igreja";
    }

    setErrors(newErrors);

    // Verifica se há algum erro
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Se o formulário for válido, prossiga com o envio
      toast.success("Campos validados com sucesso!", {
        position: "top-center",
      });
    } else {
      // Caso contrário, exiba os erros
      toast.error("Por favor, corrija os erros no formulário", {
        position: "top-center",
      });
    }
  };

  return (
    <>
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
                <p className="text-xl font-bold text-gray-100">
                  Total: R$ 99,00
                </p>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="w-full md:w-1/2 bg-gray-900 p-6">
              <h2 className="text-xl font-bold mb-6">Detalhes do Pagamento</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2" htmlFor="name">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-2" htmlFor="cpf">
                    CPF
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleCpfChange}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm mt-2">{errors.cpf}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-2" htmlFor="dob">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    id="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-2">{errors.dob}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-2" htmlFor="church">
                    Igreja
                  </label>
                  <select
                    id="church"
                    value={formData.church}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                  >
                    <option value="">Selecione sua igreja</option>
                    <option value="igreja1">Igreja 1</option>
                    <option value="igreja2">Igreja 2</option>
                    <option value="igreja3">Igreja 3</option>
                  </select>
                  {errors.church && (
                    <p className="text-red-500 text-sm mt-2">{errors.church}</p>
                  )}
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
      <ToastContainer />
    </>
  );
}
