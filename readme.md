[![CodeFactor](https://www.codefactor.io/repository/github/r3nya/r3nya.github.io/badge)](https://www.codefactor.io/repository/github/r3nya/r3nya.github.io)
[![Known Vulnerabilities](https://snyk.io/test/github/r3nya/r3nya.github.io/badge.svg?targetFile=package.json)](https://snyk.io/test/github/r3nya/r3nya.github.io?targetFile=package.json)

# [My homepage](https://r3nya.ru) 🌐

Personal homepage built with **Astro 5** and **Tailwind CSS v4**, featuring internationalization support for English, Russian, and Spanish locales.

## 🚀 Tech Stack

- **Astro 5** - Static site generator with TypeScript support
- **Tailwind CSS v4** - Utility-first CSS framework
- **i18n System** - Multi-language support with locale routing
- **GitHub Pages** - Deployment with custom domain
- **Vitest** - Unit testing with snapshot support
- **Puppeteer** - E2E testing for production validation

## 📜 Available Scripts

| Script         | Description                                    |
| -------------- | ---------------------------------------------- |
| `clean`        | Removes the `./dist` directory                 |
| `dev`          | Starts development server on port 4321         |
| `build`        | Builds the project for production              |
| `preview`      | Preview production build locally               |
| `format`       | Formats code with Prettier                     |
| `format:check` | Check formatting without making changes        |
| `test:unit`    | Run unit tests with Vitest (snapshot testing)  |
| `test:e2e`     | Run E2E tests with Puppeteer (production site) |

## 🧪 Testing

- **Unit Tests**: Component testing with clean snapshots using Vitest
- **E2E Tests**: Production site validation using Puppeteer
- **Automated Testing**: Weekly E2E tests via GitHub Actions

## 🌍 Internationalization

Supports three locales with automatic routing:

- **English** (default): `/`
- **Russian**: `/ru/`
- **Spanish**: `/es/`

## 📖 Documentation

See [CLAUDE.md](CLAUDE.md) for comprehensive development guidance and architecture details.

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:unit
npm run test:e2e

# Build for production
npm run build
```
