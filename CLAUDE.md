# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal homepage built with Astro 5 and Tailwind CSS v4, deployed to GitHub Pages. The site supports internationalization (i18n) with English, Russian, and Spanish locales and features a dark/light theme system.

## Quick Start

```bash
# Development
npm run dev          # Start development server on port 4321
npm run build        # Build for production
npm run test:unit    # Run unit tests with snapshots
npm run test:e2e     # Run E2E tests on production site
```

## Documentation Structure

This project uses distributed CLAUDE.md files for focused documentation:

### 📚 Core Documentation
- **[docs/architecture.md](docs/architecture.md)** - Technical architecture and system overview
- **[docs/development-guide.md](docs/development-guide.md)** - Development workflows and best practices
- **[docs/code-patterns.md](docs/code-patterns.md)** - Common code patterns and examples

### 🎯 Directory-Specific Guides
- **[src/components/CLAUDE.md](src/components/CLAUDE.md)** - Component development guidelines
- **[src/i18n/CLAUDE.md](src/i18n/CLAUDE.md)** - Internationalization system
- **[src/test/CLAUDE.md](src/test/CLAUDE.md)** - Unit testing with snapshots
- **[e2e-tests/CLAUDE.md](e2e-tests/CLAUDE.md)** - E2E testing for production

## Key Technologies

- **Astro 5** - Static site generator with TypeScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vitest** - Unit testing with snapshot support
- **Puppeteer** - E2E testing for production validation
- **GitHub Pages** - Deployment with custom domain (r3nya.ru)

## Testing Strategy

- **Unit Tests**: Component testing with clean snapshots (no absolute paths)
- **E2E Tests**: Production site validation (runs weekly via GitHub Actions)
- **Snapshot Testing**: Render diff validation across all locales

## Need Help?

Refer to the specific CLAUDE.md files above for detailed guidance on each area of the project.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

**Exception**: CLAUDE.md files are explicitly encouraged and should be created/updated to provide development guidance.

## TypeScript Guidelines
- **Use `unknown` instead of `any`** when you can't find the correct type/interface
- **Always provide explicit types** for function parameters and return values
- **Create proper interfaces** for object types when possible
- **Prefer type safety** over convenience

## Code Formatting
- **Always run `npm run format`** after completing any task that modifies code files
- This ensures consistent code formatting with Prettier across the project