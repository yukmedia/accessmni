/* Bundle the app into one self-contained .html file.

   The split source is what you edit; the bundle is what you send. Run:
       node build.js
   Output: dist/emerald-marketplace-demo.html — open it by double-clicking,
   attach it to an email, or drop it on any static host. No build tooling and
   no server required either way.

   Photos stay as remote Unsplash URLs (they are not embedded), so the page
   needs internet the first time it is opened. Every photo has a colour behind
   it, so a page opened offline still reads correctly — just without the
   photography. */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function bundle(entry, outName) {
  let html = read(entry);

  // Inline the stylesheet.
  html = html.replace(
    /<link rel="stylesheet" href="(css\/[^"]+)">/g,
    (_, href) => '<style>\n' + read(href) + '</style>'
  );

  // Inline every local script, in order. Remote <script src> (there are none
  // today) would be left alone by the `js/` prefix in the pattern.
  html = html.replace(
    /<script src="(js\/[^"]+)"><\/script>/g,
    (_, src) => '<script>\n' + read(src) + '</script>'
  );

  if (/<script src="js\//.test(html) || /<link rel="stylesheet" href="css\//.test(html)) {
    console.error('Bundle still references local files — check ' + entry + ' tag formatting.');
    process.exit(1);
  }

  fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
  const out = path.join(ROOT, 'dist', outName);
  fs.writeFileSync(out, html);
  console.log('Wrote dist/' + outName + '  (' + Math.round(fs.statSync(out).size / 1024) + ' KB)');
}

// The web app on its own — the one to send a client who wants "the website".
bundle('web.html', 'emerald-marketplace-web.html');

// Phone and web side by side, for showing both platforms at once.
bundle('index.html', 'emerald-marketplace-demo.html');

// Same two files under docs/, laid out the way GitHub Pages expects: point
// Pages at the docs/ folder and index.html becomes the site's front page.
const DOCS = path.resolve(ROOT, '..', 'docs');
fs.mkdirSync(DOCS, { recursive: true });
fs.copyFileSync(path.join(ROOT, 'dist', 'emerald-marketplace-web.html'), path.join(DOCS, 'index.html'));
fs.copyFileSync(path.join(ROOT, 'dist', 'emerald-marketplace-demo.html'), path.join(DOCS, 'phone-and-web.html'));
// Stops GitHub Pages running the files through Jekyll, which ignores some paths.
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');
console.log('Wrote docs/index.html and docs/phone-and-web.html (for GitHub Pages)');
