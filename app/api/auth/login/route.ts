import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email e senha são obrigatórios." }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado." }), { status: 404 });
    }

    if (!user.verified) {
      return new Response(JSON.stringify({ error: "Conta não verificada. Verifique seu e-mail." }), { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: "Senha incorreta." }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies(); // ✅ correto aqui
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
      sameSite: "strict",
    });

    return new Response(JSON.stringify({ message: "Login efetuado com sucesso." }), { status: 200 });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erro no servidor: " + error.message }), { status: 500 });
  }
}
