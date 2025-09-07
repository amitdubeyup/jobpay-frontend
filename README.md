# JobPay Frontend

A modern, responsive job search platform built with Next.js, React, TypeScript, and TailwindCSS.

## 🚀 Features

- **Modern Stack**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: TailwindCSS with shadcn/ui components and Framer Motion animations
- **Data Fetching**: Apollo Client for GraphQL queries with React Query integration
- **PWA Support**: Progressive Web App with offline capabilities
- **Code Quality**: ESLint, Prettier, Husky git hooks, and lint-staged
- **SEO Optimized**: Server-side rendering and static generation
- **Mobile First**: Responsive design with dark mode support

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui + Framer Motion
- **Data**: Apollo Client + GraphQL + React Query
- **PWA**: next-pwa + manifest.json
- **Code Quality**: ESLint + Prettier + Husky + lint-staged

## 🛠️ Setup

### Prerequisites

- Node.js 18+ and pnpm
- Git

### Installation

1. **Clone and install dependencies:**

   ```bash
   cd frontend
   pnpm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your GraphQL API endpoint:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
   ```

3. **Development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm type-check` - Run TypeScript checks
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## 📱 PWA Features

The app includes Progressive Web App capabilities:

- **Installable**: Add to home screen on mobile/desktop
- **Offline Ready**: Service worker for caching
- **App-like Experience**: Standalone display mode
- **Icons**: Multiple sizes for different devices
- **Shortcuts**: Quick actions from app icon

## 🎨 UI Components

Built with shadcn/ui components:

- **Button**: Multiple variants and sizes
- **Card**: Content containers with styling
- **Input**: Form inputs with validation styles
- **Dialog**: Modal dialogs and overlays

## 📄 Pages

- **`/`** - Landing page (SSR, SEO optimized)
- **`/app`** - Authenticated dashboard (CSR)
- **`/jobs`** - Job listings with search (GraphQL)
- **`/jobs/[id]`** - Job detail page (SSG/ISR)

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration with PWA
- `tailwind.config.js` - TailwindCSS with shadcn/ui setup
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.json` - ESLint rules and plugins
- `.prettierrc` - Prettier formatting rules
- `tsconfig.json` - TypeScript configuration

## 🚀 Production Deployment

1. **Build the application:**

   ```bash
   pnpm build
   ```

2. **Start production server:**
   ```bash
   pnpm start
   ```

The app is optimized for deployment on:

- Vercel (recommended for Next.js)
- Netlify
- Docker containers
- Static hosting (after `next export`)

## 🔍 GraphQL Integration

The app uses Apollo Client for GraphQL operations:

- **Queries**: Job listings, job details
- **Mutations**: Job applications, user actions
- **Caching**: Automatic caching with React Query
- **Error Handling**: Graceful fallbacks and error states

## 🎯 Performance

- **Core Web Vitals**: Optimized for Google's metrics
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Multiple caching strategies

## 🛡️ Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Linting with Next.js and TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for quality checks
- **lint-staged**: Pre-commit linting

## 📱 Mobile & Accessibility

- **Responsive Design**: Mobile-first approach
- **Touch Friendly**: Optimized for touch interfaces
- **Accessibility**: ARIA labels and semantic HTML
- **Dark Mode**: System preference detection
- **Fast Loading**: Optimized for mobile networks

## 🔄 Development Workflow

1. Create feature branch
2. Make changes with TypeScript
3. Pre-commit hooks run automatically
4. Build and test locally
5. Deploy with CI/CD

---

Built with ❤️ using modern web technologies.
