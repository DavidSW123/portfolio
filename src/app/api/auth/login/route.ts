import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromDb, verifyPassword, createToken, createAuditLog } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

  const limit = rateLimit(`login:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const { email, password } = result.data;
  const user = await getUserFromDb(email);

  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const token = await createToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "ADMIN" | "PROVIDER" | "COLLABORATOR" | "CLIENT",
    image: user.image,
  });

  await createAuditLog(user.id, "LOGIN", "User", user.id, "Login exitoso", ip);

  const redirectMap: Record<string, string> = {
    ADMIN: "/admin",
    PROVIDER: "/provider",
    COLLABORATOR: "/collaborator",
    CLIENT: "/client",
  };

  const response = NextResponse.json({
    success: true,
    redirect: redirectMap[user.role] || "/client",
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
