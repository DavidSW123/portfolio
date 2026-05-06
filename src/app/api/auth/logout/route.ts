import { NextRequest, NextResponse } from "next/server";

function buildLogoutResponse(req: NextRequest): NextResponse {
  const loginUrl = new URL("/login", req.url);
  const response = NextResponse.redirect(loginUrl, 303);
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function POST(req: NextRequest) {
  return buildLogoutResponse(req);
}

export async function GET(req: NextRequest) {
  return buildLogoutResponse(req);
}
