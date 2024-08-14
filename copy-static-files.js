const fs = require('node:fs');
const path = require('node:path');

const staticDir = path.join(__dirname, 'static');
const distDir = path.join(__dirname, 'dist');

function copyFiles(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    console.error(`Error: The target directory '${targetDir}' does not exist`);
    process.exit(1);
  }

  fs.readdir(sourceDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      fs.copyFile(sourcePath, targetPath, err => {
        if (err) throw err;
        console.log(`Copied ${file} to ${targetPath}`);
      });
    });
  });
}

copyFiles(staticDir, distDir);
