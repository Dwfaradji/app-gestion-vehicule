import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// verification que le mot de passe et email enregistrer dans la base de données ne sont pas identiques
export async function GET() {
  try {
    const adminEmail = process.env.USER_ADMIN;

    if (!adminEmail) {
      console.error("USER_ADMIN environment variable is not set");
      return new Response(JSON.stringify({ admin: null }), { status: 500 });
    }

    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
      return new Response(JSON.stringify({ admin: null }), { status: 200 });
    }

    const defaultPassword = process.env.MDP_ADMIN;
    let isDefaultPassword = false;

    if (defaultPassword) {
      // We check if the current password hash matches the default password
      // This handles the "undefined" error by ensuring defaultPassword is truthy
      isDefaultPassword = await bcrypt.compare(defaultPassword, admin.passwordHash);
    } else {
      console.warn("MDP_ADMIN environment variable is not set, cannot verify default password");
    }

    return new Response(JSON.stringify({ admin, isDefaultPassword }), { status: 200 });
  } catch (err) {
    console.error("Error in admin check route:", err);
    if (err instanceof Error) {
      return new Response(JSON.stringify({ admin: null }), { status: 500 });
    }
    return new Response(JSON.stringify({ admin: null }), { status: 500 });
  }
}
