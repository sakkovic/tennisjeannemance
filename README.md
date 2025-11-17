# 🎾 Tennis Coaching Website - Montreal

[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)

Site web professionnel pour un coach de tennis basé à Montréal, QC. Présentation des services de coaching, expérience, réalisations et témoignages.

---

## 📸 Aperçu

Un site web moderne et responsive présentant :
- **Services de coaching** - Cours privés, sessions de groupe, développement compétitif
- **Galerie photos** - 7 photos professionnelles des sessions d'entraînement
- **Réalisations** - Champions nationaux tunisiens et expérience internationale
- **À propos** - Profil du coach avec certifications et expérience
- **Témoignages** - Avis et retours des clients

---

## ✨ Fonctionnalités

- ✅ **Design Responsive** - Optimisé pour mobile, tablette et desktop
- ✅ **Interface Moderne** - UI élégante avec React 19 et Tailwind CSS 4
- ✅ **Galerie Interactive** - Modal plein écran avec effets hover
- ✅ **Navigation Fluide** - Scroll smooth et animations
- ✅ **Thème Dynamique** - Couleurs adaptatives selon les sections
- ✅ **Performance Optimisée** - Build rapide avec Vite
- ✅ **Docker Ready** - Déploiement conteneurisé facile

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 19** - Bibliothèque UI moderne
- **TypeScript** - JavaScript typé et sécurisé
- **Tailwind CSS 4** - Framework CSS utility-first
- **Vite** - Build tool ultra-rapide
- **Wouter** - Routing léger
- **shadcn/ui** - Composants UI de haute qualité
- **Lucide React** - Bibliothèque d'icônes

### DevOps
- **Docker** - Conteneurisation
- **Nginx** - Serveur web de production
- **pnpm** - Gestionnaire de paquets performant

---

## 📦 Installation

### Prérequis

- **Node.js** 18+ (LTS recommandé)
- **pnpm** 8+ (ou npm/yarn)
- **Git**

### Cloner le Dépôt

```bash
git clone https://github.com/sakkovic/tennisjeannemance.git
cd tennisjeannemance
```

### Installer les Dépendances

```bash
pnpm install
```

---

## 🚀 Développement Local

### Démarrer le Serveur de Développement

```bash
pnpm dev
```

Le site sera accessible sur **http://localhost:3000**

### Build de Production

```bash
pnpm build
```

Les fichiers optimisés seront dans le dossier `dist/`

### Prévisualiser le Build

```bash
pnpm preview
```

---

## 🐳 Déploiement Docker

### Méthode Rapide (Docker Compose)

```bash
docker-compose up -d --build
```

Le site sera accessible sur **http://localhost:8080**

### Build Manuel

```bash
# Build l'image
docker build -t tennis-website .

# Lancer le conteneur
docker run -d -p 8080:80 tennis-website
```

### Arrêter les Conteneurs

```bash
docker-compose down
```

---

## 📁 Structure du Projet

```
tennisjeannemance/
├── client/                      # Application frontend
│   ├── public/                  # Assets statiques
│   │   └── images/              # Photos (7 images)
│   ├── src/
│   │   ├── components/          # Composants React
│   │   │   ├── Hero.tsx         # Section hero
│   │   │   ├── Services.tsx     # Services de coaching
│   │   │   ├── About.tsx        # À propos du coach
│   │   │   ├── Portfolio.tsx    # Réalisations
│   │   │   ├── Gallery.tsx      # Galerie photos
│   │   │   ├── Testimonials.tsx # Témoignages
│   │   │   ├── Contact.tsx      # Contact
│   │   │   ├── Navigation.tsx   # Navigation
│   │   │   └── Footer.tsx       # Footer
│   │   ├── pages/               # Pages
│   │   │   ├── Home.tsx         # Page d'accueil
│   │   │   └── NotFound.tsx     # Page 404
│   │   ├── hooks/               # React hooks
│   │   ├── lib/                 # Utilitaires
│   │   ├── App.tsx              # Composant principal
│   │   ├── main.tsx             # Point d'entrée React
│   │   ├── index.css            # Styles globaux
│   │   └── const.ts             # Constantes
│   ├── index.html               # Template HTML
│   ├── package.json             # Dépendances
│   └── vite.config.ts           # Configuration Vite
├── Dockerfile                   # Configuration Docker
├── docker-compose.yml           # Orchestration Docker
├── nginx.conf                   # Configuration Nginx
├── .dockerignore                # Exclusions Docker
├── AMELIORATIONS.md             # Documentation des améliorations
├── DOCKER_DEPLOYMENT.md         # Guide Docker détaillé
└── README.md                    # Ce fichier
```

---

## 🎨 Personnalisation

### Modifier le Contenu

Tous les textes et contenus sont dans les fichiers des composants :

- **Hero** → `client/src/components/Hero.tsx`
- **Services** → `client/src/components/Services.tsx`
- **À propos** → `client/src/components/About.tsx`
- **Réalisations** → `client/src/components/Portfolio.tsx`
- **Galerie** → `client/src/components/Gallery.tsx`
- **Témoignages** → `client/src/components/Testimonials.tsx`
- **Contact** → `client/src/components/Contact.tsx`

### Changer le Logo et le Titre

Éditez `client/src/const.ts` :

```typescript
export const APP_LOGO = "🎾";
export const APP_TITLE = "Sakka Tennis Coach";
```

### Ajouter des Photos

1. Placez vos images dans `client/public/images/`
2. Mettez à jour le tableau `photos` dans `client/src/components/Gallery.tsx`

### Modifier les Couleurs

Les variables de couleurs sont dans `client/src/index.css`

---

## 🔧 Commandes Utiles

```bash
# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev

# Build de production
pnpm build

# Prévisualiser le build
pnpm preview

# Vérifier les erreurs TypeScript
pnpm type-check

# Docker - Build et lancer
docker-compose up -d --build

# Docker - Arrêter
docker-compose down

# Docker - Voir les logs
docker-compose logs -f
```

---

## 📱 Responsive Design

Le site est entièrement responsive et optimisé pour :

- **📱 Mobile** - 320px et plus
- **📱 Tablette** - 768px et plus
- **💻 Desktop** - 1024px et plus

---

## 🌐 Déploiement en Production

### Option 1 : Vercel (Recommandé)

1. Connectez votre dépôt GitHub à Vercel
2. Configurez le projet :
   - **Framework Preset** : Vite
   - **Root Directory** : `client`
   - **Build Command** : `pnpm build`
   - **Output Directory** : `dist`
3. Déployez !

### Option 2 : Netlify

1. Connectez votre dépôt GitHub à Netlify
2. Configurez :
   - **Base directory** : `client`
   - **Build command** : `pnpm build`
   - **Publish directory** : `client/dist`
3. Déployez !

### Option 3 : VPS avec Docker

```bash
# Sur votre serveur
git clone https://github.com/sakkovic/tennisjeannemance.git
cd tennisjeannemance
docker-compose up -d --build
```

Configurez ensuite Nginx ou un reverse proxy pour pointer vers le port 8080.

---

## 📞 Contact

**Coach Sakka**

- 📍 **Localisation** : Montréal, QC, Canada
- 📱 **Téléphone** : +1 (514) 812-0621
- 📧 **Email** : anis.federe@gmail.com
- 🗣️ **Langues** : Arabe, Anglais, Français

---

## 📄 Licence

Ce projet est privé et appartient à Sakka Tennis Coach.

---

## 🤝 Support

Pour toute question ou problème concernant le site web, veuillez contacter directement le coach.

---

## 📝 Historique des Versions

### Version 1.0.0 (Novembre 2025)

✨ **Nouvelles Fonctionnalités**
- Galerie de 7 photos professionnelles
- Section À propos enrichie avec timeline
- Expérience internationale ajoutée
- Configuration Docker complète

🐛 **Corrections**
- Problèmes de couleurs corrigés
- Textes invisibles sur fond sombre résolus
- Navigation améliorée

🎨 **Améliorations**
- Design responsive optimisé
- Performance améliorée
- Documentation complète

---

## 🙏 Remerciements

Merci à tous les joueurs et joueuses qui ont fait confiance à ce coaching de qualité !

---

**Dernière mise à jour** : 17 novembre 2025

**Fait avec ❤️ et 🎾 à Montréal**
