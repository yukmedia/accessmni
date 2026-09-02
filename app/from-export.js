/* Turn a Claude Design "Standalone" export into the published demo pages.

       node app/from-export.js <path-to-export.html>

   Writes docs/phone.html, docs/index.html and docs/phone-and-web.html.

   The export is already a working build of the design: the canvas runtime, the
   screens, the logic and every photo are inlined in one file, so it needs no
   network and no porting. What it is *not* is shaped for delivery — it renders
   the phone mock and the web mock stacked on one page, sized for a designer's
   canvas. This script cuts that one page into the three we publish.

   Nothing here rewrites the design's own markup. Everything is applied at
   runtime by a script appended to the body, so a fresh export always works
   however the design has changed inside. If the design's structure moves far
   enough that the handles below stop matching, the page still renders — it just
   renders untrimmed, which is visibly wrong rather than silently broken. */

const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node app/from-export.js <path-to-standalone-export.html>');
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error('No such file: ' + src);
  process.exit(1);
}

const raw = fs.readFileSync(src, 'utf8');
const srcKb = Math.round(Buffer.byteLength(raw) / 1024);

if (!/<\/body>/i.test(raw)) {
  console.error('Export has no </body> — cannot inject. Aborting rather than writing a broken page.');
  process.exit(1);
}

// Warn rather than fail: an unresolved <dc-import> means a design the export
// did not inline, which renders as an empty panel in the published page.
// The markup is embedded as a JSON string, so quotes arrive escaped (\") and
// the closing tag's slash as /. Match the plain and escaped forms both.
// An import with nothing between its tags is one the export did not resolve.
const imports = [...raw.matchAll(/<dc-import[^>]*?name=\\?"([^"\\]+)\\?"[^>]*?>\s*(?:<\\u002F|<\/)dc-import>/g)]
  .map(m => m[1])
  .filter((v, i, a) => a.indexOf(v) === i);

const T = require('./lib/dc-transform');

const { META, PHONE, WEB, BOTH } = T;

/* -------------------------------- writing -------------------------------- */


function write(outName, inject) {
  // The export ships <title>Bundled Page</title>; that is what shows in the tab
  // and in a link preview, so it has to be the product name.
  let html = raw.replace(/<title>[^<]*<\/title>/i, '<title>Emerald Marketplace — Montserrat, West Indies</title>');
  html = html.replace(/<meta charset="utf-8">/i, '<meta charset="utf-8">' + META);
  html = html.replace(/<\/body>/i, inject + '</body>');

  const out = path.resolve(__dirname, '..', 'docs', outName);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('  docs/' + outName.padEnd(20) + Math.round(fs.statSync(out).size / 1024) + ' KB');
}

console.log('Read ' + src + '  (' + srcKb + ' KB)');
if (imports.length) {
  console.log('\n!! Unresolved <dc-import>: ' + imports.join(', '));
  console.log('   That design was not inlined in this export and will render as an');
  console.log('   empty panel. Re-export with it merged in, or expect a blank section.\n');
}
write('phone.html', PHONE);
write('index.html', WEB);
write('phone-and-web.html', BOTH);
