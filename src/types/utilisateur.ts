export interface Utilisateur {
  id: number;
  name: string;
  fonction: string;
  password: string;
  role: "ADMIN" | "USER";
  email: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  mustChangePassword?: boolean;
}
