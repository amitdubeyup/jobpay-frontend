# jobpay-frontend

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

An **enterprise-grade**, scalable job search platform with comprehensive automation, security, and maintainability features.

## 🚀 Tech Stack

- React
- Next.js
- TypeScript
- Tailwind CSS

## ✨ Features

- Modern and scalable architecture
- Type-safe development with TypeScript

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/amitdubeyup/jobpay-frontend.git
cd jobpay-frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration values.

## 🚀 Usage

```bash
# Development mode
npm run dev

# Production mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📜 Available Scripts

- `npm run dev` - next dev
- `npm run build` - next build
- `npm run start` - next start
- `npm run lint` - next lint
- `npm run lint:fix` - next lint --fix
- `npm run type-check` - tsc --noEmit
- `npm run format` - prettier --write .
- `npm run format:check` - prettier --check .
- `npm run prepare` - husky install
- `npm run test` - jest
- `npm run test:watch` - jest --watch
- `npm run test:coverage` - jest --coverage
- `npm run test:ci` - jest --ci --coverage --watchAll=false
- `npm run test:e2e` - playwright test
- `npm run test:e2e:ui` - playwright test --ui
- `npm run security:audit` - pnpm audit
- `npm run security:fix` - pnpm audit --fix
- `npm run analyze` - cross-env ANALYZE=true next build
- `npm run clean` - rm -rf .next node_modules/.cache
- `npm run precommit` - lint-staged
- `npm run health-check` - curl -f http://localhost:3000/api/health || exit 1

## 📁 Project Structure

```
jobpay-frontend/
├── src/
├── public/
├── package.json
├── tsconfig.json
├── .env.example
├── docker-compose.yml
├── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Amit Dubey**

- GitHub: [@amitdubeyup](https://github.com/amitdubeyup)
