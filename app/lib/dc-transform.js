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

    /* The account menu is position: absolute; right: 0, anchored to the avatar
       itself. On a desktop header the avatar is the last thing before the right
       edge, so a 246px menu hanging left of it lands on screen. Once the header
       wraps, the avatar moves inboard — its right edge falls to 208px at 390 and
       181px at 320 — and the menu goes off the left of the screen with it: 8px
       at 430, 38px at 390, 65px at 320, clipping the name, "Your profile" and
       "Log out" to half-letters.

       The anchor is the bug, not the offset. The badge cluster it sits in is
       tagged data-r="hdrpush" and its right edge *is* the header's content edge
       at every width, so the menu is re-anchored to that: right: 0 now means the
       right of the header rather than the right of a 48px avatar. Releasing the
       avatar wrapper's own position: relative is what hands the menu up to it.

       :has() picks the one cluster holding the account control — the marker is
       used twice — and keeps top: 42px meaningful, since the cluster and the
       avatar share a top edge to within a few pixels. */
    '  html #webAppScaleBox[data-narrow] [data-r="hdrpush"]:has(> [style*="gap: 9px"]) {',
    '    position: relative !important;',
    '  }',
    '  html #webAppScaleBox[data-narrow] [data-r="hdrpush"] > [style*="gap: 9px"] {',
    '    position: static !important;',
    '  }',
    '}',

    /* An iPhone SE is 320px wide. The badge cluster — message, wishlist, cart,
       avatar, "+ Post an ad" — carries flex-shrink: 0 and a 20px gap, an
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

  /* The admin dashboard is a different design file, and unlike the marketplace
     it has no responsive system at all — not one data-r marker in 100 KB. It is
     a fixed artboard: a 1440x940 flex board, overflow: hidden, holding a 232px
     sidebar beside a scrolling content column.

     On a phone that means the sidebar takes 60% of the screen and the content
     is a sliver. The page does scroll sideways to 1440, but the sidebar is not
     pinned, so scrolling right just pans a desktop board — every column of a
     six-column moderation table is out there somewhere.

     So this is a responsive layer written from scratch rather than gaps filled
     in an existing one, and it is the one place here making layout decisions
     the design does not state. Three worth knowing:

     - The sidebar becomes an off-canvas drawer behind a menu button in the
       topbar. Stacking it would put ~700px of navigation above every screen;
       laying it on its side as a scrolling strip — which is what this did
       first — is worse, because it flattens three permission tiers into one
       cut-off row and hides half the destinations off the right edge. Twelve
       destinations grouped into DAILY WORK, MANAGE and OWNER ONLY are a menu,
       and a menu on a phone is a drawer. The design's own sidebar is what
       slides in, tiers and count badges intact.
     - The dense tables scroll sideways inside their own card. A six-column
       moderation queue does not become a phone screen by narrowing; the
       columns are the content. Squeezing them is what produces the
       one-character-per-line collapse seen elsewhere in this file.
     - The board's inner scroll region is released so the page itself scrolls,
       rather than trapping a 940px box inside a 700px screen.

     All of it belongs in the design. It is here because the demo has to work on
     the phone the client is holding. */
  var ADMIN_RESPONSIVE = [
    /* Both injected elements exist at every width and are simply not shown
       above the breakpoint, so the desktop dashboard is untouched. */
    '#admMenuBtn, #admScrim { display: none; }',
    '@media (max-width: 900px) {',
    /* The board itself: stop being a 1440x940 artboard. */
    '  html [style*="width: 1440px"][style*="height: 940px"] {',
    '    width: 100% !important; height: auto !important;',
    '    min-height: 100vh !important; flex-direction: column !important;',
    '    overflow: visible !important;',
    '    border-radius: 0 !important; box-shadow: none !important;',
    '  }',
    /* Sidebar -> an off-canvas drawer. It keeps the design's own contents,
       spacing and grouping; all that changes is that it is laid over the
       screen on demand instead of taking a third of it permanently.

       Positioned against the viewport rather than the board, which is safe
       here because nothing in this file establishes a containing block for
       fixed elements — no transform, no filter, no zoom on any ancestor. */
    '  html #admSide {',
    '    position: fixed !important; top: 0 !important; left: 0 !important;',
    '    height: 100% !important;',
    '    width: 84vw !important; max-width: 300px !important;',
    '    z-index: 60 !important; overflow-y: auto !important;',
    '    box-shadow: 0 0 44px rgba(16,22,33,0.45) !important;',
    '    transform: translateX(-101%);',
    '    visibility: hidden;',
    '    transition: transform 0.24s ease, visibility 0s linear 0.24s;',
    '  }',
    '  html[data-adm-nav="open"] #admSide {',
    '    transform: translateX(0);',
    '    visibility: visible;',
    '    transition: transform 0.24s ease, visibility 0s;',
    '  }',
    '  html #admScrim {',
    '    display: block !important; position: fixed; inset: 0;',
    '    background: rgba(16,22,33,0.55);',
    '    opacity: 0; pointer-events: none;',
    '    transition: opacity 0.24s ease; z-index: 55;',
    '  }',
    '  html[data-adm-nav="open"] #admScrim { opacity: 1; pointer-events: auto; }',
    /* The button that opens it, sitting at the head of the topbar where the
       sidebar used to begin. */
    '  html #admMenuBtn {',
    '    display: inline-flex !important; align-items: center;',
    '    justify-content: center; flex-shrink: 0;',
    '    width: 38px; height: 38px; padding: 0; margin-right: 2px;',
    '    background: #FFFFFF; color: #16233A; cursor: pointer;',
    '    border: 1px solid #E4E1D6; border-radius: 10px;',
    '  }',
    '  @media (prefers-reduced-motion: reduce) {',
    '    html #admSide, html #admScrim { transition: none !important; }',
    '  }',
    /* The topbar is a fixed 62px row of title, date and actions. */
    '  html [style*="height: 62px"][style*="flex-shrink: 0"] {',
    '    height: auto !important; min-height: 62px !important;',
    '    flex-wrap: wrap !important; row-gap: 8px !important;',
    '    padding: 12px 14px !important;',
    '  }',
    /* Release the inner scroller so the page scrolls, not a box inside it. */
    '  html [style*="overflow-y: auto"][style*="padding: 22px 24px 30px"] {',
    '    overflow-y: visible !important; min-height: 0 !important;',
    '    padding: 16px 14px 28px !important;',
    '  }',
    /* Stat and summary rows. Every fr-only grid in the file is listed; the
       ones carrying a px track are tables and are handled separately below. */
    '  html [style*="grid-template-columns: repeat(4, 1fr)"],',
    '  html [style*="grid-template-columns: repeat(7, 1fr)"],',
    '  html [style*="grid-template-columns: 1.25fr 1fr 1fr 1fr"] {',
    '    grid-template-columns: repeat(2, 1fr) !important;',
    '  }',
    '  html [style*="grid-template-columns: repeat(3, 1fr)"],',
    '  html [style*="grid-template-columns: 1.35fr 1fr"] {',
    '    grid-template-columns: 1fr !important;',
    '  }',

    /* Everything below is scoped to the scrolling content region — the sidebar
       strip and the table cards manage their own overflow and must not wrap.
       The region is identified by the padding the design gives it; this rule
       block overrides that padding above, but [style*=] reads the attribute,
       which still says what the design wrote. */

    /* Screen toolbars — the date range on the dashboard, the sort and filter
       chips on Approvals and Users — are plain flex rows, so their last chip
       hangs off the edge: 16px on the dashboard, 40 on Approvals, 73 on Users.
       Matched as a direct child of a content stack, whatever that stack's gap,
       so all three are one rule. */
    '  html [style*="padding: 22px 24px 30px"] [style*="flex-direction: column"]',
    '    > [style*="display: flex"][style*="align-items: center"][style*="gap: 8px"] {',
    '    flex-wrap: wrap !important; row-gap: 8px !important;',
    '  }',

    /* The queue and report rows are a thumbnail, a text column, and a cluster
       of action buttons. The text column is flex: 1 1 0% with an explicit
       min-width: 0px, and the button cluster does not shrink — so at 390 the
       cluster keeps its 225px and the text is left with fifteen. "Denroy A. ·
       verified seller · Look Out" then renders 43px wide and 112px tall.

       Where the design adds min-width: 0px it is defeating the min-content
       floor on purpose, which is right on a desktop row and fatal here, so a
       real floor goes back. The floor is also what makes the row wrap: flex
       decides on hypothetical main size, which is 0 for a flex: 1 1 0% item,
       so without it the algorithm always believes everything fits on one line
       no matter how little room is left. With 150px it does not, and the button
       cluster drops to its own line instead of the text collapsing.

       Matched on flex: 1 1 0% alone rather than on that pairing — the activity
       log's rows carry no min-width and collapsed the same way. Spacer divs are
       written flex: 1 and serialise as written, so they keep their zero floor
       and go on doing their job.

       150px clears the narrowest case — 320px screen, less content padding,
       card border, row padding and a 62px thumbnail, leaves 184. */
    '  html [style*="padding: 22px 24px 30px"] [style*="flex: 1 1 0%"] {',
    '    min-width: 150px !important;',
    '  }',
    // :has() stays welded to its subject — a line break here would turn it
    // into a descendant combinator and match the wrong element.
    '  html [style*="padding: 22px 24px 30px"] [style*="display: flex"]:has(> [style*="flex: 1 1 0%"]) {',
    '    flex-wrap: wrap !important; row-gap: 10px !important;',
    '  }',
    '}',

    /* Below 560 even two-up stat tiles start letter-columning their labels. */
    '@media (max-width: 560px) {',
    '  html [style*="grid-template-columns: repeat(4, 1fr)"],',
    '  html [style*="grid-template-columns: repeat(7, 1fr)"],',
    '  html [style*="grid-template-columns: 1.25fr 1fr 1fr 1fr"],',
    '  html [style*="grid-template-columns: 1fr 1fr"] {',
    '    grid-template-columns: 1fr !important;',
    '  }',
    '}',

    /* The tables become cards, one per record.

       Panning a six-column table sideways is a fallback, not an answer: the
       column headings scroll away with the row, so a bare "14" or "Mar 2026"
       stops meaning anything, records cannot be compared, and the buttons sit
       off the right edge where nobody finds them.

       So each row is restacked as a card. The labels come from the table's own
       header row, read at runtime and written onto each cell as data-col, which
       is why nothing here invents a column name — a table the design adds later
       is captioned correctly without being listed anywhere. The header row is
       then redundant and is hidden.

       Four kinds of cell, marked data-cell by the same pass:
         rank    a "#" column — shares the first line with the title
         title   the record itself — the card's heading, no label
         field   everything else — label left, value right
         actions the column whose heading is blank — buttons, full width

       The label is a ::before floated left rather than a flex item, so a cell
       holding a bare text node, a pill, or several children all right-align
       against it without the markup being rewritten. */
    '@media (max-width: 900px) {',
    '  html [data-tbl="head"] { display: none !important; }',
    '  html [data-tbl="row"] {',
    '    display: flex !important; flex-wrap: wrap !important;',
    '    align-items: baseline !important;',
    '    grid-template-columns: none !important;',
    '    gap: 5px 10px !important; padding: 13px 15px !important;',
    '    min-width: 0 !important;',
    '  }',
    '  html [data-tbl="row"] > * { min-width: 0 !important; }',
    '  html [data-cell="rank"] { flex: 0 0 auto !important; }',
    '  html [data-cell="title"] { flex: 1 1 auto !important; }',
    '  html [data-cell="field"] {',
    '    flex: 0 0 100% !important;',
    '    display: block !important; text-align: right !important;',
    '  }',
    '  html [data-cell="field"]::before {',
    '    content: attr(data-col); float: left;',
    '    text-align: left; padding-right: 12px;',
    '    font-size: 10px; font-weight: 800; letter-spacing: 0.07em;',
    '    color: #A8AFBC;',
    '  }',
    /* text-align only moves inline content. Where the value is itself a flex
       row — the delivery driver is an avatar beside a name — its box fills the
       line and the text inside stays left, hard against the label. This right-
       aligns those, and is inert on every value that is not a flex container. */
    '  html [data-cell="field"] > * { justify-content: flex-end !important; }',
    '  html [data-cell="actions"] {',
    '    flex: 0 0 100% !important; margin-top: 6px !important;',
    '    display: flex !important; align-items: center !important;',
    '    justify-content: flex-end !important; gap: 8px !important;',
    '  }',

    /* The sideways-scrolling fallback stays for any table the pass above did
       not reach — a shape it cannot read leaves the rows unmarked, and a table
       that pans is far better than one that is squeezed to letter columns. The
       design hides every scrollbar in its own head CSS, so those cards get a
       slim one back; a scroll area with no affordance reads as a clipped
       table. */
    '  html [style*="grid-template-columns: 28px 1.6fr 1fr 1fr 1fr"]:not([data-tbl]),',
    '  html [style*="grid-template-columns: 34px 1.5fr 1fr 0.9fr 0.9fr 170px"]:not([data-tbl]),',
    '  html [style*="grid-template-columns: 2fr 1.1fr 1.1fr 0.8fr 0.9fr 210px"]:not([data-tbl]),',
    '  html [style*="grid-template-columns: 1.7fr 1.3fr 0.8fr 0.9fr 1fr 190px"]:not([data-tbl]),',
    '  html [style*="grid-template-columns: 1.6fr 1fr 0.9fr 1fr 1fr 120px"]:not([data-tbl]),',
    '  html [style*="grid-template-columns: 1.5fr 1.2fr 1fr 1fr 150px"]:not([data-tbl]),',
    '  html [style*="grid-template-columns: 1.4fr 1fr 1.5fr 1fr 110px"]:not([data-tbl]) {',
    '    min-width: 680px !important;',
    '  }',
    '  html [style*="border-radius: 13px"]:has([style*="grid-template-columns"][style*="px "]:not([data-tbl])) {',
    '    overflow-x: auto !important;',
    '  }',
    '  html [style*="border-radius: 13px"]:has([style*="grid-template-columns"][style*="px "]:not([data-tbl]))::-webkit-scrollbar {',
    '    height: 6px !important; display: block !important;',
    '  }',
    '  html [style*="border-radius: 13px"]:has([style*="grid-template-columns"][style*="px "]:not([data-tbl]))::-webkit-scrollbar-thumb {',
    '    background: rgba(16,22,33,0.22) !important; border-radius: 3px !important;',
    '  }',
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
      PHONE_WIDTH_FIXES,
      /* The admin panel is loaded in an iframe at its 940px artboard height.
         On a handset that is a box taller than the screen holding a page that
         scrolls as well, and the two are indistinguishable under a thumb.
         Matched to the admin's own 900px breakpoint. */
      '@media (max-width: 900px) {',
      '  html #webAppScaleBox iframe[data-r-frame="admin"] { height: 82vh !important; }',
      '}'
    ].join('\\n'));
    return true;
`);

/* The admin dashboard. Nothing to trim — it is a single artboard with no phone
   mock beside it — so this adds the responsive layer, plus the two elements a
   drawer needs that the design has no reason to contain: the button that opens
   it and the scrim behind it.

   Both are re-created rather than remembered. A re-render replaces the board's
   subtree and takes them with it, so each pass looks them up by id and rebuilds
   what is missing. They are inserted *inside* the board, never appended to
   body — the MutationObserver upstream watches body's children, and adding one
   there would feed itself.

   The open state lives on <html>, which the runtime never rewrites, so the
   drawer survives a re-render mid-animation. */
const ADMIN = wrapRuntime(`
    var side = null, bar = null, board = null;
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var st = divs[i].getAttribute('style') || '';
      if (!board && /width:\\s*1440px/.test(st) && /height:\\s*940px/.test(st)) board = divs[i];
      if (!side && /width:\\s*232px/.test(st) && /flex-shrink:\\s*0/.test(st)) side = divs[i];
      if (!bar && /height:\\s*62px/.test(st) && /flex-shrink:\\s*0/.test(st)) bar = divs[i];
    }
    if (!board || !side || !bar) return false;

    side.id = 'admSide';
    addCss('emAdminCss', ADMIN_RESPONSIVE);

    if (!document.getElementById('admMenuBtn')) {
      var btn = document.createElement('button');
      btn.id = 'admMenuBtn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Open the admin menu');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"'
        + ' stroke="currentColor" stroke-width="2.2" stroke-linecap="round">'
        + '<path d="M4 7h16M4 12h16M4 17h16"/></svg>';
      bar.insertBefore(btn, bar.firstChild);
    }
    if (!document.getElementById('admScrim')) {
      var scrim = document.createElement('div');
      scrim.id = 'admScrim';
      board.appendChild(scrim);
    }

    /* One delegated listener for the life of the page. Capture phase so the
       button is handled before the runtime sees the click, but propagation is
       left alone for taps on the nav itself — the design's own handler still
       has to run and change screen; closing the drawer is the extra. */
    if (!window.__admNavWired) {
      window.__admNavWired = true;
      document.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var root = document.documentElement;
        var open = root.getAttribute('data-adm-nav') === 'open';
        if (t.closest('#admMenuBtn')) {
          e.preventDefault();
          e.stopPropagation();
          root.setAttribute('data-adm-nav', open ? 'closed' : 'open');
        } else if (t.closest('#admScrim') || t.closest('#admSide')) {
          root.setAttribute('data-adm-nav', 'closed');
        }
      }, true);
      // Escape closes it, as a menu laid over the screen should.
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') document.documentElement.setAttribute('data-adm-nav', 'closed');
      });
    }

    /* Caption the tables so they can be restacked as cards.

       Only grids with a px track are tables — the stat tiles are fr-only, and
       converting those would be wrong. Rows are grouped by their parent card;
       the first is the header and supplies the labels for the rest.

       Guarded by a single query rather than a stored flag, because a re-render
       replaces these nodes and strips the attributes: if no marked row is left
       in the document there is work to do, and if one is, there is not. */
    if (!document.querySelector('[data-tbl="row"]')) {
      var groups = new Map();
      var cells = document.querySelectorAll('[style*="grid-template-columns"]');
      for (var c = 0; c < cells.length; c++) {
        var cs = cells[c].getAttribute('style') || '';
        if (!/grid-template-columns:[^;]*\\d+px/.test(cs)) continue;
        var par = cells[c].parentElement;
        if (!par) continue;
        if (!groups.has(par)) groups.set(par, []);
        groups.get(par).push(cells[c]);
      }
      groups.forEach(function (rows) {
        if (rows.length < 2) return;
        var head = rows[0];
        var labels = [];
        for (var h = 0; h < head.children.length; h++) {
          labels.push((head.children[h].textContent || '').trim());
        }
        // The record's own name is the first column that is neither a rank nor
        // an unlabelled button column.
        var titleAt = -1;
        for (var t = 0; t < labels.length; t++) {
          if (labels[t] && labels[t] !== '#') { titleAt = t; break; }
        }
        head.setAttribute('data-tbl', 'head');
        for (var r = 1; r < rows.length; r++) {
          rows[r].setAttribute('data-tbl', 'row');
          var kids = rows[r].children;
          for (var k = 0; k < kids.length; k++) {
            var label = labels[k] === undefined ? '' : labels[k];
            /* A blank heading means one of two different things depending on
               which side of the record's name it falls: before it, a drag
               handle or a checkbox, which belongs on the title's line; after
               it, the button column, which belongs at the foot of the card. */
            var kind = label === '#' ? 'rank'
              : k === titleAt ? 'title'
              : label === '' ? (k < titleAt ? 'rank' : 'actions')
              : 'field';
            kids[k].setAttribute('data-cell', kind);
            if (kind === 'field') kids[k].setAttribute('data-col', label);
          }
        }
      });
    }

    var btnNow = document.getElementById('admMenuBtn');
    if (btnNow) {
      btnNow.setAttribute('aria-expanded',
        document.documentElement.getAttribute('data-adm-nav') === 'open' ? 'true' : 'false');
    }
    return true;
`);

// Both mocks, as the design draws them — just without scrollbars.
const BOTH = wrapRuntime(`
    var phone = findPhone();
    if (!phone) return false;
    addCss('emBothCss', NO_SCROLLBARS);
    return true;
`);

module.exports = { META, PHONE, WEB, BOTH, ADMIN, wrapRuntime, patchWebBreakpoints };
