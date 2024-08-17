import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.ADMIN_SECRET;  // Mesmo secret usado para criar o token

export async function POST(request: Request) {
  const { token } = await request.json();

  try {
    jwt.verify(token, SECRET);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
