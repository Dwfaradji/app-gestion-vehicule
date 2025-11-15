import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// 1️⃣ Étendre les types NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      mustChangePassword?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    mustChangePassword?: boolean;
  }

  interface JWT {
    id?: string;
    role?: string;
    mustChangePassword?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
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

        // 3️⃣ Retourner un objet qui correspond exactement à User étendu
        return {
          id: user.id.toString(),
          name: user.name ?? "",
          email: user.email,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Lors du login initial
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
        return token;
      }
      // À CHAQUE requête : on rafraîchit depuis la base
      const dbUser = await prisma.user.findUnique({
        where: { id: Number(token.id) },
        select: { id: true, role: true, mustChangePassword: true },
      });

      if (dbUser) {
        token.role = dbUser.role;
        token.mustChangePassword = dbUser.mustChangePassword;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id!,
          role: token.role!,
          mustChangePassword: token.mustChangePassword!,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
