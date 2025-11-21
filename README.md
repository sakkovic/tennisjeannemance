# 🎾 Sakka Tennis Coach - Professional Website

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

Professional tennis coaching website for **Mohamed Anis Sakka**, based in Montreal, QC. Showcasing 20+ years of playing experience and 5+ years of professional coaching expertise.

## 🌟 Features

- **Modern Design**: Sleek, responsive design with smooth animations (GSAP, Framer Motion)
- **Photo Gallery**: Professional gallery with 7 high-quality coaching photos
- **Comprehensive About Section**: Detailed experience timeline, highlights, and achievements
- **Services Showcase**: Private lessons, group training, and competitive development programs
- **Testimonials**: Client feedback and success stories
- **Contact Form**: Easy booking and inquiry system
- **Multi-language Support**: French, English, and Arabic
- **Docker Ready**: Complete containerization for easy deployment

## 🚀 Quick Start

### Development Mode

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Access at http://localhost:3000
```

### Docker Deployment (Recommended)

```bash
# Build and start container
docker-compose up -d --build

# Access at http://localhost:8080
```

See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
tennis_website/
├── client/                    # React frontend application
│   ├── public/
│   │   └── gallery/          # Professional coaching photos (7 images)
│   └── src/
│       ├── components/       # React components
│       │   ├── Gallery.tsx   # Photo gallery component
│       │   ├── About.tsx     # Enhanced about section
│       │   ├── Portfolio.tsx # Achievements showcase
│       │   └── ...
│       ├── hooks/            # Custom React hooks
│       └── index.css         # Global styles with CSS variables
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose setup
├── nginx.conf               # Nginx configuration
└── README.md                # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **GSAP & Framer Motion** - Smooth animations
- **Vite 7** - Fast build tool

### Deployment
- **Docker** - Containerization
- **Nginx** - Production web server
- **pnpm** - Fast package manager

## 📸 Gallery

The website includes a professional photo gallery featuring:
- Training sessions with students
- Victory celebrations with champions
- International experience (Rogers Cup Montreal, WTA 250)
- Group coaching sessions
- Private lessons

## 🎯 Key Sections

### About Me
- Professional highlights and achievements
- Experience timeline (2018-2025)
- Language skills (French, English, Arabic)
- Certifications and training

### Achievements
- Vice-Champion of Tunisia (2018 Junior, 2019 Senior)
- National champions developed (Lina Soussi, Rined Saafi, and more)
- Team leadership (U12 Championship semi-finals)
- International experience (WTA, Rogers Cup)

### Services
- **Private Lessons**: One-on-one personalized coaching
- **Group Training**: Small group sessions for skill development
- **Competitive Development**: Tournament preparation and strategy

## 🐳 Docker Deployment

### Quick Deploy
```bash
docker-compose up -d --build
```

### Production Deploy
```bash
# Build image
docker build -t sakka-tennis-website .

# Run container
docker run -d -p 80:80 --name sakka-tennis sakka-tennis-website
```

### Features
- ✅ Multi-stage build for optimized image size (~50 MB)
- ✅ Nginx with gzip compression
- ✅ Static asset caching (1 year)
- ✅ Security headers enabled
- ✅ SPA routing support

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Docker
docker-compose up -d --build    # Build and start
docker-compose down             # Stop and remove
docker-compose logs -f          # View logs
```

## 🌐 Deployment Options

### Option 1: Docker (Recommended)
See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

### Option 2: Vercel
```bash
vercel --prod
```

### Option 3: Netlify
```bash
netlify deploy --prod
```

## 📚 Documentation

- [AMELIORATIONS.md](./AMELIORATIONS.md) - Complete list of improvements
- [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) - Docker deployment guide
- [GITHUB_UPDATE.md](./GITHUB_UPDATE.md) - GitHub update instructions

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Theme**: Professional dark color scheme with green accents
- **Smooth Animations**: GSAP and Framer Motion for fluid interactions
- **Optimized Performance**: Lazy loading, code splitting, and caching
- **Accessibility**: WCAG compliant with semantic HTML

## 📞 Contact

**Mohamed Anis Sakka**
- 📧 Email: anis.federe@gmail.com
- 📱 Phone: +1 (514) 812-0621
- 📍 Location: Montreal, QC, H3C 0J9

## 📄 License

© 2025 Mohamed Anis Sakka - Professional Tennis Coaching

## 🤝 Contributing

This is a personal website project. For suggestions or improvements, please contact the owner directly.

## 🔄 Recent Updates (November 2025)

- ✅ Fixed color visibility issues across all sections
- ✅ Added professional photo gallery (7 images)
- ✅ Enhanced About section with timeline and highlights
- ✅ Added international experience showcase
- ✅ Complete Docker containerization
- ✅ Optimized Nginx configuration
- ✅ Multi-language support badges
- ✅ Improved mobile responsiveness

---

**Built with ❤️ in Montreal** | **Powered by React + Tailwind + Docker**
