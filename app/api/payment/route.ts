import { MercadoPagoConfig, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import moment from "moment-timezone";
import { supabase } from "../supabase/client";
import { AppError } from "../AppError";

export async function POST(req: Request) {
  try {
    const { name, email, cpf, dob, church } = await req.json();

    if (!name || !email || !cpf || !dob || !church) {
      throw new AppError("Todos os campos são obrigatórios.", 400);
    }

    const nameParts = name.split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    const cpfClean = cpf.replace(/\./g, "").replace(/-/g, "");
    const amount = 0.07;

    const filter = await supabase
      .from("tickets")
      .select("*")
      .eq("payer_cpf", cpfClean)
      .single();

    if (filter.data != null && filter.error) {
      console.error(filter.error);
      throw new AppError(
        "Servidores offline. Tente novamente mais tarde.",
        500,
      );
    }

    if (filter.data && filter.data.payment_status === "approved") {
      throw new AppError("Você já possui um ingresso comprado neste CPF.", 400);
    }

    const ticket_db = filter.data;

    const idempotencyKey = uuidv4();
    const token = process.env.MERCADO_PAGO_TOKEN;
    if (!token) {
      console.error("Token de acesso não está disponível.");
      throw new AppError("Token de acesso não está disponível.", 500);
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

    if (!ticket_db) {
      const addOperation = await supabase
        .from("tickets")
        .insert([
          {
            church,
            payer_cpf: cpfClean,
            payer_dob: dob,
            payer_email: email,
            payer_name: name,
            payment_amount: amount,
          },
        ])
        .select();

      if (addOperation.error) {
        console.error(addOperation.error);
        throw new AppError(
          "Não foi possível salvar o ticket no banco de dados.",
          500,
        );
      }

      console.log("Ticket adicionado com sucesso.");
    } else {
      const dbResponse = await supabase
        .from("tickets")
        .update({
          church,
          payer_dob: dob,
          payer_email: email,
          payer_name: name,
          payment_amount: amount,
        })
        .eq("payer_cpf", cpfClean)
        .select();

      if (dbResponse.error) {
        console.error(dbResponse.error);
        throw new AppError(
          "Não foi possível salvar o ticket no banco de dados.",
          500,
        );
      }
    }

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

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Erro desconhecido. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
