import {
  CreditCardIcon,
  EnvelopeIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-bold truncate">
            Congresso Louvor 2024
          </h1>
          <div className="flex-shrink-0">
            <a
              href="#ingresso"
              className="bg-orange-500 hover:bg-orange-600 text-xs md:text-sm lg:text-base font-bold py-2 px-3 lg:px-4 rounded whitespace-nowrap"
            >
              Quero comprar meu ingresso
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col-reverse md:flex-row items-center py-16 px-4 md:px-8">
        <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0 md:mr-10">
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold mb-4 leading-tight">
            Participe do Congresso Louvor 2024
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed">
            Venha participar de um evento incrível onde a música, adoração e
            ensinamentos se encontram para proporcionar uma experiência única
            de louvor e crescimento espiritual.
          </p>
          <a
            href="#ingresso"
            className="bg-green-600 hover:bg-green-700 text-sm md:text-base font-bold py-3 px-6 rounded inline-block"
          >
            Quero comprar meu ingresso
          </a>
        </div>
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img
            src="/hero.jpg"
            alt="Imagem do Congresso"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-800 py-12">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl md:text-3xl mb-8">
            Como Funciona
          </h3>
          <div className="flex flex-col md:flex-row justify-around">
            <div className="mb-8 md:mb-0 md:w-1/3 px-4">
              <CreditCardIcon className="w-16 h-16 mx-auto text-green-500" />
              <h4 className="text-xl font-bold mt-4">Você compra o ingresso</h4>
              <p className="text-gray-300 mt-2">
                Selecione e compre seu ingresso de forma rápida e segura.
              </p>
            </div>
            <div className="mb-8 md:mb-0 md:w-1/3 px-4">
              <EnvelopeIcon className="w-16 h-16 mx-auto text-green-500" />
              <h4 className="text-xl font-bold mt-4">Recebe o comprovante via email</h4>
              <p className="text-gray-300 mt-2">
                Após a compra, você receberá o comprovante diretamente no seu email.
              </p>
            </div>
            <div className="md:w-1/3 px-4">
              <TicketIcon className="w-16 h-16 mx-auto text-green-500" />
              <h4 className="text-xl font-bold mt-4">Apresenta o comprovante no evento</h4>
              <p className="text-gray-300 mt-2">
                Mostre o comprovante na entrada do evento para ter acesso ao congresso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
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
                Contato: <a href="tel:+5511999999999" className="hover:text-white">+55 (11) 99999-9999</a> | 
                Email: <a href="mailto:contato@congressolouvor.com" className="hover:text-white">contato@congressolouvor.com</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

