/* Turn a Claude Design "Standalone" export into the published phone demo.

       node app/from-export.js <path-to-export.html>

   Writes docs/phone.html.

   The export is already a working build of the design: the canvas runtime, the
   screens, the logic and every photo are inlined in one file, so it needs no
   network and no porting. What it is *not* is phone-shaped — it renders the
   phone mock and the web mock stacked on one page. This script trims it to the
   phone alone and makes that phone fill a real handset.

   Nothing here rewrites the design's own markup. Everything is applied at
   runtime by a small script appended to the body, so re-running it against a
   fresh export always works, however the design has changed inside. */

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

let html = fs.readFileSync(src, 'utf8');
const srcKb = Math.round(Buffer.byteLength(html) / 1024);

// The export ships <title>Bundled Page</title>; this is what shows in the tab
// and in a link preview, so it needs to be the product name.
html = html.replace(/<title>[^<]*<\/title>/i, '<title>Emerald Marketplace — Montserrat, West Indies</title>');

// Viewport + web-app meta, so "Add to Home Screen" opens it without browser
// chrome. The export has none of this — it was built to be viewed on a desktop.
const META = `
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0E3F80">
  <meta name="description" content="Buy, sell, find work and book travel across Montserrat.">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`;
html = html.replace(/<meta charset="utf-8">/i, '<meta charset="utf-8">' + META);

// Runtime trim. The design renders asynchronously, so poll until the phone
// frame exists rather than assuming it's there at DOMContentLoaded.
const TRIM = `
<script>
(function () {
  'use strict';

  function apply() {
    // The web-app mock sits in a wrapper alongside its "Web app (PWA) version"
    // caption; #webAppScaleBox is the stable handle on it.
    var box = document.getElementById('webAppScaleBox');
    var phone = null;

    // The phone is the 390px-wide frame the design draws the app inside.
    var divs = document.querySelectorAll('section > div, section div');
    for (var i = 0; i < divs.length; i++) {
      var st = divs[i].getAttribute('style') || '';
      if (/width:\\s*390px/.test(st) && /height:\\s*844px/.test(st)) { phone = divs[i]; break; }
    }
    if (!phone) return false;

    if (box && box.parentElement && box.parentElement.parentElement) {
      box.parentElement.parentElement.style.display = 'none';
    }
    phone.id = 'emPhoneFrame';

    var sec = phone.closest ? phone.closest('section') : null;
    if (sec) sec.id = 'emStage';

    if (!document.getElementById('emPhoneCss')) {
      var s = document.createElement('style');
      s.id = 'emPhoneCss';
      s.textContent = [
        // Desktop: leave the device frame, just tighten the padding now that
        // there is nothing below it.
        '#emStage { padding: 30px 20px !important; min-height: 100vh; }',
        // Scrollbars off — they break the illusion of a device.
        '* { scrollbar-width: none; -ms-overflow-style: none; }',
        '*::-webkit-scrollbar { display: none; width: 0; height: 0; }',
        // Phone: drop the frame and fill the screen. dvh tracks the browser's
        // collapsing address bar; vh is the fallback for older engines.
        '@media (max-width: 700px) {',
        '  body { background: #FBF8F1 !important; }',
        '  #emStage { padding: 0 !important; min-height: 100vh; min-height: 100dvh; }',
        '  #emPhoneFrame {',
        '    width: 100vw !important; max-width: none !important;',
        '    height: 100vh !important; height: 100dvh !important;',
        '    border-radius: 0 !important; box-shadow: none !important;',
        '  }',
        '}'
      ].join('\\n');
      document.head.appendChild(s);
    }
    return true;
  }

  if (apply()) return;
  var tries = 0;
  var t = setInterval(function () {
    if (apply() || ++tries > 100) clearInterval(t);
  }, 100);
})();
</script>
`;

if (!/<\/body>/i.test(html)) {
  console.error('Export has no </body> — cannot inject. Aborting rather than writing a broken page.');
  process.exit(1);
}
html = html.replace(/<\/body>/i, TRIM + '</body>');

const out = path.resolve(__dirname, '..', 'docs', 'phone.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);

console.log('Read  ' + src + '  (' + srcKb + ' KB)');
console.log('Wrote docs/phone.html  (' + Math.round(fs.statSync(out).size / 1024) + ' KB)');
