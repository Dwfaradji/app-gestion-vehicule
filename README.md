# App Meca - Gestion de Véhicules

Application de gestion de flotte de véhicules développée avec Next.js, Prisma et TypeScript.

## 🚀 Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Langage**: TypeScript
- **Base de données**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Authentification**: NextAuth.js
- **UI**: Tailwind CSS / Lucide React
- **Tests**: Playwright

## 🛠️ Installation

1. **Cloner le projet**

```bash
git clone <votre-repo-url>
cd app-meca
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configuration de l'environnement**

Copiez le fichier `.env.example` (s'il existe) ou créez un fichier `.env` à la racine du projet avec les variables nécessaires (DATABASE_URL, NEXTAUTH_SECRET, etc.).

4. **Base de données**

Initialisez la base de données avec Prisma :

```bash
npx prisma migrate dev
```

## 📜 Scripts Utiles

Le projet contient plusieurs scripts utilitaires pour faciliter le développement et la gestion des données.

### Création d'un administrateur
Pour créer un compte administrateur par défaut :

```bash
npm run create-admin
```

### Nettoyage de la base de données
Pour vider toutes les tables de la base de données (⚠️ Attention : action irréversible) :

```bash
npm run clear-db
```

### Lancer le serveur de développement

```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 🧪 Tests

Le projet utilise Playwright pour les tests de bout en bout (E2E).

**Lancer tous les tests :**
```bash
npx playwright test
```

**Lancer un test spécifique :**
```bash
npx playwright test tests/e2e/nom-du-test.spec.ts
```

**Voir le rapport de test :**
```bash
npx playwright show-report
```

## 📂 Structure du Projet

- `src/app`: Pages et routes API (App Router)
- `src/components`: Composants React réutilisables
- `src/lib`: Utilitaires et configurations (Prisma, Auth, etc.)
- `src/types`: Définitions de types TypeScript
- `prisma`: Schéma de base de données et migrations
- `tests`: Tests E2E Playwright
- `scripts`: Scripts d'administration (création admin, nettoyage DB)

## 📝 Fonctionnalités Principales

- **Authentification** : Connexion sécurisée pour les administrateurs et utilisateurs.
- **Gestion des Véhicules** : Ajout, modification et suivi des véhicules.
- **Gestion des Conducteurs** : Attribution des véhicules aux conducteurs.
- **Suivi des Trajets** : Enregistrement et historique des trajets.
- **Administration** : Dashboard pour la gestion globale de la flotte.
