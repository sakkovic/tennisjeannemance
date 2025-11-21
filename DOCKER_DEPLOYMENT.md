# Guide de Déploiement Docker - Sakka Tennis Website

Ce guide explique comment déployer le site web de Sakka Tennis en utilisant Docker.

## Prérequis

Assurez-vous d'avoir installé sur votre machine :
- Docker (version 20.10 ou supérieure)
- Docker Compose (version 1.29 ou supérieure)

## Installation de Docker

### Sur Ubuntu/Debian
```bash
# Mettre à jour les paquets
sudo apt update

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo apt install docker-compose

# Ajouter votre utilisateur au groupe docker (optionnel)
sudo usermod -aG docker $USER
```

### Sur macOS
```bash
# Télécharger et installer Docker Desktop depuis
# https://www.docker.com/products/docker-desktop
```

### Sur Windows
```bash
# Télécharger et installer Docker Desktop depuis
# https://www.docker.com/products/docker-desktop
```

## Déploiement avec Docker Compose (Recommandé)

### 1. Cloner le dépôt
```bash
git clone https://github.com/sakkovic/tennis_website.git
cd tennis_website
```

### 2. Construire et démarrer le conteneur
```bash
docker-compose up -d --build
```

Cette commande va :
- Construire l'image Docker
- Installer toutes les dépendances
- Compiler l'application React
- Démarrer un serveur nginx
- Exposer le site sur le port 8080

### 3. Accéder au site
Ouvrez votre navigateur et accédez à :
```
http://localhost:8080
```

### 4. Arrêter le conteneur
```bash
docker-compose down
```

### 5. Voir les logs
```bash
docker-compose logs -f
```

## Déploiement avec Docker uniquement

Si vous préférez utiliser Docker sans Docker Compose :

### 1. Construire l'image
```bash
docker build -t sakka-tennis-website .
```

### 2. Lancer le conteneur
```bash
docker run -d -p 8080:80 --name sakka-tennis sakka-tennis-website
```

### 3. Arrêter le conteneur
```bash
docker stop sakka-tennis
docker rm sakka-tennis
```

## Déploiement en Production

### Configuration des ports
Pour déployer en production sur le port 80 (HTTP standard), modifiez le fichier `docker-compose.yml` :

```yaml
ports:
  - "80:80"
```

### Utilisation avec un reverse proxy (Nginx/Traefik)
Si vous utilisez un reverse proxy, configurez-le pour rediriger vers le port 8080 du conteneur.

### SSL/HTTPS avec Let's Encrypt
Pour ajouter HTTPS, utilisez un reverse proxy comme Nginx ou Traefik avec Let's Encrypt.

## Mise à jour du site

### 1. Récupérer les dernières modifications
```bash
git pull origin main
```

### 2. Reconstruire et redémarrer
```bash
docker-compose up -d --build
```

## Dépannage

### Le site ne se charge pas
```bash
# Vérifier que le conteneur est en cours d'exécution
docker ps

# Vérifier les logs
docker-compose logs -f
```

### Problèmes de permissions
```bash
# Sur Linux, si vous avez des problèmes de permissions
sudo chown -R $USER:$USER .
```

### Nettoyer les anciennes images
```bash
# Supprimer les images non utilisées
docker system prune -a
```

## Variables d'environnement

Si vous avez besoin de configurer des variables d'environnement, créez un fichier `.env` :

```env
NODE_ENV=production
PORT=80
```

## Support

Pour toute question ou problème :
- Email : anis.federe@gmail.com
- Téléphone : +1 (514) 812-0621

## Avantages de Docker

✅ **Isolation** : Pas de conflits avec d'autres applications
✅ **Portabilité** : Fonctionne sur n'importe quelle machine avec Docker
✅ **Reproductibilité** : Même environnement en développement et production
✅ **Facilité de déploiement** : Une seule commande pour tout installer
✅ **Gestion des dépendances** : Toutes les dépendances sont incluses dans l'image
