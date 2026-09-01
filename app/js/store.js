/* Emerald Marketplace — state store and render loop.

   The prototype re-derived its whole view from one state object on every
   change, so this keeps that model: setState -> re-render both frames.
   Two things have to survive a full re-render to keep the demo feeling real:
   the caret in the search box, and the scroll position of any scrolling list.
   Elements opt in with data-focus-key / data-scroll-key. */

(function (global) {
  'use strict';

  var state = {
    // navigation
    screen: 'home',           // which mobile screen is showing
    market: 'sellers',        // sellers | wanted | jobs | shops | travel

    // listings
    cat: [],                  // selected category keys (single-select in practice)
    vehSub: null,             // vehicle sub-category
    sortBy: 'newest',
    sortOpen: false,
    listView: false,
    searchSaved: false,

    // other markets
    shopCat: 'all',
    wantedCat: 'all',
    wantedSortBy: 'newest',
    wantedSortOpen: false,
    jobCat: 'all',
    jobSortBy: 'newest',
    jobSortOpen: false,

    // search
    searchQuery: '',

    // detail pages
    detailItem: 'generator',  // generator (Land Cruiser) | mango
    carPhotoIdx: 0,
    qaOpen: false,

    // inbox / offers
    msgTab: 'messages',
    offer: 'open',            // open | accepted | declined

    // cart
    cartCount: 2,
    ramsQty: 1,
    hilltopQty: 1,
    ramsSaved: false,
    hilltopSaved: false,
    ramsRemoved: false,
    hilltopRemoved: false,
    cartSummaryOpen: false,

    // account
    isSeller: true,
    verified: false,

    // overlays
    wantedGateOpen: false,
    aiAssistOpen: false,

    // banners
    hasActiveOrder: true,

    // desktop-only view state
    deskDetail: false,
    deskItem: null,
    deskSub: null             // null | 'job' | 'shop'
  };

  var listeners = [];
  var frame = null;

  function get() { return state; }

  function setState(patch) {
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    schedule();
  }

  function subscribe(fn) { listeners.push(fn); }

  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(function () {
      frame = null;
      render();
    });
  }

  /* ---------- render with focus + scroll preservation ---------- */

  function captureFocus() {
    var el = document.activeElement;
    if (!el || !el.dataset || !el.dataset.focusKey) return null;
    return {
      key: el.dataset.focusKey,
      start: el.selectionStart,
      end: el.selectionEnd
    };
  }

  function restoreFocus(saved) {
    if (!saved) return;
    var el = document.querySelector('[data-focus-key="' + saved.key + '"]');
    if (!el) return;
    el.focus();
    if (saved.start != null && el.setSelectionRange) {
      try { el.setSelectionRange(saved.start, saved.end); } catch (e) { /* not a text input */ }
    }
  }

  function captureScroll() {
    var out = {};
    document.querySelectorAll('[data-scroll-key]').forEach(function (el) {
      out[el.dataset.scrollKey] = el.scrollTop;
    });
    return out;
  }

  function restoreScroll(saved) {
    document.querySelectorAll('[data-scroll-key]').forEach(function (el) {
      var v = saved[el.dataset.scrollKey];
      if (v) el.scrollTop = v;
    });
  }

  function render() {
    var savedFocus = captureFocus();
    var savedScroll = captureScroll();
    listeners.forEach(function (fn) { fn(state); });
    restoreScroll(savedScroll);
    restoreFocus(savedFocus);
  }

  global.EMStore = {
    get: get, setState: setState, subscribe: subscribe, render: render
  };
})(window);
