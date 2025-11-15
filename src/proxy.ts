// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";
//
// const PROTECTED_ROUTES = ["/dashboard"];
// const ADMIN_UPDATE_ROUTE = "/admin/update";
//
// export async function proxy(req: NextRequest) {
//     const { pathname } = req.nextUrl;
//
//     // ✅ Lecture sécurisée du token NextAuth
//     const session = await getToken({
//         req,
//         secret: process.env.NEXTAUTH_SECRET,
//         secureCookie: process.env.NODE_ENV === "production",
//     });
//
//     const isAuthenticated = !!session;
//     const userRole = session?.role;
//     const mustChangePassword = session?.mustChangePassword;
//
//     const matches = (routes: string[]) =>
//         routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
//
//
//     // Si admin essaye de se connecter sur la page login il sera rediriger vers auth /admin
//     if(pathname === "/login" && userRole === "ADMIN"){
//         return NextResponse.redirect(new URL("/admin", req.url));
//     }
//
//
//
//     // ✅ 1️⃣ Si ADMIN avec mustChangePassword = true : accès exclusif à /admin/update
//     if (isAuthenticated && userRole === "ADMIN" && mustChangePassword) {
//         if (pathname !== ADMIN_UPDATE_ROUTE) {
//             return NextResponse.redirect(new URL(ADMIN_UPDATE_ROUTE, req.url));
//         }
//         return NextResponse.next();
//     }
//
//     // 🔒 2️⃣ /admin : seulement pour visiteurs non connectés
//     if (pathname.startsWith("/admin") && pathname !== ADMIN_UPDATE_ROUTE) {
//         if (isAuthenticated) {
//             return NextResponse.redirect(new URL("/dashboard", req.url));
//         }
//         return NextResponse.next();
//     }
//
//
//     // 3 Si ADMIN avec mustChangePassword = False : redirection vers /dashboard
//
//     if (isAuthenticated && userRole === "ADMIN" && mustChangePassword) {
//         if (pathname == "/admin") {
//             return NextResponse.redirect(new URL("/dashboard", req.url));
//         }
//         return NextResponse.next();
//     }
//
//
//     // 🔒 3️⃣ Routes protégées classiques (dashboard)
//     if (matches(PROTECTED_ROUTES) && !isAuthenticated) {
//         const res = NextResponse.redirect(new URL("/login", req.url));
//         res.cookies.set("callbackUrl", pathname, { path: "/", httpOnly: true });
//         return res;
//     }
//
//     // 🔄 4️⃣ Empêcher les connectés d’aller sur /login ou /register
//     if (isAuthenticated && ["/login", "/register"].includes(pathname)) {
//         const redirectUrl = req.cookies.get("callbackUrl")?.value;
//         const res = NextResponse.redirect(
//             new URL(redirectUrl || (userRole === "ADMIN" ? ADMIN_UPDATE_ROUTE: "/dashboard"), req.url)
//         );
//         res.cookies.delete("callbackUrl");
//         return res;
//     }
//
//     // ✅ 5️⃣ Tout le reste passe
//     return NextResponse.next();
// }
//
// // Matcher toutes les pages sauf fichiers statiques
// export const config = {
//     matcher: [
//         "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
//     ],
// };

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
    secureCookie: process.env.NODE_ENV === "production",
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
