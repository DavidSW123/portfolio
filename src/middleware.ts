import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production-32chars"
);

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth"];
const ROLE_PATHS: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/provider": ["ADMIN", "PROVIDER"],
  "/collaborator": ["ADMIN", "COLLABORATOR"],
  "/client": ["ADMIN", "CLIENT"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.public.blob.vercel-storage.com https://*.blob.vercel-storage.com https://vercel.com",
    ].join("; ") + ";",
  );

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return response;
  }

  // Allow public car catalog
  if (pathname === "/catalog" || pathname.startsWith("/catalog/")) {
    return response;
  }

  // Static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/uploads") || pathname.includes(".")) {
    return response;
  }

  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const userRole = payload.role as string;

    // Check role-based access
    for (const [pathPrefix, allowedRoles] of Object.entries(ROLE_PATHS)) {
      if (pathname.startsWith(pathPrefix) && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // API route protection
    if (pathname.startsWith("/api/admin") && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (
      pathname.startsWith("/api/cars/approve") &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return response;
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("auth-token");
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
