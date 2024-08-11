"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import TicketList from "./components/TicketList";
import LoginPage from "./LoginPage";

export default function TicketsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Lógica fictícia de autenticação
    const user = localStorage.getItem("user"); // Aqui, pode ser usada qualquer lógica de verificação de login
    if (user === "admin") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <AdminLayout>
      <TicketList />
    </AdminLayout>
  );
}
