import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/dashboard"];
const ADMIN_UPDATE_ROUTE = "/admin/update";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: false,
  });

  const isAuthenticated = !!session;
  const role = session?.role;
  const mustChangePassword = session?.mustChangePassword;

  const matches = (routes: string[]) =>
    routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // ----------------------------------------------------
  // 1️⃣ ADMIN → redirection si /login utilisé
  // ----------------------------------------------------
  if (pathname.startsWith("/login") && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ----------------------------------------------------
  // 2️⃣ USER → empêche accès à /admin
  // ----------------------------------------------------
  if (pathname.startsWith("/admin") && role === "USER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ----------------------------------------------------
  // 3️⃣ ADMIN → mustChangePassword : accès exclusif à /admin/update
  // ----------------------------------------------------
  if (isAuthenticated && role === "ADMIN" && mustChangePassword) {
    if (pathname !== ADMIN_UPDATE_ROUTE) {
      return NextResponse.redirect(new URL(ADMIN_UPDATE_ROUTE, req.url));
    }
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 4️⃣ /admin → accessible seulement si NON connecté
  // ----------------------------------------------------
  if (pathname === "/admin") {
    if (isAuthenticated && role === "ADMIN") {
      // admin connecté → pas d’accès à /admin
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (isAuthenticated && role === "USER") {
      // user → jamais accès admin
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next(); // admin NON connecté → OK
  }

  // ----------------------------------------------------
  // 5️⃣ Routes protégées user/admin (dashboard)
  // ----------------------------------------------------
  if (matches(PROTECTED_ROUTES) && !isAuthenticated) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("callbackUrl", pathname, { path: "/", httpOnly: true });
    return res;
  }

  // ----------------------------------------------------
  // 6️⃣ Utilisateur connecté → empêche retour sur login/register
  // ----------------------------------------------------
  if (isAuthenticated && ["/login", "/register"].includes(pathname)) {
    const redirectUrl = req.cookies.get("callbackUrl")?.value;
    const finalUrl = redirectUrl || (role === "ADMIN" ? "/dashboard" : "/dashboard");

    const res = NextResponse.redirect(new URL(finalUrl, req.url));
    res.cookies.delete("callbackUrl");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
