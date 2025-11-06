import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { chromium, type Browser, type Page } from 'playwright';

const SNAPSHOTS_DIR = join(process.cwd(), 'src/test/__visual_snapshots__');
const DIFF_DIR = join(process.cwd(), 'src/test/__visual_diffs__');

// Ensure directories exist
if (!existsSync(SNAPSHOTS_DIR)) {
  mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}
if (!existsSync(DIFF_DIR)) {
  mkdirSync(DIFF_DIR, { recursive: true });
}

export interface VisualRegressionOptions {
  threshold?: number; // Pixel difference threshold (0-1), default 0.1
  updateSnapshots?: boolean; // Update snapshots instead of comparing
}

export class VisualRegressionTester {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async setup(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
    });
    this.page = await this.browser.newPage({
      viewport: { width: 1280, height: 720 },
      javaScriptEnabled: false,
    });
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  async captureScreenshot(
    html: string,
    snapshotName: string,
    options: VisualRegressionOptions = {},
  ): Promise<{ pass: boolean; diffPixels?: number; diffPercentage?: number }> {
    if (!this.page) {
      throw new Error('Page not initialized. Call setup() first.');
    }

    const {
      threshold = 0.1,
      updateSnapshots = process.env.UPDATE_SNAPSHOTS === 'true',
    } = options;

    // Set the HTML content
    await this.page.setContent(html, { waitUntil: 'load' });

    // Take screenshot
    const screenshot = await this.page.screenshot({ fullPage: true });
    const currentImage = PNG.sync.read(screenshot);

    const snapshotPath = join(SNAPSHOTS_DIR, `${snapshotName}.png`);

    // If updating snapshots, save and return
    if (updateSnapshots || !existsSync(snapshotPath)) {
      writeFileSync(snapshotPath, PNG.sync.write(currentImage));
      return { pass: true };
    }

    // Compare with existing snapshot
    const baselineBuffer = readFileSync(snapshotPath);
    const baselineImage = PNG.sync.read(baselineBuffer);

    // Ensure images have the same dimensions
    if (
      currentImage.width !== baselineImage.width ||
      currentImage.height !== baselineImage.height
    ) {
      throw new Error(
        `Image dimensions mismatch: current (${currentImage.width}x${currentImage.height}) vs baseline (${baselineImage.width}x${baselineImage.height})`,
      );
    }

    // Create diff image
    const diff = new PNG({
      width: currentImage.width,
      height: currentImage.height,
    });

    // Compare images
    const diffPixels = pixelmatch(
      currentImage.data,
      baselineImage.data,
      diff.data,
      currentImage.width,
      currentImage.height,
      { threshold },
    );

    const totalPixels = currentImage.width * currentImage.height;
    const diffPercentage = (diffPixels / totalPixels) * 100;

    // Save diff if there are differences
    if (diffPixels > 0) {
      const diffPath = join(DIFF_DIR, `${snapshotName}-diff.png`);
      writeFileSync(diffPath, PNG.sync.write(diff));
    }

    return {
      pass: diffPixels === 0,
      diffPixels,
      diffPercentage,
    };
  }
}

/**
 * Convenience function to test visual regression
 */
export async function testVisualRegression(
  html: string,
  snapshotName: string,
  options?: VisualRegressionOptions,
): Promise<{ pass: boolean; diffPixels?: number; diffPercentage?: number }> {
  const tester = new VisualRegressionTester();
  await tester.setup();
  try {
    return await tester.captureScreenshot(html, snapshotName, options);
  } finally {
    await tester.cleanup();
  }
}
