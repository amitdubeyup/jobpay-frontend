# 🚀 JobPay Frontend - Developer Onboarding Guide

Welcome to the JobPay Frontend team! This guide will help you get up and running quickly with our Next.js application.

## 📋 **Prerequisites**

Before you start, make sure you have the following installed:

- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **pnpm** (v8 or later) - [Installation guide](https://pnpm.io/installation)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### **Recommended VS Code Extensions**

Install these extensions for the best development experience:

```bash
# Essential extensions
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension GraphQL.vscode-graphql
code --install-extension ms-playwright.playwright

# Optional but helpful
code --install-extension christian-kohler.path-intellisense
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
```

---

## 🏁 **Quick Start**

### **1. Clone and Setup**

```bash
# Clone the repository
git clone https://github.com/jobpayindia/jobpay-frontend.git
cd jobpay-frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### **2. Environment Configuration**

Update your `.env.local` file with the necessary environment variables:

```bash
# Required for development
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXTAUTH_SECRET="your-local-secret-key-min-32-chars"

# Optional for full functionality
DATABASE_URL="postgresql://localhost:5432/jobpay_dev"
REDIS_URL="redis://localhost:6379"
```

### **3. Verify Setup**

```bash
# Run tests
pnpm test

# Check TypeScript
pnpm type-check

# Lint code
pnpm lint

# Check health endpoint
curl http://localhost:3000/api/health
```

---

## 🏗️ **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   ├── jobs/              # Job pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/                  # Utilities & configurations
│   ├── apollo.ts         # GraphQL client
│   ├── auth.ts           # Authentication
│   ├── config.ts         # Environment config
│   ├── feature-flags.ts  # Feature flags
│   └── test-utils.tsx    # Testing utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── schemas/              # Zod validation schemas
```

---

## 🛠️ **Development Workflow**

### **Daily Development**

1. **Pull latest changes**

   ```bash
   git pull origin main
   pnpm install  # If package.json changed
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Start development**

   ```bash
   pnpm dev    # Start development server
   pnpm test:watch  # Run tests in watch mode
   ```

4. **Before committing**
   ```bash
   pnpm type-check  # Check TypeScript
   pnpm lint:fix    # Fix linting issues
   pnpm test        # Run all tests
   ```

### **Code Quality Checks**

Our project uses automated checks that run on every commit:

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Pre-commit hooks
- **Jest** - Unit and integration tests

---

## 🧪 **Testing Strategy**

### **Test Types**

1. **Unit Tests** - Component and function tests

   ```bash
   pnpm test                    # Run all tests
   pnpm test:watch             # Watch mode
   pnpm test:coverage          # Coverage report
   ```

2. **Integration Tests** - API and hook tests

   ```bash
   pnpm test src/hooks/        # Test specific directory
   ```

3. **E2E Tests** - Full application tests (coming soon)
   ```bash
   pnpm test:e2e              # End-to-end tests
   ```

### **Writing Tests**

```typescript
// Example component test
import { render, screen, fireEvent } from '@/lib/test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🎨 **Styling Guidelines**

### **TailwindCSS Best Practices**

```typescript
// ✅ Good: Semantic utility combinations
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// ✅ Better: Use component variants
const cardVariants = cva("p-4 bg-white rounded-lg", {
  variants: {
    size: { sm: "p-3", md: "p-4", lg: "p-6" }
  }
});

// ✅ Best: Use design system components
<Card variant="elevated" size="lg">
```

### **Responsive Design**

```typescript
// Mobile-first approach
<div className="
  text-sm sm:text-base lg:text-lg
  p-4 sm:p-6 lg:p-8
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
">
```

---

## 🔒 **Security Guidelines**

### **Authentication**

```typescript
// Use auth helpers for protected routes
import { withAuth } from '@/lib/auth';

export default withAuth(
  async (req, user) => {
    // Your API logic here
  },
  ['admin']
); // Required permissions
```

### **Input Validation**

```typescript
// Always validate inputs with Zod
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

// In API routes
const { email, name } = UserSchema.parse(request.body);
```

---

## 🚩 **Feature Flags**

### **Using Feature Flags**

```typescript
import { useFeatureFlag, FeatureGate } from '@/lib/feature-flags';

// In components
function MyComponent() {
  const isPremiumEnabled = useFeatureFlag('ENABLE_PREMIUM_FEATURES');

  return (
    <div>
      <FeatureGate flag="ENABLE_CHAT_SUPPORT">
        <ChatWidget />
      </FeatureGate>
    </div>
  );
}
```

### **Available Flags**

- `ENABLE_PWA` - Progressive Web App features
- `ENABLE_ANALYTICS` - Google Analytics tracking
- `ENABLE_PAYMENTS` - Stripe payment integration
- `ENABLE_CHAT_SUPPORT` - Live chat widget
- `ENABLE_DARK_MODE` - Dark theme support

---

## 🐛 **Debugging & Troubleshooting**

### **Common Issues**

1. **Build Errors**

   ```bash
   # Clear Next.js cache
   pnpm clean

   # Reinstall dependencies
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **TypeScript Errors**

   ```bash
   # Check types explicitly
   pnpm type-check

   # Restart TypeScript server in VS Code
   Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
   ```

3. **Test Failures**

   ```bash
   # Update test snapshots
   pnpm test -- --updateSnapshot

   # Debug specific test
   pnpm test -- --testNamePattern="your test name"
   ```

### **Development Tools**

- **React DevTools** - Browser extension for React debugging
- **Apollo DevTools** - GraphQL query inspection
- **Tailwind DevTools** - CSS class inspection
- **Next.js DevTools** - Performance and bundle analysis

---

## 📚 **Learning Resources**

### **Framework Documentation**

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### **Our Stack**

- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL client
- [React Query](https://tanstack.com/query/latest) - Data fetching
- [Zod](https://zod.dev/) - Schema validation
- [Jest](https://jestjs.io/) - Testing framework
- [Testing Library](https://testing-library.com/) - Testing utilities

---

## 🤝 **Getting Help**

### **Team Communication**

- **Slack**: `#frontend-team` channel
- **GitHub**: Create issues for bugs or feature requests
- **Code Reviews**: All PRs require at least one review
- **Daily Standups**: 9:30 AM EST Monday-Friday

### **Code Review Process**

1. Create feature branch from `main`
2. Make your changes with tests
3. Open Pull Request with:
   - Clear description
   - Screenshots/videos for UI changes
   - Test results
4. Address review feedback
5. Merge after approval

### **Emergency Contacts**

- **Tech Lead**: @tech-lead (urgent issues)
- **DevOps**: @devops-team (deployment issues)
- **Product**: @product-team (feature questions)

---

## ✅ **Onboarding Checklist**

### **Week 1: Setup & Familiarization**

- [ ] Complete environment setup
- [ ] Run all commands successfully
- [ ] Read project documentation
- [ ] Review code guidelines
- [ ] Set up development tools
- [ ] Join team Slack channels
- [ ] Attend team standup

### **Week 2: First Contributions**

- [ ] Fix a "good first issue"
- [ ] Write your first test
- [ ] Submit first Pull Request
- [ ] Complete code review process
- [ ] Deploy to staging environment

### **Week 3: Deep Dive**

- [ ] Understand authentication flow
- [ ] Learn GraphQL schema
- [ ] Implement a feature
- [ ] Add comprehensive tests
- [ ] Optimize component performance

### **Week 4: Team Integration**

- [ ] Mentor another new developer
- [ ] Contribute to documentation
- [ ] Suggest process improvements
- [ ] Lead a feature discussion

---

## 🎯 **Next Steps**

Once you're comfortable with the basics:

1. **Advanced Topics**
   - Performance optimization
   - SEO implementation
   - PWA features
   - Error monitoring

2. **Specialization Areas**
   - Frontend architecture
   - UI/UX design systems
   - Testing strategies
   - DevOps integration

3. **Leadership Opportunities**
   - Code review leadership
   - Mentoring new developers
   - Technical decision making
   - Process improvements

---

Welcome to the team! 🎉

If you have any questions or need help, don't hesitate to reach out to the team. We're here to support your success!
