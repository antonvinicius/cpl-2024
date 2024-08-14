import { NextResponse } from "next/server";
import { validateWebhook } from "./validateWebhook";
import { MercadoPagoConfig, Payment } from "mercadopago";

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

  // TODO: Implementar a lógica para atualizar o ticket no banco de dados como pago
  const token = process.env.MERCADO_PAGO_TOKEN;
  const client = new MercadoPagoConfig({
    accessToken: token,
  });
  const payment = new Payment(client);

  const data = await payment.get({
    id: dataId,
  });

  console.log(`Pagamento status: ${data.status}`);

  return NextResponse.json(
    {
      hello: "world",
    },
    { status: 200 },
  );
}
