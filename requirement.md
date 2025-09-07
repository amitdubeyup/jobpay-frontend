You are my frontend setup assistant.  
I want to create a complete Next.js frontend with the following stack:

- Next.js (App Router, latest stable)
- React + TypeScript
- TailwindCSS + shadcn/ui + Framer Motion
- Apollo Client for GraphQL queries/mutations
- React Query (TanStack Query) for data fetching
- PWA support (service worker, manifest.json)
- ESLint + Prettier for code quality

Please do the following step by step:

1. You are already in frontend folder, so just create files.
2. Install required dependencies:
   - tailwindcss, postcss, autoprefixer
   - @apollo/client, graphql
   - @tanstack/react-query
   - shadcn/ui (with setup)
   - framer-motion
   - eslint, prettier, lint-staged, husky
3. Configure Tailwind with shadcn/ui (global styles, fonts, dark mode).
4. Add Apollo Client setup (GraphQL endpoint from NEXT_PUBLIC_API_URL in .env).
5. Add React Query provider and integrate with Apollo for caching.
6. Configure basic PWA support:
   - manifest.json
   - next-pwa or custom service worker
7. Create example pages/components:
   - `/` → Landing page (marketing/SEO friendly, SSR)
   - `/app` → Authenticated app layout (CSR)
   - `/jobs` → Fetch job list via GraphQL query
   - `/jobs/[id]` → Job detail page
8. Add shadcn/ui components:
   - Button, Card, Input, Modal
   - Use Framer Motion for smooth transitions
9. Provide .env.example file with NEXT_PUBLIC_API_URL.
10. Ensure project runs with `pnpm dev` and supports PWA install.

Generate all required files (next.config.js, tailwind.config.js, postcss.config.js, Apollo setup, providers, sample components/pages, manifest.json).  
Code should be production-ready, mobile-first, and SEO-friendly.

Cross check whatever you have setup & let me know, Make sure setup is optimized & performant.
