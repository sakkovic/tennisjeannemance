# Guide de Mise à Jour sur GitHub

Ce guide vous explique comment pousser les modifications vers votre dépôt GitHub.

## Étapes pour Mettre à Jour le Dépôt

### 1. Vérifier les Modifications

```bash
cd /home/ubuntu/tennis_website
git status
```

### 2. Ajouter Tous les Fichiers Modifiés

```bash
git add -A
```

### 3. Créer un Commit avec un Message Descriptif

```bash
git commit -m "✨ Améliorations majeures du site web

- Correction des problèmes de couleurs et de visibilité
- Ajout d'une galerie de 7 photos professionnelles
- Enrichissement de la section About avec CV complet
- Ajout d'une timeline d'expérience professionnelle
- Ajout de highlights (réalisations clés)
- Ajout d'une 4ème slide dans le portfolio (expérience internationale)
- Conteneurisation Docker complète
- Documentation de déploiement Docker
- Configuration Nginx optimisée
- Support multi-langues (FR, EN, AR)"
```

### 4. Pousser vers GitHub

```bash
git push origin main
```

Si vous avez des problèmes d'authentification, vous devrez peut-être configurer vos identifiants GitHub :

```bash
# Configurer votre nom et email
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Si vous utilisez un token d'accès personnel (recommandé)
git remote set-url origin https://YOUR_TOKEN@github.com/sakkovic/tennis_website.git
```

### 5. Vérifier sur GitHub

Allez sur https://github.com/sakkovic/tennis_website pour vérifier que les modifications sont bien présentes.

## Fichiers Ajoutés/Modifiés

### Nouveaux Fichiers
- `client/public/gallery/*.jpg` (7 photos)
- `client/src/components/Gallery.tsx`
- `client/src/index.css`
- `Dockerfile`
- `docker-compose.yml`
- `nginx.conf`
- `.dockerignore`
- `DOCKER_DEPLOYMENT.md`
- `AMELIORATIONS.md`
- `GITHUB_UPDATE.md` (ce fichier)
- `cv_info.md`

### Fichiers Modifiés
- `client/src/components/About.tsx`
- `client/src/components/Portfolio.tsx`
- `client/src/components/Navigation.tsx`
- `client/src/App.tsx`
- `client/src/hooks/use-dynamic-theme.ts`

## Commandes Git Utiles

### Voir l'Historique des Commits
```bash
git log --oneline
```

### Voir les Différences
```bash
git diff
```

### Annuler des Modifications (avant commit)
```bash
git checkout -- <fichier>
```

### Créer une Branche pour Tester
```bash
git checkout -b test-improvements
git push origin test-improvements
```

## Déploiement Automatique

Si vous utilisez un service comme Vercel, Netlify ou GitHub Pages, le déploiement se fera automatiquement après le push.

### Pour Vercel
1. Connectez votre dépôt GitHub à Vercel
2. Chaque push sur `main` déclenchera un déploiement automatique

### Pour Netlify
1. Connectez votre dépôt GitHub à Netlify
2. Configurez le build command : `pnpm build`
3. Configurez le publish directory : `dist`

## Prochaines Étapes

Après avoir poussé sur GitHub, vous pouvez :

1. **Déployer avec Docker** (voir `DOCKER_DEPLOYMENT.md`)
2. **Configurer un domaine personnalisé** (ex: sakkatennis.com)
3. **Activer HTTPS** avec Let's Encrypt
4. **Configurer un CI/CD** pour automatiser les déploiements

## Support

Pour toute question :
- Email : anis.federe@gmail.com
- Téléphone : +1 (514) 812-0621
