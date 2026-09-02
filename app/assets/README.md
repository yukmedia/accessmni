# Images the published pages need locally

`from-handoff.js` copies everything here into `docs/assets/`.

Two reasons a photo lives here rather than being fetched at runtime:

**The design asks for it by path.** `ad-karis-bake.jpeg` is the sponsored flyer,
referenced as `assets/ad-karis-bake.jpeg`. A handoff `.zip` does not always
carry its `assets/` folder, so a copy is kept here.

**The design's own URL is dead.** The `listing-*.jpg` files stand in for nine
photo slots whose Unsplash IDs no longer resolve — the vehicle gallery, the
dining set, the mango crate, the bed set and the Yaris hire. The design marks
these slots with `<meta name="ext-resource-dependency">`, meaning it expects the
host to supply the image and treats the URL as a fallback; Claude Design does
supply them, a static host cannot, and the fallback 404s. See `DEAD_PHOTOS` in
`from-handoff.js` for the mapping.

All of these are the design's own photos, recovered from the Standalone export's
asset bundle — so each listing keeps the picture it was designed with.
