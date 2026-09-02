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

/* ---------------- shared runtime helpers, injected into every page --------- */

// Finds the two mocks the design draws. The phone is the 390x844 frame; the web
// mock is #webAppScaleBox, which the design gives a stable id.
const FINDERS = `
  function findPhone() {
    var divs = document.querySelectorAll('section div');
    for (var i = 0; i < divs.length; i++) {
      var st = divs[i].getAttribute('style') || '';
      if (/width:\\s*390px/.test(st) && /height:\\s*844px/.test(st)) return divs[i];
    }
    return null;
  }
  function webBox() { return document.getElementById('webAppScaleBox'); }
  // The caption and the mock share a parent; hiding it removes both.
  function webWrap() {
    var b = webBox();
    return b && b.parentElement ? b.parentElement.parentElement : null;
  }
  function stage(el) { return el && el.closest ? el.closest('section') : null; }
  function addCss(id, css) {
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id; s.textContent = css;
    document.head.appendChild(s);
  }
  var NO_SCROLLBARS =
    '* { scrollbar-width: none; -ms-overflow-style: none; }' +
    '*::-webkit-scrollbar { display: none; width: 0; height: 0; }';
`;

// The design renders asynchronously, so poll until the frames appear.
function wrapRuntime(body) {
  return `
<script>
(function () {
  'use strict';
${FINDERS}
  function apply() {
${body}
  }
  if (apply()) return;
  var tries = 0;
  var t = setInterval(function () { if (apply() || ++tries > 100) clearInterval(t); }, 100);
})();
</script>
`;
}

/* ------------------------------- variants -------------------------------- */

// Phone only, filling a real handset.
const PHONE = wrapRuntime(`
    var phone = findPhone();
    if (!phone) return false;
    var wrap = webWrap();
    if (wrap) wrap.style.display = 'none';
    phone.id = 'emPhoneFrame';
    var sec = stage(phone);
    if (sec) sec.id = 'emStage';
    addCss('emPhoneCss', [
      '#emStage { padding: 30px 20px !important; min-height: 100vh; }',
      NO_SCROLLBARS,
      '@media (max-width: 700px) {',
      '  body { background: #FBF8F1 !important; }',
      '  #emStage { padding: 0 !important; min-height: 100vh; min-height: 100dvh; }',
      '  #emPhoneFrame {',
      '    width: 100vw !important; max-width: none !important;',
      '    height: 100vh !important; height: 100dvh !important;',
      '    border-radius: 0 !important; box-shadow: none !important;',
      '  }',
      '}'
    ].join('\\n'));
    return true;
`);

// Web only, filling the browser. Drops the browser-window mock and the 0.625
// shrink the design uses to fit the web view onto its canvas.
const WEB = wrapRuntime(`
    var box = webBox();
    var phone = findPhone();
    if (!box || !phone) return false;
    phone.style.display = 'none';

    var sec = stage(box);
    if (sec) sec.id = 'emStage';
    box.id = 'webAppScaleBox';

    // The caption above the mock ("Web app (PWA) version — …") is canvas
    // furniture, not part of the product.
    var wrap = webWrap();
    if (wrap) {
      for (var i = 0; i < wrap.children.length; i++) {
        var c = wrap.children[i];
        if (c !== box.parentElement && /Web app/i.test(c.textContent || '')) c.style.display = 'none';
      }
      wrap.style.width = '100%';
      wrap.style.marginTop = '0';
    }
    if (box.parentElement) {
      box.parentElement.style.width = '100%';
      box.parentElement.style.maxWidth = 'none';
    }

    // The first child is the drawn browser chrome (title bar + address bar).
    // Redundant inside a real browser, so drop it — but only if it looks like
    // the chrome, so an unexpected structure leaves the page intact.
    var first = box.firstElementChild;
    if (first && /#E7E4DD/i.test(first.getAttribute('style') || '')) first.style.display = 'none';

    addCss('emWebCss', [
      'body { background: #F7F6F2 !important; }',
      '#emStage { padding: 0 !important; display: block !important; min-height: 100vh; }',
      NO_SCROLLBARS,
      '#webAppScaleBox {',
      '  zoom: 1 !important; width: 100% !important; max-width: none !important;',
      '  border-radius: 0 !important; box-shadow: none !important;',
      '}'
    ].join('\\n'));
    return true;
`);

// Both mocks, as the design draws them — just without scrollbars.
const BOTH = wrapRuntime(`
    var phone = findPhone();
    if (!phone) return false;
    addCss('emBothCss', NO_SCROLLBARS);
    return true;
`);

/* -------------------------------- writing -------------------------------- */

const META = `
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0E3F80">
  <meta name="description" content="Buy, sell, find work and book travel across Montserrat.">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`;

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
