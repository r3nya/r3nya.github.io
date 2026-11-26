import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildLighthouseSummary,
  formatScore,
  loadLighthouseSummary,
  pageLabel,
} from '../../scripts/lighthouse-job-summary.ts';

interface ManifestEntry {
  url: string;
  isRepresentativeRun: boolean;
  jsonPath: string;
  summary: Partial<Record<string, number>>;
}

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

function createReportFixture(
  reportFile: string,
  metrics: {
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
    speedIndex: string;
  },
  entries: (reportPath: string) => ManifestEntry[],
): string {
  const reportDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'lighthouse-summary-'),
  );
  tempDirs.push(reportDir);
  const reportPath = path.join(reportDir, reportFile);
  fs.writeFileSync(
    reportPath,
    JSON.stringify({
      lighthouseVersion: '12.6.1',
      audits: {
        'first-contentful-paint': { displayValue: metrics.fcp },
        'largest-contentful-paint': { displayValue: metrics.lcp },
        'total-blocking-time': { displayValue: metrics.tbt },
        'cumulative-layout-shift': { displayValue: metrics.cls },
        'speed-index': { displayValue: metrics.speedIndex },
      },
    }),
  );
  fs.writeFileSync(
    path.join(reportDir, 'manifest.json'),
    JSON.stringify(entries(reportPath)),
  );
  return reportDir;
}

describe('Lighthouse job summary', () => {
  it('renders locale routes as page paths', () => {
    expect(pageLabel('http://localhost:63228/index.html')).toBe('/');
    expect(pageLabel('http://localhost:63228/en/index.html')).toBe('/en/');
    expect(pageLabel('http://localhost:63228/ru/index.html')).toBe('/ru/');
    expect(pageLabel('http://localhost:63228/es/index.html')).toBe('/es/');
  });

  it('renders category scores as percentages', () => {
    expect(formatScore(1)).toBe('100');
    expect(formatScore(0.994)).toBe('99');
    expect(formatScore(null)).toBe('—');
  });

  it('renders the job summary table', () => {
    const summary = buildLighthouseSummary({
      profile: 'mobile',
      lighthouseVersion: '12.6.1',
      artifactName: 'lighthouse-mobile',
      runUrl:
        'https://github.com/r3nya/r3nya.github.io/actions/runs/1#artifacts',
      pages: [
        {
          path: '/',
          performance: '100',
          accessibility: '100',
          bestPractices: '100',
          seo: '100',
          fcp: '0.9 s',
          lcp: '0.9 s',
          tbt: '0 ms',
          cls: '0',
          speedIndex: '1.1 s',
        },
        {
          path: '/ru/',
          performance: '99',
          accessibility: '100',
          bestPractices: '100',
          seo: '100',
          fcp: '1.0 s',
          lcp: '1.2 s',
          tbt: '10 ms',
          cls: '0.01',
          speedIndex: '1.3 s',
        },
      ],
    });

    expect(summary).toContain('### Lighthouse (mobile)');
    expect(summary).toContain(
      'Lighthouse 12.6.1. Full HTML and JSON reports are in the `lighthouse-mobile` artifact ([download](https://github.com/r3nya/r3nya.github.io/actions/runs/1#artifacts)).',
    );
    expect(summary).toContain(
      '| / | 100 | 100 | 100 | 100 | 0.9 s | 0.9 s | 0 ms | 0 | 1.1 s |',
    );
    expect(summary).toContain(
      '| /ru/ | 99 | 100 | 100 | 100 | 1.0 s | 1.2 s | 10 ms | 0.01 | 1.3 s |',
    );
  });

  it('reads representative reports from the manifest', () => {
    const reportDir = createReportFixture(
      'home.report.json',
      {
        fcp: '0.9 s',
        lcp: '0.9 s',
        tbt: '0 ms',
        cls: '0',
        speedIndex: '1.1 s',
      },
      () => [
        {
          url: 'http://localhost/es/index.html',
          isRepresentativeRun: false,
          jsonPath: '/missing/ignored.report.json',
          summary: { performance: 0.5 },
        },
        {
          url: 'http://localhost/index.html',
          isRepresentativeRun: true,
          jsonPath: '/moved/home.report.json',
          summary: {
            performance: 1,
            accessibility: 1,
            'best-practices': 1,
            seo: 1,
          },
        },
      ],
    );

    expect(loadLighthouseSummary(reportDir)).toEqual({
      lighthouseVersion: '12.6.1',
      pages: [
        {
          path: '/',
          performance: '100',
          accessibility: '100',
          bestPractices: '100',
          seo: '100',
          fcp: '0.9 s',
          lcp: '0.9 s',
          tbt: '0 ms',
          cls: '0',
          speedIndex: '1.1 s',
        },
      ],
    });
  });

  it('appends the summary for the Actions run page', () => {
    const reportDir = createReportFixture(
      'page.report.json',
      {
        fcp: '0.8 s',
        lcp: '0.8 s',
        tbt: '0 ms',
        cls: '0',
        speedIndex: '0.9 s',
      },
      (reportPath) => [
        {
          url: 'http://localhost/en/index.html',
          isRepresentativeRun: true,
          jsonPath: reportPath,
          summary: {
            performance: 1,
            accessibility: 1,
            'best-practices': 1,
            seo: 1,
          },
        },
      ],
    );
    const summaryPath = path.join(reportDir, 'step-summary.md');

    const result = spawnSync(
      'node',
      ['scripts/lighthouse-job-summary.ts', reportDir, 'lighthouse-desktop'],
      {
        cwd: path.resolve(import.meta.dirname, '../..'),
        env: {
          ...process.env,
          GITHUB_STEP_SUMMARY: summaryPath,
          GITHUB_REPOSITORY: 'r3nya/r3nya.github.io',
          GITHUB_RUN_ID: '41123867976',
        },
        encoding: 'utf8',
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('### Lighthouse');
    expect(result.stdout).toContain('| /en/ | 100 | 100 | 100 | 100 |');
    expect(fs.readFileSync(summaryPath, 'utf8')).toBe(result.stdout);
  });
});
