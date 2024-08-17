import { NextResponse } from "next/server";
import { supabase } from "../supabase/client";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const { cpf } = await request.json();

    if (!cpf) {
      return NextResponse.json({ error: "CPF não fornecido" }, { status: 400 });
    }

    // Buscar o ticket correspondente ao CPF
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("*")
      .eq("payer_cpf", cpf)
      .eq("payment_status", "approved")
      .maybeSingle();

    if (ticketError) {
      return NextResponse.json(
        { error: "Erro ao buscar o ticket" },
        { status: 500 },
      );
    }

    if (!ticket) {
      return NextResponse.json(
        { message: "Nenhum ticket encontrado para o CPF fornecido" },
        { status: 404 },
      );
    }

    // Buscar o nome da igreja correspondente ao church_id
    const { data: church, error: churchError } = await supabase
      .from("churches")
      .select("church_name")
      .eq("id", ticket.church_id)
      .single();

    if (churchError) {
      return NextResponse.json(
        { error: "Erro ao buscar a igreja" },
        { status: 500 },
      );
    }

    if (!church) {
      return NextResponse.json(
        { message: "Nenhuma igreja encontrada para o ID fornecido" },
        { status: 404 },
      );
    }

    // Gerar QR Code dinâmico baseado no CPF do pagador
    const qrCode = await QRCode.toDataURL(cpf);

    // Retornar os dados necessários
    return NextResponse.json(
      {
        payer_name: ticket.payer_name,
        church_name: church.church_name,
        qr_code: qrCode,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
