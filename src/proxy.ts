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
//     /**
//      * 🔒 1. Si ADMIN avec mustChangePassword = true :
//      * 👉 Bloqué partout sauf sur /admin/update
//      */
//     if (isAuthenticated && userRole === "ADMIN" && mustChangePassword) {
//         if (pathname !== ADMIN_UPDATE_ROUTE) {
//             return NextResponse.redirect(new URL(ADMIN_UPDATE_ROUTE, req.url));
//         }
//         // Autorisé uniquement sur /admin/update
//         return NextResponse.next();
//     }
//
//     /**
//      * 🔒 2. Accès réservé à /admin/update :
//      * - Si non connecté → /login
//      * - Si pas admin → /dashboard
//      */
//     if (pathname.startsWith(ADMIN_UPDATE_ROUTE)) {
//         if (!isAuthenticated) {
//             return NextResponse.redirect(new URL("/login", req.url));
//         }
//         if (userRole !== "ADMIN") {
//             return NextResponse.redirect(new URL("/dashboard", req.url));
//         }
//         return NextResponse.next();
//     }
//
//     /**
//      * 🔒 3. Routes protégées (dashboard)
//      */
//     if (matches(PROTECTED_ROUTES) && !isAuthenticated) {
//         const res = NextResponse.redirect(new URL("/login", req.url));
//         res.cookies.set("callbackUrl", pathname, { path: "/", httpOnly: true });
//         return res;
//     }
//
//     /**
//      * 🔄 4. Empêcher les connectés d’aller sur /login ou /register
//      */
//     if (isAuthenticated && ["/login", "/register"].includes(pathname)) {
//         const redirectUrl = req.cookies.get("callbackUrl")?.value;
//         const res = NextResponse.redirect(
//             new URL(redirectUrl || (userRole === "ADMIN" ? "/admin" : "/dashboard"), req.url)
//         );
//         res.cookies.delete("callbackUrl");
//         return res;
//     }
//
//     /**
//      * 🟢 5. /admin est public, mais si connecté et non-admin → redirection
//      */
//     if (pathname.startsWith("/admin") && pathname !== ADMIN_UPDATE_ROUTE) {
//         if (isAuthenticated && userRole !== "ADMIN") {
//             return NextResponse.redirect(new URL("/dashboard", req.url));
//         }
//     }
//
//     // ✅ 6. Tout le reste passe
//     return NextResponse.next();
// }
//
// // ✅ Matcher toutes les pages sauf fichiers statiques
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

    // ✅ Lecture sécurisée du token NextAuth
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production",
    });

    const isAuthenticated = !!session;
    const userRole = session?.role;
    const mustChangePassword = session?.mustChangePassword;

    const matches = (routes: string[]) =>
        routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

    // 🔒 1️⃣ /admin : seulement pour visiteurs non connectés
    if (pathname.startsWith("/admin") && pathname !== ADMIN_UPDATE_ROUTE) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    // 🔒 2️⃣ /admin/update : admin avec mustChangePassword = true
    if (pathname.startsWith(ADMIN_UPDATE_ROUTE)) {
        if (!isAuthenticated) return NextResponse.redirect(new URL("/login", req.url));
        if (userRole !== "ADMIN" || !mustChangePassword)
            return NextResponse.redirect(new URL("/dashboard", req.url));
        return NextResponse.next();
    }

    // 🔒 3️⃣ Routes protégées classiques (dashboard)
    if (matches(PROTECTED_ROUTES) && !isAuthenticated) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.set("callbackUrl", pathname, { path: "/", httpOnly: true });
        return res;
    }

    // 🔄 4️⃣ Empêcher les connectés d’aller sur /login ou /register
    if (isAuthenticated && ["/login", "/register"].includes(pathname)) {
        const redirectUrl = req.cookies.get("callbackUrl")?.value;
        const res = NextResponse.redirect(
            new URL(redirectUrl || (userRole === "ADMIN" ? "/admin/update" : "/dashboard"), req.url)
        );
        res.cookies.delete("callbackUrl");
        return res;
    }

    // ✅ 5️⃣ Tout le reste passe
    return NextResponse.next();
}

// Matcher toutes les pages sauf fichiers statiques
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};