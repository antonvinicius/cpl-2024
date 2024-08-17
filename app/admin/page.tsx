"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import TicketList from "./components/TicketList";

export default function TicketsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const response = await fetch('/api/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
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
    validateToken()
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
