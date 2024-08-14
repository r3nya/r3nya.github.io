const fs = require('node:fs/promises');
const path = require('node:path');

const staticDir = path.join(__dirname, 'static');
const distDir = path.join(__dirname, 'dist');

async function copyFiles(sourceDir, targetDir) {
  try {
    await fs.access(targetDir);
  } catch (error) {
    console.error(`Error: The target directory '${targetDir}' does not exist`);
    process.exit(1);
  }

  try {
    const files = await fs.readdir(sourceDir);

    await Promise.all(files.map(async (file) => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      await fs.copyFile(sourcePath, targetPath);
      console.log(`Copied ${file} to ${targetPath}`);
    }));

    console.log('All files copied successfully');
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

copyFiles(staticDir, distDir);
