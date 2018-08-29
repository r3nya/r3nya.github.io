importScripts('/js/sw-toolbox.js');

toolbox.options.debug = true;
toolbox.precache([
  '/index.html',
  '/css/style.css',
  '/fonts/fontawesome-webfont.woff',
  '/fonts/fontawesome-webfont.woff2'
]);
toolbox.router.get('/', toolbox.fastest);
