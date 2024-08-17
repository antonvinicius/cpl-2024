import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const USER = process.env.ADMIN_USER;  // Usuário definido
const PASSWORD = process.env.ADMIN_PASSWORD;  // Senha definida
const SECRET = process.env.ADMIN_SECRET;  // Secret forte para gerar o token

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === USER && password === PASSWORD) {
    const token = jwt.sign({ username }, SECRET);
    return NextResponse.json({ token }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
}
