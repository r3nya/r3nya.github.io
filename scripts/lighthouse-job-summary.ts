import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

interface LighthousePageSummary {
  path: string;
  performance: string;
  accessibility: string;
  bestPractices: string;
  seo: string;
  fcp: string;
  lcp: string;
  tbt: string;
  cls: string;
  speedIndex: string;
}

interface SummaryInput {
  profile: string;
  lighthouseVersion: string;
  pages: LighthousePageSummary[];
  artifactName?: string;
  runUrl?: string;
}

const METRIC_IDS = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function pageLabel(url: string): string {
  const pathname = new URL(url).pathname;
  if (pathname === '/' || pathname === '/index.html') {
    return '/';
  }
  return pathname.replace(/index\.html$/, '');
}

export function formatScore(score: unknown): string {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    return '—';
  }
  return String(Math.round(score * 100));
}

function tableCell(value: string): string {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function metricValue(report: Record<string, unknown>, auditId: string): string {
  const audits = report.audits;
  if (!isRecord(audits)) {
    return '—';
  }
  const audit = audits[auditId];
  if (
    !isRecord(audit) ||
    typeof audit.displayValue !== 'string' ||
    audit.displayValue.length === 0
  ) {
    return '—';
  }
  return audit.displayValue;
}

function scoreValue(summary: unknown, key: string): string {
  if (!isRecord(summary)) {
    return '—';
  }
  return formatScore(summary[key]);
}

function resolveReportPath(reportDir: string, jsonPath: unknown): string {
  if (typeof jsonPath !== 'string' || jsonPath.length === 0) {
    throw new Error(
      `Lighthouse manifest in ${reportDir} is missing a JSON report path`,
    );
  }
  if (fs.existsSync(jsonPath)) {
    return jsonPath;
  }
  const fallback = path.join(reportDir, path.basename(jsonPath));
  if (fs.existsSync(fallback)) {
    return fallback;
  }
  throw new Error(`Missing Lighthouse JSON report: ${jsonPath}`);
}

export function loadLighthouseSummary(reportDir: string): {
  lighthouseVersion: string;
  pages: LighthousePageSummary[];
} {
  const manifestPath = path.join(reportDir, 'manifest.json');
  const manifest: unknown = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest)) {
    throw new Error(`Expected an array in ${manifestPath}`);
  }

  let lighthouseVersion = '';
  const pages: LighthousePageSummary[] = [];

  for (const entry of manifest) {
    if (!isRecord(entry) || entry.isRepresentativeRun === false) {
      continue;
    }
    if (typeof entry.url !== 'string') {
      throw new Error(`Lighthouse manifest in ${reportDir} is missing a URL`);
    }

    const report: unknown = JSON.parse(
      fs.readFileSync(resolveReportPath(reportDir, entry.jsonPath), 'utf8'),
    );
    if (!isRecord(report)) {
      throw new Error(`Lighthouse report for ${entry.url} is not an object`);
    }
    if (
      lighthouseVersion.length === 0 &&
      typeof report.lighthouseVersion === 'string'
    ) {
      lighthouseVersion = report.lighthouseVersion;
    }

    pages.push({
      path: pageLabel(entry.url),
      performance: scoreValue(entry.summary, 'performance'),
      accessibility: scoreValue(entry.summary, 'accessibility'),
      bestPractices: scoreValue(entry.summary, 'best-practices'),
      seo: scoreValue(entry.summary, 'seo'),
      fcp: metricValue(report, METRIC_IDS[0]),
      lcp: metricValue(report, METRIC_IDS[1]),
      tbt: metricValue(report, METRIC_IDS[2]),
      cls: metricValue(report, METRIC_IDS[3]),
      speedIndex: metricValue(report, METRIC_IDS[4]),
    });
  }

  return { lighthouseVersion, pages };
}

export function buildLighthouseSummary(input: SummaryInput): string {
  const version =
    input.lighthouseVersion.length > 0
      ? `Lighthouse ${input.lighthouseVersion}`
      : 'Lighthouse';
  const lines = [`### Lighthouse (${input.profile})`, '', version];

  if (input.artifactName) {
    const artifact = `Full HTML and JSON reports are in the \`${input.artifactName}\` artifact`;
    lines[2] = input.runUrl
      ? `${version}. ${artifact} ([download](${input.runUrl})).`
      : `${version}. ${artifact}.`;
  }

  lines.push(
    '',
    '| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  );

  for (const page of input.pages) {
    lines.push(
      `| ${tableCell(page.path)} | ${tableCell(page.performance)} | ${tableCell(page.accessibility)} | ${tableCell(page.bestPractices)} | ${tableCell(page.seo)} | ${tableCell(page.fcp)} | ${tableCell(page.lcp)} | ${tableCell(page.tbt)} | ${tableCell(page.cls)} | ${tableCell(page.speedIndex)} |`,
    );
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

function runUrlFromEnv(): string | undefined {
  const repository = process.env.GITHUB_REPOSITORY;
  const runId = process.env.GITHUB_RUN_ID;
  if (!repository || !runId) {
    return undefined;
  }
  return `https://github.com/${repository}/actions/runs/${runId}#artifacts`;
}

function main(): void {
  const reportDir = process.argv[2];
  const artifactName = process.argv[3];
  if (!reportDir) {
    throw new Error(
      'Usage: node scripts/lighthouse-job-summary.ts <report-dir> [artifact-name]',
    );
  }

  const { lighthouseVersion, pages } = loadLighthouseSummary(reportDir);
  if (pages.length === 0) {
    throw new Error(`No Lighthouse results in ${reportDir}`);
  }

  const markdown = buildLighthouseSummary({
    profile: path.basename(path.resolve(reportDir)),
    lighthouseVersion,
    pages,
    artifactName,
    runUrl: runUrlFromEnv(),
  });

  process.stdout.write(markdown);
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    fs.appendFileSync(summaryPath, markdown);
  }
}

const invokedPath = process.argv[1];
if (
  invokedPath !== undefined &&
  import.meta.url === pathToFileURL(invokedPath).href
) {
  main();
}
