import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            // Autoriser uniquement les admins à accéder à /admin
            if (token?.role === "ADMIN") return true;
            return false;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
});

export const config = {
    matcher: ["/admin/:path*"], // Protège toutes les routes admin/**
};