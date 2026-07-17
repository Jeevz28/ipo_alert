
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 1,
    "route": "/dashboard"
  },
  {
    "renderMode": 1,
    "route": "/ipos"
  },
  {
    "renderMode": 1,
    "route": "/alerts"
  },
  {
    "renderMode": 1,
    "route": "/notifications"
  },
  {
    "renderMode": 1,
    "route": "/profile"
  },
  {
    "renderMode": 1,
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 61919, hash: '51bedc889e2a15b499c0e60f7c17be15daf57ac4cd8a73dffe6b188da0b7c199', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1023, hash: 'eaf5c456fe80abb317a6d6afef3ddf9fa55ba13769b24ae001977db280408aa1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 122464, hash: 'fcaaff04f67b4c797c9b2387bf563c40db390b07832b807a1491f8bca3fa883a', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-TX7MBPCO.css': {size: 147892, hash: '7B67odfP2Vk', text: () => import('./assets-chunks/styles-TX7MBPCO_css.mjs').then(m => m.default)}
  },
};
