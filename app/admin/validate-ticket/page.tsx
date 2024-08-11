"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import QrReader from "react-qr-scanner";

export default function ValidateTicketPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === "admin") {
      setIsLoggedIn(true);
    } else {
      router.push("/admin/login"); // Redireciona para a página de login se não estiver autenticado
    }
  }, [router]);

  const handleStartCamera = () => {
    setCameraStarted(true);
    setQrResult(null);
    setErrorMessage("");
  };

  const handleScan = (data) => {
    if (data) {
      setQrResult(data.text);
      handleValidQrCode(data.text);
      setCameraStarted(false);
    }
  };

  const handleError = (err) => {
    setErrorMessage("Erro ao acessar a câmera. Verifique as permissões.");
    console.error(err);
  };

  const handleValidQrCode = (data) => {
    console.log("QR Code válido:", data);
  };

  if (!isLoggedIn) {
    return null; // Ou pode exibir um carregamento
  }

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Validar Ingresso</h1>
        {!cameraStarted && !qrResult && (
          <button
            onClick={handleStartCamera}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Iniciar Câmera
          </button>
        )}
        {cameraStarted && (
          <div className="w-full h-screen">
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
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {qrResult && (
          <>
            <p className="text-green-500 mt-4">QR Code lido: {qrResult}</p>
            <button
              onClick={handleStartCamera}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
            >
              Resetar e Ler Outro
            </button>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
