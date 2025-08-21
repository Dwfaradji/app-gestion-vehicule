import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role?: "ADMIN" | "USER"; // ajoute le type de ton rôle
        } & DefaultSession["user"];
    }

    interface User {
        role?: "ADMIN" | "USER";
    }
}