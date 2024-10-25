import Image from "next/image";
import heroImage from "/public/banner.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  return (
    <>
      <div className="relative min-h-screen flex justify-center items-center py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-green-800 animate-gradientMove z-0"></div>
        <div className="relative z-10 text-white flex justify-center items-center">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
            <div className="w-full p-6 flex flex-col justify-center">
              <div>
                <div className="w-full flex justify-center">
                  <Image
                    src={heroImage}
                    width={500}
                    alt="Congresso Louvor 2024"
                    className="rounded-lg mb-4"
                  />
                </div>
                <p className="text-gray-300 mb-4">
                  🎟️ Ingressos Esgotados! 🎟️ Agradecemos a todos pelo enorme
                  interesse! Informamos que os ingressos para o evento estão
                  encerrados. Todos os ingressos foram vendidos e não há mais
                  disponibilidade. Continue nos acompanhando para ficar por
                  dentro de futuras edições e outras novidades. Esperamos ver
                  você em um próximo evento!
                </p>
                <p className="text-gray-300 mb-4">
                  Local do evento: 4ª Igreja Presbiteriana de Ji-Paraná
                </p>
                <p className="text-gray-300 mb-4">Data do evento: 02/11/2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
