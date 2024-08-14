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

    const currentDate = moment().utc().add(15, "minute");

    const formattedExpirationDate = currentDate.format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );

    const nameParts = name.split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    const cpfClean = cpf.replace(/\./g, "").replace(/-/g, "");
    const amount = 0.03;

    const body: PaymentCreateRequest = {
      transaction_amount: amount,
      description: `Ingresso de ${name} para Congresso Louvor 2024`,
      payment_method_id: "pix",
      notification_url: process.env.NOTIFICATION_URL_WEBHOOK,
      date_of_expiration: formattedExpirationDate,
      additional_info: {
        payer: {
          first_name,
          last_name: cpfClean,
        },
        items: [
          {
            id: uuidv4(),
            quantity: 1,
            title: "Ingresso Congresso Louvor 2024",
            unit_price: amount,
            category_id: "default",
            description: "Ingresso Congresso Louvor 2024",
          },
        ],
      },
      payer: {
        email,
        entity_type: "individual",
        first_name,
        identification: { number: cpfClean, type: "CPF" },
        last_name,
        type: null,
      },
      external_reference: process.env.EXTERNAL_REFERENCE_MERCADO_PAGO,
      statement_descriptor: "Congresso Louvor 2024",
    };

    const requestOptions = {
      idempotencyKey,
    };

    const response = await payment.create({ body, requestOptions });

    // TODO: Salvar ticket no banco de dados

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
