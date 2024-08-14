import { NextResponse } from "next/server";
import { validateWebhook } from "./validateWebhook";

export async function POST(req: Request) {
  const body = await req.json();

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

  return NextResponse.json(
    {
      hello: "world",
    },
    { status: 200 },
  );
}
