# Emerald Marketplace — Phase 1 demo

An interactive build of the Claude Design prototype in
`project/Emerald Marketplace - Client Share.dc.html`: the Montserrat
marketplace app (mobile) and web app (desktop), side by side and sharing one
state — change a tab or filter in either and both follow.

Static HTML, CSS and vanilla JavaScript. No build step, no server, no install,
no backend.

## Open it

Two builds, both self-contained single files — double-click, email, or drop on
any static host:

- **`dist/emerald-marketplace-web.html`** — the web app on its own. Fills the
  browser window, no phone beside it, no browser-window mock around it. This is
  the one to send someone who wants to see "the website".
- **`dist/emerald-marketplace-phone.html`** — the phone app on its own. On a
  phone it drops the device frame and fills the screen, so it reads as the app
  rather than a picture of one; on a desktop it sits in the usual frame.
- **`dist/emerald-marketplace-demo.html`** — phone and web side by side, sharing
  one state, for showing both platforms at once.

**To work on it:** open `web.html` or `index.html` — same app, split into
readable files. After editing, `node build.js` regenerates both bundles.

Photos load from Unsplash, so the first open needs internet. Every photo has a
colour behind it, so the page still reads correctly offline — just without the
photography.

## What's in it

**Mobile (390 × 844)** — 21 screens:

| | |
|---|---|
| Home | search, category tiles, saved-search match, sponsored banner, New today, Recently viewed |
| Browse | Listings / Wanted / Jobs / Shops / Travel, category chips, vehicle sub-categories, sort sheets, grid ⇄ list |
| Listing detail | two variants (vehicle with 4-photo gallery, produce), specs, map, seller trust card, Q&A |
| Wanted | board, gated detail, service detail with offer form, post-a-Wanted form |
| Jobs | board, job detail with contact |
| Shops | PRIME / supermarkets / real estate, shop storefront, realty storefront |
| Buying | pickup & pay checkout, multi-seller cart (quantity, save for later, remove, empty state), order confirmed |
| Selling | sell form with live fee breakdown, AI-assist sheet, pending-approval state |
| Account | inbox (messages + notifications), offer thread with accept/decline, saved items, profile, ID verification |
| Auth | login / sign-up, Wanted login gate |

**Desktop (1440px, scaled to fit)** — home/landing, listings with filter
sidebar, Wanted, Jobs, Shops, Travel, listing detail, job detail, shop detail,
search results, sign-in.

Interactive throughout: filters and sorts really filter and sort, search matches
across titles, categories and locations, and cart maths recalculates.

## Files

```
web.html            entry for the web app on its own
phone.html          entry for the phone app on its own
index.html          entry for phone + web side by side
css/app.css         stage, device frames, global resets
js/data.js          all demo content (listings, wanted, jobs, shops, travel, cart)
js/ui.js            shared style helpers, icons, repeated fragments
js/store.js         state + render loop
js/screens-mobile-a.js   home, browse
js/screens-mobile-b.js   detail pages, checkout, inbox, sell, account, overlays
js/screens-desktop.js    the web app
js/app.js           actions and event wiring
build.js            bundles the above into dist/
```

`web.html` loads only `data`, `ui`, `store`, `screens-desktop` and `app` — it
never renders a phone screen, so it doesn't ship those modules (117 KB versus
229 KB for the combined build).

Screen styling is inline, matching the design file line for line, so each screen
reads the way it was drawn. `app.css` covers only the page around the frames.

**How it works:** state lives in one object. Clicking anything with `data-act`
runs an action, the action changes state, and both frames re-render. Caret
position and list scroll positions are preserved across renders, so typing in
search and scrolling a long list behave normally.

## Changes from the prototype

Three deliberate departures, all small:

1. **Mobile sign-in hero** — the prototype had an empty drag-and-drop image slot
   here (the design tool couldn't verify photo URLs at the time). It now uses
   the same coastline photo as the desktop sign-in, so the screen doesn't demo
   as an empty grey box.
2. **Desktop "Save this search"** — the prototype printed both labels at once
   ("☆ Save search  Save this search"). One label, as intended.
3. **Desktop header badges** — the prototype's message/cart counts sat on top of
   their own labels, rendering as "Messag3" and "Ca2". The badge now sits in
   reserved space beside the label.

Also: the search bar on the browse screens opens search (on the prototype only
the home search bar did), and photos have colour fallbacks.

The **web-only build** additionally drops the browser-window mock and the 0.625
shrink (a browser frame drawn inside a real browser is redundant, and the shrink
made body text small), lays out fluidly instead of locking to 1440px, and gives
Sort a dropdown of its own — in the combined build that button opened the
phone's bottom sheet, which doesn't exist here.

## Not built (and why)

Carried over from the prototype as deliberate Phase 1 scope:

- **No backend** — no accounts, database, payments or persistence. Reloading
  resets everything. Data lives in `js/data.js`.
- **Shops and Travel are marked "soon"** — browsable, but flagged as post-launch.
- **No admin dashboard** — listings show a "pending approval" state, but the
  queue an admin would work from has no screens anywhere yet. This is the one
  screen with zero coverage, and it's needed before development starts.
- **Category-specific listing fields** — vehicle and produce detail pages are
  hand-built variants. Making fields category-driven is the schema work flagged
  in `project/Backend Spec Notes.md`.

## Editing the demo content

All copy, prices, sellers, shops, hotels and jobs are in `js/data.js`, near the
top. Change a value, reload, and run `node build.js` to refresh the shareable
file.
