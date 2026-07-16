
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
    'index.csr.html': {size: 61919, hash: '8de839c33a8d793713bd2b8cd2e51c1b460560e3e73c95d905a145a7f6904765', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1023, hash: '2b24c9b6827c32d39dfa5add3a34166f35129c2805fa7065710d5094dfc25176', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 122673, hash: 'bd34ef9997e015d02b6f5eee2f9118f842c59c69c27687d5f9deaaa0ea6c80c3', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-Q34OQUGX.css': {size: 147183, hash: 'xEy0IoZoCiU', text: () => import('./assets-chunks/styles-Q34OQUGX_css.mjs').then(m => m.default)}
  },
};
