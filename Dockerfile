# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm@10.4.1 && \
    pnpm install --frozen-lockfile

# Copier le reste des fichiers
COPY . .

# Build de l'application
RUN pnpm build

# Stage 2: Production
FROM nginx:alpine

# Copier les fichiers buildés vers nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
