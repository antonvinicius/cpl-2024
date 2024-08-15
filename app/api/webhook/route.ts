import { NextResponse } from "next/server";
import { validateWebhook } from "./validateWebhook";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "../supabase/client";

export async function POST(req: Request) {
  const body = await req.json();

  const action = body.action;

  if (!action) {
    return NextResponse.json(
      {
        error: "Webhook não reconhecido.",
      },
      { status: 400 },
    );
  }

  const signature = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  const dataId = body.data.id;

  const isWebhookValid = validateWebhook({ signature, requestId, dataId });

  if (!isWebhookValid) {
    return NextResponse.json(
      {
        message: "Invalid Webhook",
      },
      { status: 400 },
    );
  }

  const token = process.env.MERCADO_PAGO_TOKEN;
  const client = new MercadoPagoConfig({
    accessToken: token,
  });
  const payment = new Payment(client);

  const data = await payment.get({
    id: dataId,
  });

  if (data.status == "approved") {
    const cpf = data.additional_info.payer.last_name;

    const dbResponse = await supabase
      .from("tickets")
      .update({ payment_status: "approved" })
      .eq("payer_cpf", cpf)
      .select();

    if (dbResponse.error) {
      console.error(`PAGAMENTO APROVADO ERRO [{${cpf}}]: ${dbResponse.error}`)
    }

    console.log("atualizado com sucesso approved");
  }

  return NextResponse.json(
    {
      hello: "world",
    },
    { status: 200 },
  );
}
