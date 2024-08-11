"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import TicketList from "./components/TicketList";

export default function TicketsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === "admin") {
      setIsLoggedIn(true);
    } else {
      router.push("/admin/login"); // Redireciona para a página de login se não estiver autenticado
    }
  }, [router]);

  if (!isLoggedIn) {
    return null; // Ou pode exibir um carregamento
  }

  return (
    <AdminLayout>
      <TicketList />
    </AdminLayout>
  );
}
