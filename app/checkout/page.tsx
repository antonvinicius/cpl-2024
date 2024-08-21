"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import heroImage from "/public/banner.png";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../supabase-front/client";

const EXPIRATION_PIX_TIME = 900; // 15 minutos

type Church = {
  id: number;
  church_name: string;
  has_discount: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [churches, setChurches] = useState<Church[]>([]);
  const [amount, setAmount] = useState(75);
  const [discount, setDiscount] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    dob: "",
    church: "",
    consent: false, // Adicionado campo para o consentimento
  });

  const [payer_cpf, setPayer_cpf] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cpf: "",
    dob: "",
    church: "",
    consent: "", // Adicionado erro para o consentimento
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false); // Novo estado para controlar o loading no total
  const [timeLeft, setTimeLeft] = useState(EXPIRATION_PIX_TIME);
  const [transactionData, setTransactionData] = useState<{
    qr_code_base64: string;
    qr_code: string;
  } | null>(null);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      const calculateTimeLeft = () => {
        const elapsedTime = Math.floor(
          (Date.now() - startTimeRef.current!) / 1000,
        );
        setTimeLeft(EXPIRATION_PIX_TIME - elapsedTime);

        if (EXPIRATION_PIX_TIME - elapsedTime <= 0) {
          handleCloseModal();
          toast.error(
            "O tempo para pagamento expirou. Por favor, gere um novo PIX.",
            {
              position: "top-center",
            },
          );
        }
      };

      timerRef.current = window.setInterval(calculateTimeLeft, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isModalOpen]);

  const handleCancelClick = () => {
    router.push("/");
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value, type } = e.target;

    // Verifique se o e.target é um HTMLInputElement para acessar 'checked'
    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      setFormData({
        ...formData,
        [id]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }

    if (id === "church") {
      if (!value) return;
      setIsLoadingTotal(true);

      const { data: churches_db, error: churchesError } = await supabase
        .from("churches")
        .select("id")
        .eq("has_discount", true);

      if (churchesError) {
        console.error("Erro ao buscar igrejas:", churchesError);
        return;
      }

      const churchIds = churches_db.map((church) => church.id);

      const { count, error: ticketsError } = await supabase
        .from("tickets")
        .select("id", { count: "exact" })
        .in("church_id", churchIds)
        .eq("payment_status", "approved");

      if (ticketsError) {
        console.error("Erro ao buscar tickets:", ticketsError);
        return;
      }

      if (count < parseInt(process.env.NEXT_PUBLIC_DISCOUNT_LIMIT)) {
        const church = churches.find((ch) => ch.id === parseInt(value));
        if (church?.has_discount) {
          setDiscount(25);
        } else {
          setDiscount(0);
        }
      } else {
        setDiscount(0);
      }

      setIsLoadingTotal(false);
      toast.success("Valores atualizados com sucesso!", {
        position: "top-center",
      });
    }
  };

  const fetchChurches = async () => {
    const { data: churches } = await supabase.from("churches").select("*");
    setChurches(churches);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const cleanValue = value.replace(/\D/g, "");
    const maskedValue = cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setFormData({ ...formData, [id]: maskedValue });
  };

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
    const newErrors = {
      name: "",
      email: "",
      cpf: "",
      dob: "",
      church: "",
      consent: "", // Inicializar erro de consentimento
    };

    if (!formData.name) {
      newErrors.name = "Campo obrigatório";
    } else if (formData.name.split(" ").length < 2) {
      newErrors.name = "Você deve informar um sobrenome";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Campo obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.cpf) {
      newErrors.cpf = "Campo obrigatório";
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.dob) {
      newErrors.dob = "Campo obrigatório";
    } else if (isNaN(Date.parse(formData.dob))) {
      newErrors.dob = "Data de nascimento inválida";
    }

    if (!formData.church) {
      newErrors.church = "Selecione uma igreja";
    }

    if (!formData.consent) {
      newErrors.consent =
        "Você deve aceitar os Termos de Uso e Política de Privacidade";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error);
        }

        const data = await response.json();
        setTransactionData(data);
        setIsModalOpen(true);
        setTimeLeft(EXPIRATION_PIX_TIME);
        toast.success("Pagamento gerado com sucesso!", {
          position: "top-center",
        });
        setPayer_cpf(formData.cpf.replace(/\./g, "").replace(/-/g, ""));
      } catch (error) {
        toast.error(error.message, {
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Por favor, corrija os erros no formulário", {
        position: "top-center",
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (transactionData?.qr_code) {
      navigator.clipboard.writeText(transactionData.qr_code);
      toast.success("Código copiado para a área de transferência!", {
        position: "top-center",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const subscription = supabase
      .channel("payment_channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tickets" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const { new: ticket } = payload;
            if (
              ticket.payment_status === "approved" &&
              ticket.payer_cpf === payer_cpf
            ) {
              handleCloseModal();
              toast.success(
                "Pagamento recebido com sucesso! Redirecionando...",
                {
                  position: "top-center",
                  autoClose: 2000,
                },
              );
              localStorage.setItem("payer_cpf", payer_cpf);
              setTimeout(() => {
                router.push(`/my-tickets`);
              }, 2000);
            }
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [payer_cpf]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const { data: ticket, error } = await supabase
          .from("tickets")
          .select("*")
          .eq("payer_cpf", payer_cpf)
          .eq("payment_status", "approved")
          .single();

        if (ticket && !error) {
          handleCloseModal();
          toast.success("Pagamento recebido com sucesso! Redirecionando...", {
            position: "top-center",
            autoClose: 2000,
          });
          localStorage.setItem("payer_cpf", payer_cpf);
          setTimeout(() => {
            router.push(`/my-tickets`);
          }, 2000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [payer_cpf]);

  useEffect(() => {
    fetchChurches();
  }, []);

  return (
    <>
      <div className="relative min-h-screen flex justify-center items-center py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-green-800 animate-gradientMove z-0"></div>
        <div className="relative z-10 text-white flex justify-center items-center">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  CPL 2024
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
            </div>

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
                    {churches.map((church) => (
                      <option key={church.id} value={church.id}>
                        {church.church_name}
                      </option>
                    ))}
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

                <div className="mb-6 p-4 rounded bg-gray-700">
                  {isLoadingTotal ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 11-8 8V12H4z"
                        ></path>
                      </svg>
                      <span className="ml-2">Atualizando valores...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-400">
                        Subtotal:{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(amount)}
                      </p>
                      {discount > 0 && (
                        <p className="text-gray-400">
                          Desconto: -
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(discount)}
                        </p>
                      )}
                      <p className="text-xl font-bold text-white">
                        Total:{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(amount - discount)}
                      </p>
                    </>
                  )}
                </div>

                {/* Novo campo de consentimento */}
                <div className="mb-6">
                  <label className="block text-gray-400">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Eu concordo com os{" "}
                    <a
                      href="/termos-de-uso"
                      target="_blank"
                      className="underline text-blue-400 hover:text-blue-600"
                    >
                      Termos de Uso
                    </a>{" "}
                    e a{" "}
                    <a
                      href="/politica-de-privacidade"
                      target="_blank"
                      className="underline text-blue-400 hover:text-blue-600"
                    >
                      Política de Privacidade
                    </a>
                  </label>
                  {errors.consent && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <button
                  disabled={isLoadingTotal || isLoading}
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-4"
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 11-8 8V12H4z"
                        ></path>
                      </svg>
                      Processando...
                    </div>
                  ) : (
                    "Finalizar Pagamento"
                  )}
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

      {isModalOpen && transactionData && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg text-center transform transition-opacity duration-1000 ${isModalOpen ? "opacity-100" : "opacity-0"}`}
          >
            <h2 className="text-2xl font-bold mb-4">Finalize seu pagamento</h2>
            <p className="mb-4">
              Termine de pagar seu ingresso pagando com pix escaneando o QR Code
              ou clique no botão para pagar com copia e cola
            </p>
            <div className="mb-4">
              <Image
                src={`data:image/png;base64,${transactionData.qr_code_base64}`}
                alt="QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <button
              onClick={handleCopyToClipboard}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mb-4"
            >
              Pagar com Copia e Cola
            </button>
            <p className="text-red-600 font-bold mb-4">
              Tempo até expirar: {formatTime(timeLeft)}
            </p>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              Fechar
            </button>
          </div>
        </motion.div>
      )}

      <ToastContainer />
    </>
  );
}
