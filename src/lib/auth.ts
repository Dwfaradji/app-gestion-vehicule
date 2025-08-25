import { PrismaClient } from "@/generated/prisma";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis");
                }

                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) throw new Error("Utilisateur introuvable");



                // Bloque si pas approuvé
                if (user.status !== "APPROVED") {
                    throw new Error("Votre compte n'est pas encore approuvé par un administrateur.");
                }

                const ok = await compare(credentials.password, user.passwordHash);
                if (!ok) throw new Error("Mot de passe ou identifiant incorrect");

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name ?? undefined,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
};