import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (!token) {
                return NextResponse.redirect(new URL("/admin/login", req.url));
            }

            if (token.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            if (token.mustChangePassword && req.nextUrl.pathname !== "/admin/update") {
                return NextResponse.redirect(new URL("/admin/update", req.url));
            }
        }

        return NextResponse.next();
    },
    { callbacks: { authorized: () => true } }
);

export const config = {
    matcher: ["/admin/:path*"],
};