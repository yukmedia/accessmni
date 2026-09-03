/* Shared runtime transforms for publishing a Claude Design document.

   A design document draws its mocks on one canvas: a 390x844 phone frame and,
   below it, a browser-window mock holding the web app. That is right for
   reviewing a design and wrong for handing someone a link. These injections cut
   that one page into the three we publish.

   Everything is applied at runtime, after the design has rendered, and nothing
   rewrites the design's own markup. A fresh export therefore keeps working
   however the design changed inside — and if the design moves far enough that
   the handles below stop matching, the page still renders, just untrimmed,
   which is visibly wrong rather than silently broken.

   Used by app/from-export.js (Standalone export) and app/from-handoff.js
   (source .dc.html bundle). */

'use strict';

const META = `
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0E3F80">
  <meta name="description" content="Buy, sell, find work and book travel across Montserrat.">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`;

// Handles shared by every variant.
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

  /* Filling a real handset takes overriding the zoom as well as the size:
     _fitShells() scales the phone shell by (viewport - padding) / 390 so it
     sits inside the canvas with a margin, which on an actual phone leaves the
     app letterboxed — 366px of app in a 390px window. */
  var PHONE_FILL = [
    '  #emStage { padding: 0 !important; min-height: 100vh; min-height: 100dvh; }',
    '  #emPhoneFrame {',
    '    zoom: 1 !important; margin: 0 !important;',
    '    width: 100vw !important; max-width: none !important;',
    '    height: 100vh !important; height: 100dvh !important;',
    '    border-radius: 0 !important; box-shadow: none !important;',
    '  }'
  ].join('\\n');
`;

/* The trim has to survive the runtime, not just win a race with it.

   The design's markup is in the document at parse time, so a one-shot pass
   succeeds immediately — and is then thrown away when support.js renders over
   the top. So apply() is written to be idempotent and is run repeatedly: on a
   short interval, and again whenever the body's children change (which is what
   a re-render looks like from outside). */
function wrapRuntime(body) {
  return `
<script>
(function () {
  'use strict';
${FINDERS}
  function apply() {
${body}
  }

  /* Never break the page — but say so once. Swallowing this silently is how a
     reference to a build-time constant from inside this browser script went
     unnoticed: the ids it had already set made the transform look applied
     while the stylesheet it never reached was missing. */
  var told = false;
  function run() {
    try { apply(); } catch (e) {
      if (!told && window.console && console.error) {
        told = true;
        console.error('[dc-transform] trim failed, page left untrimmed:', e);
      }
    }
  }

  run();

  // ~20s of polling covers a slow first render on a cold connection.
  var n = 0;
  var t = setInterval(function () { run(); if (++n > 130) clearInterval(t); }, 150);

  // childList on body only: a re-render replaces body's children, while
  // apply()'s own edits are attribute changes further down, so this cannot
  // feed itself.
  if (window.MutationObserver && document.body) {
    new MutationObserver(run).observe(document.body, { childList: true });
  }
  document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
})();
</script>
`;
}

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
      '@media (max-width: 759.98px) {',
      '  body { background: #FBF8F1 !important; }',
      PHONE_FILL,
      '}'
    ].join('\\n'));
    return true;
`);

/* The design is responsive, but its breakpoints are written for the canvas.

   _fitShells() flips the web shell into its fluid mode below 760px, because on
   the canvas the shell above that is a 1440px layout scaled down to fit beside
   the phone — so it never needs to reflow. Published full-bleed that is wrong
   twice over: the shell is given the real viewport width without being told to
   reflow, and the design's overflow:hidden then *clips* the excess rather than
   scrolling it, so the loss is silent. Measured at 768px wide, 35 elements sat
   past the right edge, the worst by 412px.

   So for the web page the two constants are retuned rather than overridden:
   reflow below 1024 instead of 760, and above it scale the 1440 layout to
   exactly the viewport instead of capping at 0.625. Nothing else changes — the
   fluid rules, the 460px single-column breakpoint and the phone shell are the
   design's own. If either line stops matching, the page still renders and the
   build says so. */
const WEB_FIT = [
  {
    from: 'const narrow = w < 760;',
    to: 'const narrow = w < 1024;',
    what: 'the reflow breakpoint'
  },
  {
    from: 'const z = narrow ? 1 : Math.max(0.4, Math.min(0.625, (w - pad * 2) / 1440));',
    to: 'const z = narrow ? 1 : Math.min(1, w / 1440);',
    what: 'the wide-mode scale'
  }
];

function patchWebBreakpoints(html, report) {
  for (const { from, to, what } of WEB_FIT) {
    const n = html.split(from).length - 1;
    if (n !== 1) {
      report('! Could not retune ' + what + ' (' + n + ' matches, expected 1).');
      report('  The web page will render as the design draws it on its canvas —');
      report('  scaled down, and clipped between 760px and 1440px wide.');
      continue;
    }
    html = html.replace(from, to);
  }
  return html;
}

/* index.html is the link people actually open, and on a phone it was serving
   the desktop layout: desktop header, no bottom nav, big half-empty tiles —
   while the mobile app design sat in the same document, hidden.

   So this page carries both. Under 760px it is the phone app filling the
   screen; at 760 and up it is the web app filling the browser. Which shell
   shows is decided in CSS rather than script, so a rotation or a resize is
   instant and there is no state for a re-render to undo. Both shells are the
   design's own — nothing is redrawn, only chosen between. */
const WEB = wrapRuntime(`
    var box = webBox();
    var phone = findPhone();
    if (!box || !phone) return false;

    phone.id = 'emPhoneFrame';
    var sec = stage(box);
    if (sec) sec.id = 'emStage';

    // The caption above the mock ("Web app (PWA) version — …") is canvas
    // furniture, not part of the product.
    var wrap = webWrap();
    if (wrap) {
      wrap.id = 'emWebWrap';
      for (var i = 0; i < wrap.children.length; i++) {
        var c = wrap.children[i];
        if (c !== box.parentElement && /Web app/i.test(c.textContent || '')) c.style.display = 'none';
      }
      wrap.style.width = '100%';
      wrap.style.marginTop = '0';
    }
    // The mock sits in a 900px / 92vw holder sized for the canvas. Widen it,
    // or the retuned scale has nothing to expand into.
    if (box.parentElement) {
      box.parentElement.style.width = '100%';
      box.parentElement.style.maxWidth = 'none';
      box.parentElement.style.overflow = 'visible';
    }

    // The first child is the drawn browser chrome (title bar + address bar) —
    // redundant inside a real browser. Only hide it if it looks like the
    // chrome, so an unexpected structure leaves the page intact. The runtime
    // normalises inline styles to rgb(), so check the computed colour too.
    var first = box.firstElementChild;
    if (first) {
      var st = first.getAttribute('style') || '';
      var bgc = window.getComputedStyle ? window.getComputedStyle(first).backgroundColor : '';
      if (/#E7E4DD/i.test(st) || bgc === 'rgb(231, 228, 221)') first.style.display = 'none';
    }

    /* Above the breakpoint, width and zoom are left to the design's own
       _fitShells — retuned at build time by patchWebBreakpoints — so only the
       canvas dressing is stripped. Below it, the web shell steps aside for the
       phone one. Both hide rules carry !important because the design sets
       display inline. */
    addCss('emWebCss', [
      'body { background: #FBF8F1 !important; }',
      '#emStage { padding: 0 !important; display: block !important; min-height: 100vh; }',
      NO_SCROLLBARS,
      '#webAppScaleBox { border-radius: 0 !important; box-shadow: none !important; }',
      '@media (min-width: 760px) {',
      '  #emPhoneFrame { display: none !important; }',
      '}',
      '@media (max-width: 759.98px) {',
      '  #emWebWrap { display: none !important; }',
      PHONE_FILL,
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

module.exports = { META, PHONE, WEB, BOTH, wrapRuntime, patchWebBreakpoints };
