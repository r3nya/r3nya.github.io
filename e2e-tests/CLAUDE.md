# E2E Tests - CLAUDE.md

This directory contains end-to-end (E2E) tests that validate the production website functionality.

## Test Environment

These E2E tests are designed to run against the **live production site** at `https://r3nya.ru`. They do **NOT** require a local development server to be running.

## Test Structure

### Files

- `e2e.test.js` - Main E2E test suite using Node.js test runner and Puppeteer
- `HomePage.js` - Page object model for the homepage with reusable methods and selectors

### Test Coverage

- **Homepage availability** - Verifies the site loads with HTTP 200 status
- **Page title validation** - Ensures correct title rendering
- **Social media links** - Validates all social links are present and functional
- **Cross-browser compatibility** - Tests with headless Chromium via Puppeteer

## Running Tests

```bash
# Run E2E tests locally (tests production site)
npm run test:e2e

# Manual execution
node --test e2e-tests/*test.js
```

## Automated Testing

E2E tests run automatically via GitHub Actions:

- **Schedule**: Every Sunday at 6:00 AM UTC
- **Trigger**: Manual execution via workflow_dispatch
- **Purpose**: Monitor production site health and catch regressions

## Important Notes

⚠️ **Production Testing**: These tests interact with the live website at https://r3nya.ru
⚠️ **No Local Server**: Do not start `npm run dev` or `npm run preview` for these tests
⚠️ **Network Dependency**: Tests require internet connectivity to reach the production site

## Test Philosophy

These E2E tests serve as a **production health monitor** rather than development validation. They ensure:

- The live site is accessible and functional
- Core user journeys work as expected
- Social media integration remains intact
- Page performance and rendering are acceptable
