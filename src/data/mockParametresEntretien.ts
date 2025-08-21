// data/mockParametresEntretien.ts
export interface EntretienParam {
    type: string;
    seuilKm: number;
}

export const mockParametresEntretien: EntretienParam[] = [
    { type: "Freins", seuilKm: 15000 },
    { type: "Vidange", seuilKm: 10000 },
    { type: "CT", seuilKm: 0 },
];