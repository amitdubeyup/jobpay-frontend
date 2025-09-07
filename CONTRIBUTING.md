# Contributing to JobPay Frontend

Thank you for your interest in contributing to JobPay! This document provides guidelines and information for contributors.

## Development Workflow

### Prerequisites

- Node.js 18+ and pnpm 8+
- Git for version control
- VS Code (recommended) with ESLint and Prettier extensions

### Getting Started

1. **Fork and Clone**

   ```bash
   git clone https://github.com/yourusername/jobpay-frontend.git
   cd jobpay-frontend
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

### Development Standards

#### Code Quality

- **TypeScript**: Use strict TypeScript configuration
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is automatically applied
- **Husky**: Pre-commit hooks ensure code quality

#### Commit Convention

We follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test-related changes
- chore: Build process or auxiliary tool changes
```

Examples:

```bash
git commit -m "feat(auth): add role-based access control"
git commit -m "fix(api): resolve GraphQL query timeout"
git commit -m "docs(readme): update installation instructions"
```

#### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Testing

#### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

#### Writing Tests

- Unit tests for utilities and components
- Integration tests for API routes
- E2E tests for critical user flows
- Minimum 80% code coverage required

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Quality Checks**

   ```bash
   pnpm lint          # Check code style
   pnpm type-check    # TypeScript validation
   pnpm test          # Run test suite
   pnpm build         # Ensure build works
   ```

4. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the PR template
   - Include screenshots for UI changes
   - Link related issues
   - Request review from maintainers

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)

Include screenshots for UI changes

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

### Issue Guidelines

#### Bug Reports

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, etc.)
- Screenshots or videos if helpful

#### Feature Requests

Include:

- Clear description of the proposed feature
- Use case and benefits
- Potential implementation approach
- Alternative solutions considered

### Architecture Guidelines

#### File Organization

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── features/       # Feature-specific components
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── graphql/            # GraphQL queries and mutations
└── styles/             # Global styles
```

#### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow single responsibility principle
- Include JSDoc comments for complex logic
- Use composition over inheritance

#### State Management

- React Query for server state
- React Context for app-wide client state
- Local state with useState/useReducer
- Avoid prop drilling

### Security Considerations

- Never commit sensitive data (API keys, secrets)
- Validate all user inputs
- Implement proper authentication checks
- Follow OWASP security guidelines
- Use environment variables for configuration

### Performance Guidelines

- Optimize bundle size with dynamic imports
- Implement proper image optimization
- Use React.memo for expensive components
- Monitor Core Web Vitals
- Lazy load non-critical resources

### Accessibility Standards

- Follow WCAG 2.1 AA guidelines
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers

### Documentation

- Update README.md for significant changes
- Document new environment variables
- Include JSDoc comments for complex functions
- Update API documentation when needed

### Release Process

1. **Version Bump**: Update package.json version
2. **Changelog**: Update CHANGELOG.md with changes
3. **Tag Release**: Create git tag with version number
4. **Deploy**: Automatic deployment via GitHub Actions

### Getting Help

- **Discord**: Join our development Discord server
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create issues for bugs and feature requests
- **Documentation**: Check the docs folder for detailed guides

### Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Annual contributor appreciation posts

Thank you for contributing to JobPay! 🚀
