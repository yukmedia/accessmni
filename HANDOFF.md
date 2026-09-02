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

### Photos

A handoff bundle references remote Unsplash URLs, so those pages need a
connection for imagery. A Standalone export inlines the photos instead and works
offline. If image reliability matters more than freshness, prefer an export.

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
  embedded; a handoff build is ~530 KB but fetches photos over the network.
  Neither has had its images optimised.

## The older hand-written build

`app/` also holds a hand-written implementation of an **earlier** version of the
design (`app/js/`, built by `node app/build.js` into `app/dist/`). It is no
longer what gets published and is a generation behind. It stays because it is
real, readable code a developer could pick up — but if the app is going to be
rebuilt in Lovable, the design file is the better spec, and this should probably
be deleted rather than maintained in parallel.
