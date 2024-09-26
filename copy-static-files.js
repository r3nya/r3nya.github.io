const fs = require('node:fs/promises');
const path = require('node:path');

const staticDir = path.join(__dirname, 'static');
const distDir = path.join(__dirname, 'dist');

async function ensureDirectoryExists(directory) {
  try {
    await fs.access(directory);
  } catch (error) {
    console.info(`Directory '${directory}' does not exist, creating it...`);
    await fs.mkdir(directory, { recursive: true });
    console.info(`Directory '${directory}' created successfully.`);
  }
}

async function copyFiles(sourceDir, targetDir) {
  try {
    await ensureDirectoryExists(targetDir);

    const files = await fs.readdir(sourceDir);

    await Promise.all(
      files.map(async (file) => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);

        await fs.copyFile(sourcePath, targetPath);
        console.info(`Copied ${file} to ${targetPath}`);
      }),
    );

    console.info("All files copied successfully");
  } catch (error) {
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
}

copyFiles(staticDir, distDir);
