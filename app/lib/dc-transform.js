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
  /* The design's fluid rules cover the marked rows — anything carrying
     data-r="stack", "hdr", "nav", "g3".. — but the home hero is not marked, so
     at 390px its two columns hold at 140px each. With 24px of padding a side,
     that leaves about ten pixels for a button label, and the shell's
     overflow-wrap:anywhere then breaks it one character per line: "Browse
     Market" rendered 62px wide and 220px tall.

     These rules stack that row and bring its desktop-sized padding and display
     type down to phone scale. They are matched on inline style the way the
     design's own narrow rules are, so they travel with it. The nowrap guard is
     unconditional: a button label broken mid-word is never the right answer at
     any width, and it is what makes this failure so ugly rather than merely
     tight. */
  /* The site header has never been sticky — it is position:static in the
     design and scrolls away, as it did in every build before this one. Pinning
     it is the one thing here that changes how the product behaves rather than
     how it fits, so it is kept separate and belongs upstream in the design.

     Two elements carry data-r="hdrwrap": the navy header and the dark footer
     (padding: 40px 44px 26px). They are told apart by padding rather than
     colour, because the runtime rewrites inline colours to rgb(). It also
     normalises lengths — "0 44px" is re-serialised as "0px 44px" — so both
     spellings are matched. Desktop only: the phone header stacks to roughly
     270px tall, and pinning that would eat the screen. */
  var STICKY_HEADER = [
    '@media (min-width: 760px) {',
    '  html #webAppScaleBox [data-r="hdrwrap"][style*="padding: 0 44px"],',
    '  html #webAppScaleBox [data-r="hdrwrap"][style*="padding: 0px 44px"] {',
    '    position: sticky !important; top: 0 !important; z-index: 40 !important;',
    '  }',
    '}'
  ].join('\\n');

  var PHONE_WIDTH_FIXES = [
    'html #webAppScaleBox [style*="padding: 14px 24px"] { white-space: nowrap; }',
    '@media (max-width: 700px) {',
    /* The home hero, and the "Selling is free to list" band — matched on the
       padding that identifies each, since neither carries a data-r marker.

       These four rules were written before the re-render race below was
       understood, and shipped without the html prefix — so they tied the
       design's own specificity rather than beating it, and lost after the
       first re-render. Proven at 320px: the hero's text column measured 252px
       (its unmodified content width) instead of the 288px width:100% should
       have forced. Every rule in this block now carries the prefix. */
    '  html #webAppScaleBox [style*="padding: 44px 46px"],',
    '  html #webAppScaleBox [style*="padding: 32px 36px"] {',
    '    flex-direction: column !important; align-items: stretch !important;',
    '    padding: 24px 18px !important; gap: 18px !important;',
    '  }',
    '  html #webAppScaleBox [style*="padding: 44px 46px"] > *,',
    '  html #webAppScaleBox [style*="padding: 32px 36px"] > * {',
    // border-box or a padded child at width:100% overflows by its own padding,
    // which is why the design's stack rule sets it too.
    '    box-sizing: border-box !important;',
    '    width: 100% !important; max-width: 100% !important; min-width: 0 !important;',
    '  }',
    '  html #webAppScaleBox [style*="padding: 44px 46px"] [style*="display: flex; gap: 12px"] {',
    // The two hero buttons keep display:flex inside the now-full-width text
    // column, so they still sit side by side rather than stacking with it.
    '    flex-wrap: wrap !important;',
    '  }',
    '  html #webAppScaleBox [style*="font-size: 40px"] { font-size: 27px !important; }',

    /* The footer is the worst offender at phone width. The design's narrow rule
       gives every column flex-basis:100%, so five stacked blocks run it from
       335px to 976px — nearly three screenfuls of links under a 6400px page.
       Two-up for the four link columns (the brand block keeps its full width)
       and phone-scale padding bring it back under 600.

       The header is the same problem, smaller: desktop gaps and padding wrap it
       into four rows, 262px of a 844px screen before any content.

       Each is prefixed with html so it outranks the design's own rule on the
       same element rather than merely tying with it. Source order cannot settle
       a tie here: the runtime re-inserts its stylesheet on every render, which
       lands after this one, so an equal-specificity override wins until the
       first re-render and then quietly stops. */
    '  html #webAppScaleBox[data-narrow="1"] [data-r="hdr"] {',
    '    gap: 12px !important; padding: 12px 0 !important;',
    '  }',
    '  html #webAppScaleBox[data-narrow="1"] [data-r="frow"] { gap: 22px 14px !important; }',
    '  html #webAppScaleBox[data-narrow="1"] [data-r="fcol"] {',
    '    flex-basis: calc(50% - 7px) !important; max-width: calc(50% - 7px) !important;',
    '  }',
    '  html #webAppScaleBox[data-narrow="1"] [data-r="hdrwrap"][style*="margin-top: 64px"] {',
    '    margin-top: 28px !important; padding: 26px 16px 20px !important;',
    '  }',

    /* The detail pages — a listing, a job, a shop — are built on a two-column
       shell that carries no data-r marker either, so it never collapses. At
       390px it splits into a 194px main column and a 130px sidebar, and every
       row inside starves: the job title "Cashier, part-time" came out 62px wide
       and 140px tall.

       gap: 34px identifies it. Five elements in the design use that gap: the
       three detail shells, one more two-column row, and one that is already a
       column and so unaffected by these rules. */
    '  html #webAppScaleBox [style*="gap: 34px"] {',
    '    flex-direction: column !important; align-items: stretch !important;',
    '    gap: 20px !important;',
    '  }',
    '  html #webAppScaleBox [style*="gap: 34px"] > * {',
    '    box-sizing: border-box !important;',
    '    width: 100% !important; max-width: 100% !important; min-width: 0 !important;',
    '  }',

    /* Sidebars are declared 260-380px wide with flex-shrink: 0. The design
       releases them, but only where they sit directly inside a data-r="stack"
       row — so the ones on the detail and pickup screens keep a fixed width and
       hang off the edge of a small handset. Released wherever they appear. */
    '  html #webAppScaleBox[data-narrow] [data-r~="side"] {',
    '    box-sizing: border-box !important; position: static !important;',
    '    width: 100% !important; max-width: 100% !important;',
    '    min-width: 0 !important; flex-shrink: 1 !important;',
    '  }',
    '}',

    /* An iPhone SE is 320px wide. The badge cluster — message, wishlist, cart,
       avatar, "+ Sell an item" — carries flex-shrink: 0 and a 20px gap, an
       intrinsic 344px that the design's narrow rules never touch. It overflows
       by exactly (360 - viewport width)px down to 320, where it runs 40px past
       the edge. Tightening the gap to 8px reclaims 48px, which is enough at
       every width down to 320; wrapping hdr's own children means the cluster
       drops to its own line rather than fighting the logo for room.

       Matched on the full inline style rather than one property, since only
       "gap: 20px" would also catch other rows the design already handles. */
    '@media (max-width: 360px) {',
    '  html #webAppScaleBox[data-narrow] [data-r="hdr"] { flex-wrap: wrap !important; }',
    /* The detail pages' title row — icon, heading, a status pill — is exactly
       as wide as its content wants to be at 320px: a 58px icon plus a pill like
       "PART-TIME" leaves the heading 64px, and it letter-columns.

       flex-wrap alone does not fix this: the heading is flex: 1 1 0%, so its
       hypothetical main size for the wrap decision is 0 by definition — the
       algorithm always finds room on one line and never triggers a wrap, no
       matter how little space is left, and the shell's overflow-wrap: anywhere
       lets even a single character count as a valid line, so the usual
       min-width:auto safety net (a flex item won't shrink below its content)
       never engages either. A real floor is what forces the decision: below
       120px the heading no longer fits beside the icon, so it wraps, taking
       the pill down to its own line rather than the heading down to letters. */
    '  html #webAppScaleBox[data-narrow] [data-r="titlerow"] {',
    '    flex-wrap: wrap !important; row-gap: 6px !important;',
    '  }',
    '  html #webAppScaleBox[data-narrow] [data-r="titlerow"] > [style*="flex: 1 1 0%"] {',
    '    min-width: 120px !important;',
    '  }',

    /* The same shape recurs everywhere a fixed-size thumbnail sits beside
       growing text — order items, profile rows, the shops list: a 62-96px
       image, flex-shrink: 0, next to a flex: 1 name-and-price column. At
       320px the pickup screen's "Cinnamon rolls (box of 4)" collapsed to a
       46px letter column the same way the job title did, for the same
       reason — flex: 1 1 0% never triggers a wrap on its own. Ten rows in
       the design share this exact thumbnail-plus-text opening; all ten get
       the same floor. */
    '  html #webAppScaleBox[data-narrow] [style*="display: flex; align-items: center; gap: 16px"] > [style*="flex: 1 1 0%"],',
    '  html #webAppScaleBox[data-narrow] [style*="display: flex; align-items: center; gap: 16px"] > [style="flex: 1;"] {',
    '    min-width: 110px !important;',
    '  }',
    /* The five home-screen quick-nav tiles (Market/Wanted/Jobs/Shops/Travel)
       pair a declared 44x44 icon with a text label in one flex row, and the
       icon has no flex-shrink override — so once the design's own rule drops
       the row to two columns at 320px, the cell has 96px of content room for
       icon + gap + label, the label wins the fight, and the icon shrinks to
       28-33px, non-square. A fixed-size icon should never be the thing that
       gives; pin it and let the row do what a text label does at the edge —
       wrap or truncate — instead of visibly deforming the icon. */
    '  html #webAppScaleBox[data-narrow] [style*="width: 44px; height: 44px; border-radius: 12px"],',
    // The round, unphotographed-seller placeholder (a hatched circle) squeezes
    // the same way — same fix, different border-radius.
    '  html #webAppScaleBox[data-narrow] [style*="width: 44px; height: 44px; border-radius: 50%"] {',
    '    flex-shrink: 0 !important;',
    '  }',
    /* The listing map preview is a fake map graphic with a pin glued on by
       raw pixel position — left: 280px, calibrated for the roughly 424px map
       the desktop layout draws. The map itself already shrinks to full width
       under the responsive treatment above; the pin\'s absolute left does not
       scale with it, so at 320px it sits 12px past a container that is now
       288px, not 424. Anchoring it to the right edge instead keeps it inside
       the map at any width the container actually reaches — a small, safe
       change matched by "left: 280px", unique to this one marker. */
    '  html #webAppScaleBox[data-narrow] [style*="left: 280px"] {',
    '    left: auto !important; right: 8px !important;',
    '  }',
    '  html #webAppScaleBox[data-narrow] [style*="margin-left: auto; display: flex; align-items: center; gap: 20px; flex-shrink: 0;"] {',
    '    gap: 8px !important;',
    '  }',
    '}',

    /* The pickup screen's QR code is drawn as a 5x5 grid of 18px squares, and
       it is tagged data-r="g5" — the same marker the design uses for its
       five-across card rows. So the narrow rule reflows it to two columns and
       the 25 cells run down the sidebar as a 40x282 smear.

       A QR is not a responsive grid, so it is pinned to five 18px columns at
       every width. Matched by its cells, so the real g5 card rows keep
       reflowing. The [data-narrow] in the selector is there purely for weight:
       the design's rule carries three attribute selectors and would otherwise
       outrank this one — which is exactly what happened on the first attempt,
       leaving the code still two columns wide. */
    'html #webAppScaleBox[data-narrow] [data-r="g5"]:has(> [style*="width: 18px"]) {',
    '  grid-template-columns: repeat(5, 18px) !important;',
    '  width: max-content !important; justify-content: center !important;',
    '}'
  ].join('\\n');

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

/* index.html is the web app at every width — the site, reflowing down to a
   phone, not the phone app wearing the site's URL. Swapping in the mobile
   shell below a breakpoint was tried and is not what this page is for. */
const WEB = wrapRuntime(`
    var box = webBox();
    var phone = findPhone();
    if (!box || !phone) return false;
    phone.style.display = 'none';

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

    /* Width and zoom stay with the design's own _fitShells, retuned at build
       time by patchWebBreakpoints; only the canvas dressing is stripped here.

       Both overflows are opened deliberately. On the canvas they clip the mock
       to its rounded browser frame, which is gone here — and while they remain,
       position:sticky resolves against those boxes rather than the viewport, so
       nothing can pin to the top of the window. Safe to open because no element
       overflows the shell at any width; that is checked on every build. */
    addCss('emWebCss', [
      'body { background: #FBF8F1 !important; }',
      '#emStage {',
      '  padding: 0 !important; display: block !important;',
      '  min-height: 100vh; overflow: visible !important;',
      '}',
      NO_SCROLLBARS,
      '#webAppScaleBox {',
      '  border-radius: 0 !important; box-shadow: none !important;',
      '  overflow: visible !important;',
      '}',
      STICKY_HEADER,
      PHONE_WIDTH_FIXES
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
