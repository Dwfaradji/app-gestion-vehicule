// /lib/api.ts
export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erreur serveur");
  }
  return res.json();
}
