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

/* -------------------------------- assets --------------------------------- */

/* The design references local files (e.g. a sponsor's flyer) as assets/…, but a
   handoff .zip does not always carry the assets/ folder — and a missing one is
   invisible until someone opens the page and finds a broken image. So: copy
   assets/ from the handoff when it is there, fall back to the copies kept in
   app/assets/, and fail loudly if the design references a file neither has. */

const DOCS_ASSETS = path.join(DOCS, 'assets');
const REPO_ASSETS = path.resolve(__dirname, 'assets');
const HANDOFF_ASSETS = path.join(srcDir, 'assets');

fs.mkdirSync(DOCS_ASSETS, { recursive: true });

// Media only — app/assets/ also holds a README explaining what is in it.
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|woff2?)$/i;

function copyAssetsFrom(dir) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const f of fs.readdirSync(dir)) {
    const from = path.join(dir, f);
    if (MEDIA.test(f) && fs.statSync(from).isFile()) {
      fs.copyFileSync(from, path.join(DOCS_ASSETS, f));
      n++;
    }
  }
  return n;
}

// Repo copies first, so anything the handoff ships wins over a stale fallback.
const fromRepo = copyAssetsFrom(REPO_ASSETS);
const fromHandoff = copyAssetsFrom(HANDOFF_ASSETS);

/* ------------------------- dead photo substitutions ----------------------- */

/* Nine of the design's photo slots point at Unsplash IDs that no longer
   resolve, so the vehicle, furniture, produce and car-hire listings render as
   empty grey boxes. The design marks these slots itself:

       <meta name="ext-resource-dependency" id="imgVehicle" content="https://…">

   — an image it expects the *host* to supply, with the URL only as a fallback.
   Claude Design supplies them; a static host cannot, and the fallback is dead.
   Confirmed against the Standalone export, whose bundler inlined all ~75 other
   photos and left exactly these eight unfetched.

   The replacements are the real photos for those same listings, recovered from
   that export's bundle, so the demo shows a Land Cruiser where it says Land
   Cruiser. Keyed by photo ID, not by full URL: the design requests each photo
   at half a dozen crop sizes and every one of them is dead.

   If a future design revision fixes these upstream, the IDs simply stop
   matching and nothing here fires. */

const DEAD_PHOTOS = {
  'photo-1533473359331': 'listing-vehicle-suv.jpg',   // imgVehicle / carHero0 — Toyota Land Cruiser
  'photo-1600661653561': 'listing-car-side.jpg',      // carHero1
  'photo-1613214149922': 'listing-car-wheel.jpg',     // carHero2
  'photo-1615906655593': 'listing-car-engine.jpg',    // carHero3
  'photo-1555041469':    'listing-dining-set.jpg',    // imgHome    — dining table & 6 chairs
  'photo-1601493700631': 'listing-mango-crate.jpg',   // imgMango   — fresh mango crate
  'photo-1586105251261': 'listing-bed-set.jpg',       // imgBed     — king bed set
  'photo-1541899481282': 'listing-yaris-hire.jpg'     // imgYaris   — Toyota Yaris car hire
};

/* Two spellings to catch. Most slots carry the URL in full, but the listing
   data builds its own through a helper — `img: u('photo-1601…')`, where u()
   appends the Unsplash host and a crop query — so there the photo ID appears
   on its own and the whole call has to become a string. */
const substituted = {};
function replaceDeadPhotos(html) {
  for (const [id, file] of Object.entries(DEAD_PHOTOS)) {
    const local = 'assets/' + file;
    let n = 0;

    // The URL in full, up to the closing quote or paren.
    const url = new RegExp('https://images\\.unsplash\\.com/' + id + '[^\'"\\)\\s]*', 'g');
    n += (html.match(url) || []).length;
    html = html.replace(url, local);

    // u('photo-…') / u('photo-…', 800) -> 'assets/…'
    const call = new RegExp('\\bu\\(\\s*([\'"])' + id + '[^\'"]*\\1\\s*(?:,[^)]*)?\\)', 'g');
    n += (html.match(call) || []).length;
    html = html.replace(call, "'" + local + "'");

    if (n) substituted[file] = (substituted[file] || 0) + n;
  }
  return html;
}

/* A broken image is invisible until someone opens the page on their phone, so
   both halves are checked before anything is written: every assets/… path the
   built page asks for must exist, and no dead photo ID may survive. The second
   check is what catches a spelling replaceDeadPhotos does not yet know about. */
function checkAssets(html, page) {
  const missing = [...new Set([...html.matchAll(/assets\/([A-Za-z0-9._-]+)/g)].map(m => m[1]))]
    .filter(f => !fs.existsSync(path.join(DOCS_ASSETS, f)));
  if (missing.length) {
    console.error('\nMissing asset(s) referenced by ' + page + ': ' + missing.join(', '));
    console.error('Put them in app/assets/ (or ship an assets/ folder in the handoff)');
    console.error('and re-run — refusing to publish a page with broken images.');
    process.exit(1);
  }

  const survivors = Object.keys(DEAD_PHOTOS).filter(id => html.includes(id));
  if (survivors.length) {
    console.error('\nDead photo ID still in ' + page + ': ' + survivors.join(', '));
    console.error('It is written in a form replaceDeadPhotos() does not match — find the');
    console.error('call site and add the spelling, rather than shipping a broken image.');
    process.exit(1);
  }
}

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
  html = replaceDeadPhotos(html);
  if (inject) html = html.replace(/<\/body>/i, inject + '</body>');
  checkAssets(html, 'docs/' + name);
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

console.log('\nAssets: ' + fromRepo + ' from app/assets/, ' + fromHandoff + ' from the handoff'
  + ' -> docs/assets/');
const subCount = Object.keys(substituted).length;
if (subCount) {
  console.log('Substituted ' + subCount + ' dead Unsplash photo(s) with local copies:');
  for (const [f, n] of Object.entries(substituted)) {
    console.log('  ' + f.padEnd(26) + n + ' reference(s) per page');
  }
} else {
  console.log('No dead Unsplash photos matched — the design may have fixed them upstream.');
}

console.log('\nThe remaining photos are remote Unsplash URLs, as a handoff bundle ships them,');
console.log('so these pages need a connection for imagery. A Standalone export inlines them.');
