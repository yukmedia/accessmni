# Handoff notes

Context for anyone — person or Claude session — picking this up fresh.

## What this repo publishes

The Access MNI demo, served by GitHub Pages from `docs/`:

| URL | Page |
|---|---|
| `https://yukmedia.github.io/accessmni/` | web app, fills the browser |
| `https://yukmedia.github.io/accessmni/phone.html` | phone app, fills a handset |
| `https://yukmedia.github.io/accessmni/phone-and-web.html` | both, as the design draws them |
| `https://yukmedia.github.io/accessmni/admin.html` | admin dashboard |

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

**If the design tags those rows `data-r="stack"`, delete these rules.** They
exist only because the markers are missing.

Filling a handset also means overriding `zoom`, not just width: `_fitShells()`
scales the phone shell by `(viewport - padding) / 390`, which left 366px of app
in a 390px window on `phone.html`. That view now pins it to `zoom: 1`.

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

Two things worth fixing in Claude Design rather than here:

- `searchResults` should exist in the design, so this patch can go away.
- The heading counts across the whole app while the grid below it shows listings
  only, so *salem* reads "8 results" above two cards. Either scope the count to
  listings or give the grid the other groups.

### Photos

A handoff bundle references remote Unsplash URLs, so those pages need a
connection for imagery. A Standalone export inlines the photos instead and works
offline. If image reliability matters more than freshness, prefer an export.

**Nine photo slots are dead upstream** and are substituted at build time — the
vehicle gallery, the dining set, the mango crate, the bed set and the Yaris
hire. The design marks them itself:

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
fires.

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
