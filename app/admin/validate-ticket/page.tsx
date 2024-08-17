"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import QrReader from "react-qr-scanner";
import { supabase } from "../../supabase-front/client";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

export default function ValidateTicketPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null); // Estado para determinar se o ticket é válido ou não
  const router = useRouter();

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

  const handleStartCamera = () => {
    setCameraStarted(true);
    setQrResult(null);
    setErrorMessage("");
    setValidationMessage("");
    setIsValid(null); // Resetar a validação
  };

  const handleScan = (data: any) => {
    if (data) {
      const cpf = data.text.trim(); // Captura o CPF do QR Code
      setQrResult(cpf);
      handleValidQrCode(cpf);
      setCameraStarted(false);
    }
  };

  const handleError = (err: any) => {
    setErrorMessage("Erro ao acessar a câmera. Verifique as permissões.");
    console.error(err);
  };

  const handleValidQrCode = async (cpf: string) => {
    try {
      const { data: ticket, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("payer_cpf", cpf)
        .eq("payment_status", "approved")
        .single();

      if (error || !ticket) {
        setValidationMessage("Ticket inválido ou pagamento não aprovado.");
        setIsValid(false);
      } else {
        setValidationMessage("Ticket válido! Acesso permitido.");
        setIsValid(true);
      }
    } catch (error) {
      console.error("Erro ao validar o QR Code:", error);
      setValidationMessage("Erro ao validar o QR Code.");
      setIsValid(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Ou pode exibir um carregamento
  }

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Validar Ingresso
          </h1>
          {!cameraStarted && !qrResult && (
            <button
              onClick={handleStartCamera}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Iniciar Câmera
            </button>
          )}
          {cameraStarted && (
            <div className="w-full h-64">
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%", height: "100%" }}
                constraints={{
                  video: {
                    facingMode: { ideal: "environment" },
                  },
                }}
              />
            </div>
          )}
          {errorMessage && (
            <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
          )}
          {qrResult && (
            <div className="mt-4 text-center">
              <p className="text-xl font-semibold">CPF: {qrResult}</p>
              <div className="mt-4 flex flex-col items-center">
                {isValid !== null && (
                  <>
                    {isValid ? (
                      <CheckCircleIcon className="w-16 h-16 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-16 h-16 text-red-500" />
                    )}
                    <p
                      className={`mt-2 text-lg ${
                        isValid ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {validationMessage}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={handleStartCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded w-full"
              >
                Resetar e Ler Outro
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
