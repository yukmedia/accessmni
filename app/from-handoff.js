/* Publish the demo from a Claude Design handoff bundle (the .zip of source
   .dc.html files), as opposed to a single "Standalone" export.

       node app/from-handoff.js <path-to-unzipped-handoff-folder>

   Writes docs/phone.html, docs/index.html, docs/phone-and-web.html,
   docs/admin.html and the runtime files they need.

   A handoff bundle is the design's *source*: each .dc.html is rendered in the
   browser by support.js. That differs from a Standalone export in three ways
   this script has to handle.

   1. The runtime pulls React from unpkg.com. A demo that breaks when a CDN
      hiccups is not worth shipping, so React is vendored alongside and the
      URLs rewritten.

   2. <dc-import name="X"> resolves through Claude Design's own component
      registry, which does not exist on a static host — the panel renders
      empty. Each import is rewritten to an <iframe> pointing at that design
      published as its own page, which is why the admin design gets
      docs/admin.html and the desktop panel loads it inline.

   3. Photos are remote Unsplash URLs rather than inlined, so these pages need
      a connection for imagery. A Standalone export embeds them instead.

   Files that are not part of the product — the pricing proposal, the backend
   notes, doc-page.js — are deliberately NOT copied. This repo is public. */

const fs = require('fs');
const path = require('path');

const T = require('./lib/dc-transform');

const srcDir = process.argv[2];
if (!srcDir) {
  console.error('Usage: node app/from-handoff.js <path-to-handoff-folder>');
  process.exit(1);
}
if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
  console.error('Not a directory: ' + srcDir);
  process.exit(1);
}

const DOCS = path.resolve(__dirname, '..', 'docs');
const VENDOR = path.join(DOCS, 'vendor');
fs.mkdirSync(VENDOR, { recursive: true });

/* ------------------------- locate the design files ------------------------ */

const files = fs.readdirSync(srcDir);
const findOne = (re, label) => {
  const hit = files.filter(f => re.test(f));
  if (!hit.length) { console.error('Could not find ' + label + ' in ' + srcDir); process.exit(1); }
  return path.join(srcDir, hit[0]);
};

const mainFile = findOne(/client share\.dc\.html$/i, 'the Client Share design');
const adminFile = files.filter(f => /admin\.dc\.html$/i.test(f))[0];
const supportFile = findOne(/^support\.js$/, 'support.js');
const imageSlotFile = files.filter(f => /^image-slot\.js$/.test(f))[0];

console.log('Main design : ' + path.basename(mainFile));
console.log('Admin design: ' + (adminFile || '(none — desktop admin panel will be empty)'));

/* ----------------------------- runtime files ----------------------------- */

// React is vendored so the published pages do not depend on unpkg being up.
const REACT_SRC = [
  path.resolve(__dirname, '..', 'node_modules', 'react', 'umd', 'react.production.min.js'),
  path.resolve(__dirname, '..', 'node_modules', 'react-dom', 'umd', 'react-dom.production.min.js')
];
const REACT_OUT = [path.join(VENDOR, 'react.js'), path.join(VENDOR, 'react-dom.js')];

let vendored = true;
REACT_SRC.forEach((s, i) => {
  if (fs.existsSync(s)) { fs.copyFileSync(s, REACT_OUT[i]); }
  else if (!fs.existsSync(REACT_OUT[i])) { vendored = false; }
});
if (!vendored) {
  console.error('\nReact UMD builds not found and not already vendored.');
  console.error('Run:  npm install react@18.3.1 react-dom@18.3.1');
  console.error('(then re-run this script) — refusing to publish pages that depend on unpkg.');
  process.exit(1);
}

// Point the runtime at the vendored copies.
let support = fs.readFileSync(supportFile, 'utf8');
const before = support;
support = support
  .replace(/https:\/\/unpkg\.com\/react@[\d.]+\/umd\/react\.production\.min\.js/g, './vendor/react.js')
  .replace(/https:\/\/unpkg\.com\/react-dom@[\d.]+\/umd\/react-dom\.production\.min\.js/g, './vendor/react-dom.js');
if (support === before) {
  console.warn('! support.js had no unpkg React URLs to rewrite — check it still boots.');
}
fs.writeFileSync(path.join(DOCS, 'support.js'), support);
if (imageSlotFile) fs.copyFileSync(path.join(srcDir, imageSlotFile), path.join(DOCS, 'image-slot.js'));

/* -------------------------------- pages ---------------------------------- */

function prepare(html) {
  // Charset first, so the page is right even when opened straight off disk.
  if (!/<meta charset/i.test(html.slice(0, 400))) {
    html = html.replace(/<head>/i, '<head>\n<meta charset="utf-8">');
  }
  html = html.replace(/<title>[^<]*<\/title>/i, '');
  html = html.replace(/<head>/i, '<head>\n<title>Access MNI — Montserrat, West Indies</title>' + T.META);
  return html;
}

// Swap each <dc-import name="X"> for an iframe of that design's own page.
function resolveImports(html) {
  return html.replace(
    /<dc-import[^>]*?name="([^"]+)"[^>]*?>\s*<\/dc-import>/g,
    (_, name) => {
      const slug = /admin/i.test(name) ? 'admin' : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return '<iframe src="./' + slug + '.html" title="' + name
        + '" style="width: 1440px; height: 940px; border: 0; display: block; background: #FBF8F1;"></iframe>';
    }
  );
}

function write(name, html, inject) {
  html = prepare(html);
  html = resolveImports(html);
  if (inject) html = html.replace(/<\/body>/i, inject + '</body>');
  const out = path.join(DOCS, name);
  fs.writeFileSync(out, html);
  console.log('  docs/' + name.padEnd(22) + Math.round(fs.statSync(out).size / 1024) + ' KB');
}

const main = fs.readFileSync(mainFile, 'utf8');

console.log('');
write('phone.html', main, T.PHONE);
write('index.html', main, T.WEB);
write('phone-and-web.html', main, T.BOTH);

if (adminFile) {
  // The admin design is a full-width dashboard with no phone frame, so it is
  // published as-is beyond the shared head fixes.
  write('admin.html', fs.readFileSync(path.join(srcDir, adminFile), 'utf8'), null);
}

console.log('  docs/support.js, docs/image-slot.js, docs/vendor/react*.js');
console.log('\nPhotos are remote Unsplash URLs in a handoff bundle — these pages need a');
console.log('connection for imagery. A Standalone export inlines them instead.');
