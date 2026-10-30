import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildLighthouseSummary,
  formatScore,
  loadLighthouseSummary,
  pageLabel,
} from '../../scripts/lighthouse-job-summary.ts';

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
    const reportDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'lighthouse-summary-'),
    );
    const representativePath = path.join(reportDir, 'home.report.json');
    fs.writeFileSync(
      representativePath,
      JSON.stringify({
        lighthouseVersion: '12.6.1',
        audits: {
          'first-contentful-paint': { displayValue: '0.9 s' },
          'largest-contentful-paint': { displayValue: '0.9 s' },
          'total-blocking-time': { displayValue: '0 ms' },
          'cumulative-layout-shift': { displayValue: '0' },
          'speed-index': { displayValue: '1.1 s' },
        },
      }),
    );
    fs.writeFileSync(
      path.join(reportDir, 'manifest.json'),
      JSON.stringify([
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
      ]),
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
    const reportDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'lighthouse-summary-'),
    );
    const summaryPath = path.join(reportDir, 'step-summary.md');
    fs.writeFileSync(
      path.join(reportDir, 'page.report.json'),
      JSON.stringify({
        lighthouseVersion: '12.6.1',
        audits: {
          'first-contentful-paint': { displayValue: '0.8 s' },
          'largest-contentful-paint': { displayValue: '0.8 s' },
          'total-blocking-time': { displayValue: '0 ms' },
          'cumulative-layout-shift': { displayValue: '0' },
          'speed-index': { displayValue: '0.9 s' },
        },
      }),
    );
    fs.writeFileSync(
      path.join(reportDir, 'manifest.json'),
      JSON.stringify([
        {
          url: 'http://localhost/en/index.html',
          isRepresentativeRun: true,
          jsonPath: path.join(reportDir, 'page.report.json'),
          summary: {
            performance: 1,
            accessibility: 1,
            'best-practices': 1,
            seo: 1,
          },
        },
      ]),
    );

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
