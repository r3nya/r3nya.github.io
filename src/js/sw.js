importScripts('/js/sw-toolbox.js');

toolbox.options.debug = true;
toolbox.precache([
  '/index.html',
  '/css/style.css',
  '/fonts/fontello.woff',
  '/fonts/fontello.woff2'
]);
toolbox.router.get('/', toolbox.fastest);