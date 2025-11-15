// app/test-session/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TestSession() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Test Session</h1>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Session côté serveur :</h2>
        <pre className="text-sm overflow-auto">{JSON.stringify(session, null, 2)}</pre>
      </div>

      {session ? (
        <div className="text-green-600 font-bold">
          ✅ Connecté en tant que : {session.user?.email}
        </div>
      ) : (
        <div className="text-red-600 font-bold">❌ Non connecté</div>
      )}
    </div>
  );
}
