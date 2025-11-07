// import { compare } from "bcryptjs";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthOptions, DefaultSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
//
// // Étendre le type Session et JWT pour inclure id, role et name
// declare module "next-auth" {
//     interface Session {
//         user: {
//             id: string;
//             role: string;
//             name: string;
//         } & DefaultSession["user"];
//     }
//
//     interface JWT {
//         id?: string;
//         role?: string;
//         name?: string;
//     }
// }
//
// export const authOptions: NextAuthOptions = {
//     session: { strategy: "jwt" },
//     pages: {
//         signIn: "/login",
//     },
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Mot de passe", type: "password" },
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     throw new Error("Email et mot de passe requis");
//                 }
//
//                 const user = await prisma.user.findUnique({ where: { email: credentials.email } });
//                 if (!user) throw new Error("Utilisateur introuvable");
//
//                 if (user.status !== "APPROVED") {
//                     throw new Error("Votre compte n'est pas encore approuvé par un administrateur.");
//                 }
//
//                 const ok = await compare(credentials.password, user.passwordHash);
//                 if (!ok) throw new Error("Mot de passe ou identifiant incorrect");
//
//                 return {
//                     id: String(user.id),
//                     email: user.email,
//                     name: user.name ?? "",
//                     role: user.role,
//                 };
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//                 token.role = user.role;
//                 token.name = user.name; // 🔹 ajouter name dans le token
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             return {
//                 ...session,
//                 user: {
//                     ...session.user,
//                     id: token.id ?? "",
//                     role: token.role ?? "",
//                     name: token.name ?? "", // 🔹 inclure name dans la session
//                 },
//             };
//         },
//     },
// };