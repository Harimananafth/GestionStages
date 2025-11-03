# 🚀 Gestion Stages - Application de Gestion de Stages Étudiants

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

Une application web complète (monorepo) pour simplifier la gestion des candidatures de stages, connectant les administrateurs d'entreprise et les étudiants à la recherche d'opportunités.

---

## 📖 Sommaire

- [Structure du Monorepo](#-structure-du-monorepo)
- [Fonctionnalités Clés](#-fonctionnalités-clés)
- [Stack Technique](#-stack-technique)
- [Installation & Démarrage](#-installation--démarrage)
- [Configuration (Variables d'environnement)](#-configuration)

---

## 📂 Structure du Monorepo

Ce projet est un monorepo contenant les deux applications principales :

- `./backend` : L'API (Node.js / Express) gérant la logique métier, l'authentification et la communication avec la base de données.
- `./frontend` : L'application cliente (React) consommée par les étudiants et les administrateurs.

---

## ✨ Fonctionnalités Clés

### 👤 Espace Administrateur (Back-office)

- **Gestion des Offres :** Définir les périodes de stage (ex: Janvier - Juin 2025), les profils (ReactJS, Laravel, Technicien...) et le nombre de places.
- **Gestion des Candidatures :** Lister et filtrer les étudiants (par profil, date, niveau d'études).
- **Consultation Facile :** Visualiser ou télécharger les CV et lettres de motivation directement depuis l'interface.
- **Tableau de Bord :** Vue d'ensemble des nouvelles candidatures par profil.
- **Prise de Décision :** Valider, refuser ou mettre en attente une candidature.
- **Statistiques :** Suivi du nombre de candidatures (par an, par profil) et du taux d'acceptation/refus.

### 🎓 Espace Étudiant

- **Profil Complet :** Création et mise à jour du profil (infos personnelles et académiques).
- **Dépôt de Candidature :** Sélection d'une offre et upload de CV/Lettre de motivation (PDF).
- **Suivi en Temps Réel :** Visualisation du statut de la candidature (En attente / Accepté / Refusé).
- **Notifications :** Réception d'emails lors des changements de statut.

### 🔔 Notifications & Communication

- **Emails Automatiques :** Confirmation de dépôt, validation ou refus de candidature.
- **Messagerie Interne :** (Optionnel) Chat en temps réel via **Socket.io** pour une communication directe entre l'admin et l'étudiant.

---

## 🛠️ Stack Technique

Un aperçu des technologies utilisées pour ce projet :

| Domaine               | Technologie                                                                                                                                                                                                          |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**           | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) |
| **Frontend**          | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)                                                                                                                   |
| **Base de Données**   | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)                                                                                                    |
| **Authentification**  | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) (Cookies HttpOnly) / Google Login                                                                             |
| **Stockage Fichiers** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)                                                                                                    |
| **Communication**     | ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)                                                                                                       |
| **Design**            | **Responsive** (Mobile & Desktop)                                                                                                                                                                                    |

---

## 🚀 Installation & Démarrage

Suivez ces étapes pour lancer le projet en local.

**Prérequis :**

- Node.js (v18+)
- npm (ou yarn / pnpm)
- Un serveur PostgreSQL en cours d'exécution.

1.  **Cloner le dépôt :**

    ```bash
    git clone [URL_DU_REPO]
    cd [NOM_DU_REPO]
    ```

2.  **Installer les dépendances du Backend :**

    ```bash
    cd backend
    npm install
    ```

3.  **Installer les dépendances du Frontend :**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Configurer les variables d'environnement :**

    - Créez un fichier `.env` à la racine de `/backend` (voir [Configuration](#-configuration)).
    - Créez un fichier `.env` à la racine de `/frontend`.

5.  **Initialiser la base de données (Backend) :**

    - Assurez-vous que votre service PostgreSQL est lancé.
    - Exécutez les migrations (adaptez la commande selon votre outil, ex: Prisma, TypeORM...)
      ```bash
      cd ../backend
      npm run migrate # Exemple de commande
      ```

6.  **Lancer les serveurs :**
    - **Terminal 1 (Backend) :**
      ```bash
      cd backend
      npm run dev
      ```
    - **Terminal 2 (Frontend) :**
      ```bash
      cd frontend
      npm run dev
      ```

L'application React sera accessible sur `http://localhost:3000` et l'API sur `http://localhost:5000` (ou les ports que vous avez configurés).

---

## ⚙️ Configuration

Créez les fichiers `.env` requis et remplissez les variables nécessaires.

### `/backend/.env`

```properties
# Base de données PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

# Authentification JWT
JWT_SECRET="VOTRE_SECRET_TRES_SECURISE_POUR_JWT"
JWT_EXPIRES_IN="1d"
COOKIE_SECRET="VOTRE_SECRET_POUR_LES_COOKIES_SIGNES"

# Cloudinary (Stockage CV/LM)
CLOUDINARY_CLOUD_NAME="VOTRE_CLOUD_NAME"
CLOUDINARY_API_KEY="VOTRE_API_KEY"
CLOUDINARY_API_SECRET="VOTRE_API_SECRET"

# Emails (Nodemailer)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="votre_email@example.com"
EMAIL_PASS="votre_mot_de_passe"

# Google Login
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```
