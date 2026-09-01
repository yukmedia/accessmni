# Handoff notes

Context for anyone — person or Claude session — picking this up fresh.

## What this repo is

A hand-written implementation of the Emerald Marketplace design from Claude
Design. **It is not generated from the design file.** Updating the design does
not update this code; someone has to port the changes across.

Static HTML/CSS/vanilla JS. No dependencies, no build tooling, no backend.
`node app/build.js` bundles `app/` into three single-file pages in `app/dist/`
and copies them to `docs/`.

## Published

GitHub Pages serves `docs/` from `main`:

| URL | Page |
|---|---|
| `https://yukmedia.github.io/accessmni/` | web app |
| `https://yukmedia.github.io/accessmni/phone.html` | phone app, full screen |
| `https://yukmedia.github.io/accessmni/phone-and-web.html` | both, sharing one state |

Push to `main` and Pages redeploys itself. **Don't rename these files** — the
phone link has been shared, so the path needs to stay put.

## Never commit these

`chats/` and `project/` from the Claude Design handoff bundle are in
`.gitignore` and must stay out. They contain the build-fee options, equity vs
revenue-share terms, margin assumptions, prior client rates and candid notes on
the client. **This repo is public.**

The branch published here was created as a fresh commit with no ancestry
precisely so that material has never existed in its history. If you push from a
working copy that also holds the handoff bundle, push the specific branch
(`git push origin <branch>:main`) — never `git push --all`.

## Deliberate departures from the design

Keep these unless the design has since addressed them:

1. **Desktop header badges** — the prototype's message/cart counts overlapped
   their own labels, rendering as "Messag3" and "Ca2". The badge now sits in
   reserved padding beside the label.
2. **Desktop "Save this search"** — the prototype printed both labels at once
   ("☆ Save search  Save this search"). Reduced to one.
3. **Mobile sign-in hero** — the prototype had an empty drag-and-drop image
   slot. Uses the same coastline photo as the desktop sign-in, so it doesn't
   demo as a grey box.
4. **Phone-only page** (`phone.html`) — not in the design. Fills the screen on a
   real phone and carries the Add-to-Home-Screen meta tags.
5. **Web-only page** (`index.html`) — drops the browser-window mock and the
   0.625 shrink, lays out fluidly rather than locking to 1440px, and gives Sort
   a dropdown (the design's Sort button opened the phone's bottom sheet, which
   a web-only page has no phone to show).
6. **Photo fallbacks** — every remote photo has a colour behind it, so a failed
   or blocked image degrades to a tinted block rather than an empty white box.

## Known gaps

- **No admin dashboard.** Listings reach a "pending approval" state, but the
  queue an admin reviews them in has no screens — not here, and not in the
  design either. Real unscoped work; worth mocking before development starts.
- **Category-specific listing fields.** Vehicle and produce detail pages are
  hand-built variants. Making fields category-driven is the schema work noted in
  the backend spec.
- **Photos are remote Unsplash URLs.** They can go stale. Locally-supplied
  images should be embedded as data URIs instead so they cannot break.

## Conventions

- All demo content — listings, wanted ads, jobs, shops, hotels, cart — lives in
  `app/js/data.js`. Change copy and prices there, nowhere else.
- Screen markup uses inline styles matching the design file line for line, so
  each screen reads the way it was drawn. `app/css/app.css` covers only the page
  around the frames.
- Clicking anything with `data-act` runs an action in `app/js/app.js`; actions
  are the only thing that change state; state changes re-render both frames.
- After editing, run `node app/build.js` before committing — `docs/` is built
  output and must not be edited by hand.
