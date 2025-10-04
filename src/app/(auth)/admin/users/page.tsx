
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {getServerSession} from "next-auth";

const prisma = new PrismaClient();

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        redirect("/auth/login");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    async function approveUser(id: number) {
        "use server";
        await prisma.user.update({ where: { id }, data: { status: "APPROVED" } });
    }

    async function rejectUser(id: number) {
        "use server";
        await prisma.user.update({ where: { id }, data: { status: "REJECTED" } });
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">Validation utilisateurs</h1>
            <table className="w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Nom</th>
                    <th className="px-4 py-2 text-left">Rôle</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id} className="border-t">
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.name ?? "-"}</td>
                        <td className="px-4 py-2">{u.role}</td>
                        <td className="px-4 py-2">{u.status}</td>
                        <td className="px-4 py-2 flex gap-2">
                            <form action={async () => approveUser(u.id)}>
                                <button className="px-3 py-1 rounded bg-green-600 text-white">
                                    Approuver
                                </button>
                            </form>
                            <form action={async () => rejectUser(u.id)}>
                                <button className="px-3 py-1 rounded bg-red-600 text-white">
                                    Rejeter
                                </button>
                            </form>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}