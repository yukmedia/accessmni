# Handoff notes

Context for anyone — person or Claude session — picking this up fresh.

## What this repo publishes

The Access MNI demo, served by GitHub Pages from `docs/`:

| URL | Page |
|---|---|
| `https://yukmedia.github.io/accessmni/` | web app, fills the browser |
| `https://yukmedia.github.io/accessmni/phone.html` | phone app, fills a handset |
| `https://yukmedia.github.io/accessmni/phone-and-web.html` | both, as the design draws them |
| `https://yukmedia.github.io/accessmni/admin.html` | admin dashboard — loaded *inside* the web app (avatar chevron → Admin tools), not a link to hand out |

Push to `main` and Pages redeploys itself. **Don't rename these files** — the
phone link has been shared, so the paths need to stay put.

## How the pages are produced

They are generated **from the Claude Design files**, not hand-written. Two
entry points, depending on what the design tool gives you:

```
node app/from-handoff.js <unzipped-handoff-folder>    # a .zip of .dc.html sources
node app/from-export.js  <standalone-export.html>     # one self-contained file
```

**Point the first one at the folder holding the newest `.dc.html`.** A design
export can carry both a project root and a `handoff/` subfolder, and they are
not always the same vintage — in the September bundle `handoff/` was
byte-identical to the previous export while the root was 156 KB newer and held
all the responsive work. Check sizes before building, or you will quietly
republish the old design.

Both write the same set of pages. Shared logic lives in `app/lib/dc-transform.js`.

A design document draws its mocks on one canvas — a 390×844 phone frame with a
browser-window mock below it. That is right for reviewing a design and wrong for
handing someone a link, so the transform trims that one page into the three we
publish. It does this **at runtime, after the design has rendered**, and never
edits the design's own markup, so a fresh export keeps working however the
design changed inside.

One subtlety worth knowing before you touch it: the design's markup is in the
document at parse time, so a single pass succeeds immediately and is then thrown
away when the runtime renders over the top. The injected script is therefore
idempotent and re-runs on an interval and on a body mutation. Don't "optimise"
it back into a one-shot.

### Handoff bundles need two extra fixes

- **React came from unpkg.** A demo that breaks when a CDN hiccups isn't worth
  shipping, so React is vendored into `docs/vendor/` and the URLs rewritten.
  `from-handoff.js` refuses to publish if it can't vendor it.
- **`<dc-import>` doesn't resolve on a static host.** It looks the design up in
  Claude Design's own component registry, so on GitHub Pages the panel renders
  empty. Each import is rewritten to an `<iframe>` of that design published as
  its own page — which is why the admin design becomes `docs/admin.html` and the
  desktop panel loads it inline.

### index.html is the site at every width

`index.html` is the **web app**, reflowing all the way down to a phone. It is
not the mobile app wearing the site's URL — swapping the phone shell in below a
breakpoint was tried and reverted; that is what `phone.html` is for.

Two untagged rows in the design broke that reflow. The design's fluid rules key
off `data-r` markers — `stack`, `hdr`, `nav`, `g3`, `cards` and so on — but the
home hero and the "Selling is free to list" band carry no marker, so they stayed
side-by-side at 390px. Each hero column held at 140px, and with 24px of padding
a side that left about ten pixels for a button label, which the shell's
`overflow-wrap: anywhere` then broke one character per line: "Browse Market"
rendered 62px wide and 220px tall.

`PHONE_WIDTH_FIXES` stacks those two rows below 700px and brings their
desktop-sized padding and 40px display type down to phone scale. They are
matched on inline style — `[style*="padding: 44px 46px"]` — the same idiom the
design's own narrow rules use, so they sit alongside rather than fight it. The
`white-space: nowrap` guard on button-shaped elements is unconditional: a label
broken mid-word is never right at any width.

The detail pages — a listing, a job, a shop — sit on a two-column shell that is
untagged for the same reason. At 390px it split into a 194px main column and a
130px sidebar and everything inside starved: the job title "Cashier,
part-time" came out 62px wide and 140px tall. `gap: 34px` identifies that shell
(five elements use it — three detail pages, one more two-column row, and one
already a column).

**If the design tags all of these rows `data-r="stack"`, delete these rules.**
They exist only because the markers are missing. That is the whole fix upstream:
the design already knows how to collapse a marked row, and every one of these
bugs is a row it was not told about.

The footer needed the opposite of stacking. The design's narrow rule gives every
footer column `flex-basis: 100%`, so five stacked blocks ran it from 335px to
**976px** — nearly three screenfuls of links. The four link columns are now
two-up, the brand block keeps its full width, and the padding is phone-scale:
658px. The header got the same treatment more gently — desktop gaps and padding
had it wrapping to 262px before any content.

**Specificity matters here, not source order.** These override rules the design
already sets on the same elements. An equal-specificity override does not hold:
the runtime re-inserts its stylesheet on every render, landing after this one,
so the override wins until the first re-render and then quietly stops. Each of
these rules is prefixed with `html` to outrank rather than tie.

Filling a handset also means overriding `zoom`, not just width: `_fitShells()`
scales the phone shell by `(viewport - padding) / 390`, which left 366px of app
in a 390px window on `phone.html`. That view now pins it to `zoom: 1`.

### The sticky header is added here, not in the design

The site header is `position: static` in the design and always has been — it
scrolled away in every build before this one, including the previous design
generation. Nothing regressed; it was simply never pinned.

`STICKY_HEADER` pins it at 760px and up. Three things it needs:

- **Both `overflow`s opened.** `#emStage` and `#webAppScaleBox` clip the mock to
  its rounded browser frame on the canvas. While they are clipped, `sticky`
  resolves against those boxes rather than the viewport and nothing can pin.
  Safe to open because no element overflows the shell at any width — checked
  every build.
- **The right one of two.** Both the navy header and the dark footer carry
  `data-r="hdrwrap"`. They are told apart by padding, not colour, because the
  runtime rewrites inline colours to `rgb()`. It normalises lengths too —
  `0 44px` is re-serialised as `0px 44px` — so both spellings are matched. That
  normalisation has now caused three separate silent misses; assume any
  `[style*=…]` selector needs the re-serialised form.
- **Desktop only.** The phone header stacks to roughly 270px tall; pinning that
  would eat the screen.

This is the one rule here that changes how the product behaves rather than how
it fits. It belongs in the design.

### The web page's breakpoints are retuned, not overridden

The design is responsive, but its breakpoints are written for the canvas.
`_fitShells()` flips the web shell into its fluid mode below 760px, because
above that the shell on the canvas is a 1440px layout scaled down to sit beside
the phone — so it never needs to reflow.

Published full-bleed, that is wrong twice: the shell gets the real viewport
width without being told to reflow, and the design's `overflow: hidden` then
**clips** the excess instead of scrolling it, so the loss is silent. Measured at
768px wide, 35 elements sat past the right edge, the worst by 412px.

`patchWebBreakpoints()` in `dc-transform.js` retunes two constants for
`index.html` only — reflow below 1024 instead of 760, and above it scale the
1440 layout to exactly the viewport rather than capping at 0.625. Everything
else is the design's own: the fluid rules, the 460px single-column breakpoint,
the phone shell. `phone-and-web.html` is left alone deliberately — it is meant
to look like the canvas.

Don't reintroduce a `zoom: 1 !important; width: 100%` override on
`#webAppScaleBox`. That is what caused the clipping: it takes the sizing away
from the design without taking over the reflow.

### Desktop search returned an empty page (fixed upstream)

**The design now defines `searchResults` itself**, flattening every result group
with field fallbacks — a better fix than the one here. `fixDesktopSearch()` sees
it and stands down, which is why the patch no longer appears in the built pages.
It is kept only as a guard against a regression; the history below is why.

On the web view, typing a query showed the right heading — *Results for "car" ·
2 results across the app* — and then nothing. The grid iterates
`{{ searchResults }}`, which `renderVals()` never produces; it produces
`searchGroups`, the grouped shape the **phone's** results list uses. The heading
was right because `searchResultsLabel` does exist. The phone was unaffected.

`fixDesktopSearch()` defines `searchResults` next to `searchGroups`, resolving
the query the way `_searchScoped()` does — island vocabulary first (`_localWords`
maps *car* to *toyota*, *provisions* to *mango*), then the listings match.

It also re-points the desktop's empty state. That block's own copy reads *"No
listings match …"*, but it was wired to `searchNoResults`, true only when nothing
**anywhere** in the app matched — so a query hitting a shop or a job but no
listing (*nails*, *villa*, *flight*) showed neither cards nor a message.

Both things worth fixing in Claude Design have been: `searchResults` exists, and
the heading no longer over-counts. It used to count across the whole app while
the grid below showed listings only, so *salem* read "8 results" above two
cards; the two now agree at every query tested.

### The admin dashboard had no responsive system at all

`admin.html` comes from a **different design file**, and where the marketplace
design is responsive and merely under-marked, this one is a fixed artboard: a
1440×940 flex board with `overflow: hidden`, a 232px sidebar beside a scrolling
content column, and **not one `data-r` marker in 100 KB**.

On a phone that meant the sidebar took 60% of the screen and the content was a
sliver. The page did scroll sideways to 1440, but the sidebar is not pinned, so
scrolling right just panned a desktop board — every column of a six-column
moderation table was out there somewhere.

`ADMIN_RESPONSIVE` in `dc-transform.js` is therefore a responsive layer written
from scratch rather than gaps filled in an existing one, and it is the one place
in this repo making layout decisions the design does not state. Three worth
knowing, all at a 900px breakpoint:

- **The sidebar becomes an off-canvas drawer** behind a menu button in the
  topbar. Stacking it would put ~700px of navigation above every screen — the
  same complaint the footer drew — and laying it on its side as a scrolling
  strip, which is what this did first, is worse: it flattens three permission
  tiers into one cut-off row and hides half the destinations off the right
  edge. Twelve destinations grouped into DAILY WORK, MANAGE and OWNER ONLY are
  a menu, and a menu on a phone is a drawer. What slides in is the design's own
  sidebar, tiers, badges and active state intact; the screen itself now opens
  straight into the work with no navy chrome above it.

  The drawer needs two elements the design has no reason to contain — the menu
  button and the scrim — so they are injected. Both are **re-created, not
  remembered**: a re-render replaces the board's subtree and takes them with
  it, so each pass rebuilds whatever is missing. They go *inside* the board and
  never onto `body`, because the MutationObserver watches body's children and
  appending there would feed itself. The open state lives on `<html>`, which
  the runtime never rewrites, so the drawer survives a re-render mid-animation.
- **Dense tables scroll sideways inside their own card**, with a slim scrollbar
  re-enabled because the design's head CSS hides every scrollbar in the file and
  a scroll area with no affordance reads as a clipped table. A six-column
  moderation queue does not become a phone screen by narrowing — the columns are
  the content, and squeezing them produces the one-character-per-line collapse
  seen elsewhere here.
- **The board's inner scroll region is released** so the page itself scrolls
  rather than trapping a 940px box inside a 700px screen. For the same reason
  the iframe that loads the panel inside the web app drops from its 940px
  artboard height to `82vh` below 900px.

Grid templates are **enumerated**, not pattern-matched, because CSS cannot ask
"contains a px track". Every `grid-template-columns` in the file is listed —
fr-only ones collapse to two columns and then one, the seven carrying a px track
get a `min-width` floor and a scrolling card. A template the design adds later
simply keeps today's behaviour until it is listed too, which is a visible
regression rather than a silent one.

All of it belongs in the design. It is here because the demo has to work on the
phone the client is holding.

### Photos

A handoff bundle references remote Unsplash URLs, so those pages need a
connection for imagery. A Standalone export inlines the photos instead and works
offline. If image reliability matters more than freshness, prefer an export.

**Seven photo slots are dead upstream** and are substituted at build time — the
vehicle gallery, the mango crate, the bed set and the Yaris hire. The design
marks them itself:

```html
<meta name="ext-resource-dependency" id="imgVehicle" content="https://images.unsplash.com/…">
```

That means *the host supplies this image; the URL is only a fallback*. Claude
Design supplies them, a static host cannot, and those particular URLs 404 — so
on GitHub Pages those listings rendered as empty grey boxes. The replacements in
`app/assets/` are the same listings' own photos, recovered from a Standalone
export's asset bundle, mapped in `DEAD_PHOTOS` in `from-handoff.js`.

The mapping is keyed by Unsplash photo ID, not full URL, because the design asks
for each photo at half a dozen crop sizes. Two spellings are rewritten: the URL
in full, and `u('photo-…')`, the helper the listing data uses. The build then
refuses to write a page that still contains a dead ID or references a missing
`assets/` file — so this fails loudly rather than shipping a broken image. If a
future design revision fixes the URLs upstream, nothing matches and nothing
fires — which is what happened to the dining set. That slot now points at a
different photo, so its `DEAD_PHOTOS` entry matches nothing. Entry and image are
both kept, as a guard in case the old URL comes back.

## Never commit these

`chats/` and `project/` are in `.gitignore` and must stay out. They contain the
build-fee options, equity vs revenue-share terms, margin assumptions, prior
client rates and candid notes on the client. **This repo is public.**

The published branch was created as a fresh commit with no ancestry precisely so
that material has never existed in its history. If you push from a working copy
that also holds the handoff bundle, push the specific branch
(`git push origin <branch>:main`) — never `git push --all`.

## Known gaps

- **No backend.** Accounts, listings, payments and the admin queue are all
  demo data. Reloading resets everything.
- **Category-specific listing fields** are hand-built variants in the design
  rather than a category-driven schema — the work noted in the backend spec.
- **Page weight.** A Standalone export runs ~5.4 MB because every photo is
  embedded; a handoff build is ~530 KB plus ~480 KB of local `assets/`, and
  fetches the rest of the photos over the network. Only the local assets have
  been optimised (capped at 800px, q82 progressive).

## The older hand-written build

`app/` also holds a hand-written implementation of an **earlier** version of the
design (`app/js/`, built by `node app/build.js` into `app/dist/`). It is no
longer what gets published and is a generation behind. It stays because it is
real, readable code a developer could pick up — but if the app is going to be
rebuilt in Lovable, the design file is the better spec, and this should probably
be deleted rather than maintained in parallel.
