const nunjucks = require('nunjucks');
const fs = require('node:fs');
const path = require('node:path');

const env = nunjucks.configure('src', {
  autoescape: true,
  throwOnUndefined: false
});

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const context = {
  env: {
    NODE_ENV: nodeEnv,
    isProduction: isProduction,
    isDevelopment: !isProduction
  }
};

try {
  const html = env.render('index.njk', context);
  fs.writeFileSync(path.join(distDir, 'index.html'), html);
  console.log('✅ HTML built successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
