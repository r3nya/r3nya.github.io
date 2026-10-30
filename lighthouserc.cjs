const { chromium } = require('playwright');

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      chromePath: process.env.CHROME_PATH ?? chromium.executablePath(),
      numberOfRuns: 1,
      maxAutodiscoverUrls: 0,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'filesystem',
    },
  },
};
