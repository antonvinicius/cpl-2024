"use client";

import React from "react";
import { CreditCardIcon, EnvelopeIcon, TicketIcon } from "@heroicons/react/24/solid";
import { motion, useInView } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
    },
  }),
};

export default function HowItWorks() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const items = [
    {
      icon: CreditCardIcon,
      title: "Você compra o ingresso",
      description: "Selecione e compre seu ingresso de forma rápida e segura.",
    },
    {
      icon: EnvelopeIcon,
      title: "Recebe o comprovante via email",
      description: "Após a compra, você receberá o comprovante diretamente no seu email.",
    },
    {
      icon: TicketIcon,
      title: "Apresenta o comprovante no evento",
      description: "Mostre o comprovante na entrada do evento para ter acesso ao congresso.",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-800 p-8"
    >
      <div className="container mx-auto px-4 md:px-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white">Como Funciona</h3>
        <div className="flex flex-col md:flex-row justify-around">
          {items.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={itemVariants}
              className="mb-8 md:mb-0 md:w-1/3 px-4 shadow-lg hover:shadow-2xl rounded-lg"
            >
              <item.icon className="w-16 h-16 mx-auto text-green-500" />
              <h4 className="text-xl font-bold mt-4 text-white">{item.title}</h4>
              <p className="text-gray-300 mt-2">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
