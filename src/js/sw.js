importScripts('/js/sw-toolbox.js');

toolbox.options.debug = true;
toolbox.precache([
  '/index.html',
  '/css/style.css',
  '/fonts/fontello.woff',
  '/fonts/fontello.woff2',
  '/fonts/karla-latin-400.woff',
  '/fonts/karla-latin-400.woff2',
  '/fonts/karla-latin-700.woff',
  '/fonts/karla-latin-700.woff2',
]);
toolbox.router.get('/', toolbox.fastest);
