

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("../generated/prisma");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const maintenanceParams = require("../data/maintenanceParams").default;

const prisma = new PrismaClient();

console.log(maintenanceParams)
async function main() {
    for (const param of maintenanceParams) {
        await prisma.entretienParam.upsert({
            where: { id: param.id },
            update: {
                type: param.type,
                category: param.category,
                subCategory: param.subCategory,
                seuilKm: param.seuilKm,
                alertKmBefore: param.alertKmBefore,
                description: param.description,
                applicableTo: param.applicableTo ? JSON.stringify(param.applicableTo) : null,
            },
            create: {
                id: param.id,
                type: param.type,
                category: param.category,
                subCategory: param.subCategory,
                seuilKm: param.seuilKm,
                alertKmBefore: param.alertKmBefore,
                description: param.description,
                applicableTo: param.applicableTo ? JSON.stringify(param.applicableTo) : null,
            },
        });
    }
    console.log("Paramètres de maintenance importés avec succès !");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

// POUR EXPORTER LES DONNEES DE PARAMETRAGE D'ENTRETIEN VERS LA DB
//EXECUTER CMD => // npx ts-node src/scripts/importMaintenanceParams.ts