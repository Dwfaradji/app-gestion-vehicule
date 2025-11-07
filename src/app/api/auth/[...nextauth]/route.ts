import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Étendre le type Session et JWT
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            name: string;
            mustChangePassword: boolean;
        } & DefaultSession["user"];
    }

    interface JWT {
        id?: string;
        role?: string;
        name?: string;
        mustChangePassword?: boolean;
    }
}

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    pages: { signIn: "/admin/login" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) return null;

                const valid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!valid) return null;

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name ?? "",
                    role: user.role,
                    mustChangePassword: user.mustChangePassword,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Au login, on initialise toutes les valeurs
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.role = user.role;
                token.mustChangePassword = token.mustChangePassword ?? false;
            }

            return token;
        },
        async session({ session, token }) {
            // Toujours remplir session.user avec les valeurs du token
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    role: token.role,
                    mustChangePassword: token.mustChangePassword,
                },
            };
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };