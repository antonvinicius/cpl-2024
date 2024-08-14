import { MercadoPagoConfig, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import moment from "moment-timezone";

export async function POST(req: Request) {
  try {
    const { name, email, cpf, dob, church } = await req.json();

    if (!name || !email || !cpf || !dob || !church) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 },
      );
    }

    const idempotencyKey = uuidv4();
    const token = process.env.MERCADO_PAGO_TOKEN;
    if (!token) {
      console.error("Token de acesso não está disponível.");
      return NextResponse.json(
        { error: "Token de acesso não está disponível." },
        { status: 500 },
      );
    }

    const client = new MercadoPagoConfig({
      accessToken: token,
      options: { timeout: 5000, idempotencyKey },
    });
    const payment = new Payment(client);

    const now = moment.utc();
    const expirationDate = now.add(1, "minute");
    const formattedExpirationDate = expirationDate.format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );

    const body: PaymentCreateRequest = {
      transaction_amount: 0.05,
      description: `Ingresso de ${name} para Congresso Louvor 2024`,
      payment_method_id: "pix",
      payer: {
        email: email,
        identification: {
          type: "CPF",
          number: cpf,
        },
        first_name: name.split(" ")[0],
        last_name: name.split(" ")[1],
      },
      notification_url: process.env.NOTIFICATION_URL_WEBHOOK,
      // date_of_expiration: formattedExpirationDate,
      external_reference: "ID_REF",
    };

    const requestOptions = {
      idempotencyKey,
    };

    const response = await payment.create({ body, requestOptions });

    return NextResponse.json(
      {
        qr_code_base64:
          response.point_of_interaction?.transaction_data?.qr_code_base64,
        qr_code: response.point_of_interaction?.transaction_data?.qr_code,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento." },
      { status: 500 },
    );
  }
}
