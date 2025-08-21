export interface Utilisateur {
    id: number;
    name: string;
    fonction: string;
    date: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}