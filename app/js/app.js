/* Emerald Marketplace — wiring.

   One delegated click listener reads data-act / data-arg off the clicked
   element and runs the matching action, which is the only thing allowed to
   change state. State changes re-render both frames. */

(function (global) {
  'use strict';

  var Store = global.EMStore, S = global.EMScreens, D = global.EMData;

  function set(patch) { Store.setState(patch); }

  // Navigating anywhere dismisses whatever transient UI was open.
  function closeTransient(patch) {
    patch = patch || {};
    patch.sortOpen = false;
    patch.jobSortOpen = false;
    patch.wantedSortOpen = false;
    return patch;
  }

  var actions = {

    /* ---------- navigation ---------- */

    nav: function (screen) {
      var patch = closeTransient({ screen: screen, wantedGateOpen: false, aiAssistOpen: false });
      if (screen === 'detail') patch.detailItem = 'generator';
      if (screen === 'search') patch.searchQuery = '';
      // Leaving a mobile screen also drops the desktop drill-down, so the two
      // frames never disagree about where you are.
      patch.deskDetail = false;
      patch.deskSub = null;
      set(patch);
    },

    market: function (key) {
      set(closeTransient({
        market: key, screen: 'browse', searchQuery: '',
        deskDetail: false, deskSub: null,
        wantedGateOpen: false, aiAssistOpen: false
      }));
    },

    /* ---------- filters ---------- */

    // Single-select: tapping the active chip clears it, tapping another replaces
    // it. Multi-select was tried and dropped — two sub-category rows at once
    // was more confusing than useful.
    cat: function (key) {
      var cur = Store.get().cat;
      var next = !key ? [] : (cur.indexOf(key) !== -1 ? [] : [key]);
      set({ cat: next, vehSub: null, deskDetail: false, deskSub: null, searchQuery: '' });
    },
    vehSub: function (key) { set({ vehSub: Store.get().vehSub === key ? null : key }); },
    shopCat: function (key) { set({ shopCat: key, deskDetail: false, deskSub: null }); },
    jobCat: function (key) { set({ jobCat: key, deskDetail: false, deskSub: null }); },
    wantedCat: function (key) { set({ wantedCat: key, deskDetail: false, deskSub: null }); },

    /* ---------- sorting ---------- */

    openSort: function () { set({ sortOpen: true }); },
    closeSort: function () { set({ sortOpen: false }); },
    sort: function (key) { set({ sortBy: key, sortOpen: false }); },

    openJobSort: function () { set({ jobSortOpen: true }); },
    closeJobSort: function () { set({ jobSortOpen: false }); },
    jobSort: function (key) { set({ jobSortBy: key, jobSortOpen: false }); },

    openWantedSort: function () { set({ wantedSortOpen: true }); },
    closeWantedSort: function () { set({ wantedSortOpen: false }); },
    wantedSort: function (key) { set({ wantedSortBy: key, wantedSortOpen: false }); },

    toggleListView: function () { set({ listView: !Store.get().listView }); },
    toggleSaveSearch: function () { set({ searchSaved: !Store.get().searchSaved }); },

    /* ---------- listings ---------- */

    openListing: function (id) {
      set(closeTransient({ screen: 'detail', detailItem: id === 'mango' ? 'mango' : 'generator', carPhotoIdx: 0 }));
    },
    carPhoto: function (i) { set({ carPhotoIdx: parseInt(i, 10) || 0 }); },
    toggleQA: function () { set({ qaOpen: !Store.get().qaOpen }); },

    /* ---------- search ---------- */

    closeSearch: function () { set({ screen: 'home', searchQuery: '' }); },
    searchFor: function (q) { set({ searchQuery: q }); },

    /* ---------- cart ---------- */

    qty: function (arg) {
      var parts = String(arg).split(':');
      var key = parts[0] + 'Qty';
      var delta = parseInt(parts[1], 10);
      var patch = {};
      patch[key] = Math.max(1, (Store.get()[key] || 1) + delta);
      set(patch);
    },
    saveForLater: function (key) { var p = {}; p[key + 'Saved'] = true; set(p); },
    moveToCart: function (key) { var p = {}; p[key + 'Saved'] = false; set(p); },
    removeItem: function (key) {
      var p = {};
      p[key + 'Removed'] = true;
      p[key + 'Saved'] = false;
      p.cartCount = Math.max(0, Store.get().cartCount - 1);
      set(p);
    },
    toggleCartSummary: function () { set({ cartSummaryOpen: !Store.get().cartSummaryOpen }); },

    /* ---------- offers ---------- */

    acceptOffer: function () { set({ offer: 'accepted' }); },
    declineOffer: function () { set({ offer: 'declined' }); },
    resetOffer: function () { set({ offer: 'open' }); },

    /* ---------- inbox ---------- */

    msgTab: function (tab) { set({ msgTab: tab }); },

    /* ---------- account / gates ---------- */

    wantedGate: function () { set({ wantedGateOpen: true }); },
    closeWantedGate: function () { set({ wantedGateOpen: false }); },
    openLogin: function () { set({ wantedGateOpen: false, screen: 'login' }); },
    logOut: function () { set({ screen: 'login' }); },
    completeVerify: function () { set({ verified: true, screen: 'profile' }); },
    startSelling: function () { set({ isSeller: true, screen: 'sell' }); },

    openAiAssist: function () { set({ aiAssistOpen: true }); },
    closeAiAssist: function () { set({ aiAssistOpen: false }); },

    /* ---------- desktop ---------- */

    deskOpenItem: function (id) {
      var item = D.LISTINGS.filter(function (i) { return i.id === id; })[0] || null;
      set({ deskDetail: true, deskItem: item, deskSub: null });
    },
    deskCloseDetail: function () { set({ deskDetail: false, deskItem: null }); },
    deskOpenJob: function () { set({ deskSub: 'job', deskDetail: false }); },
    deskOpenShop: function () { set({ deskSub: 'shop', deskDetail: false }); },
    deskBack: function () { set({ deskSub: null }); },

    /* ---------- external ---------- */

    whatsapp: function () { global.open('https://wa.me/16648001234', '_blank'); },
    flymni: function () { global.open('https://www.flymontserrat.com', '_blank'); },

    /* ---------- no-ops ---------- */

    // `stop` exists so a click inside a dismissible overlay does not close it;
    // `noop` marks a control that is deliberately inert in the demo.
    stop: function () {},
    noop: function () {}
  };

  // Either frame may be absent: index.html has both, web.html only the desktop
  // (and so does not load the mobile screen modules at all).
  function render(s) {
    var phone = document.getElementById('phone');
    if (phone && S.home) {
      // Screen names match the exported function names one for one.
      var screen = typeof S[s.screen] === 'function' ? S[s.screen] : S.home;
      phone.innerHTML = screen(s) + S.overlays(s);
    }
    var desk = document.getElementById('desktop');
    if (desk) {
      desk.innerHTML = S.desktop(s, { chrome: desk.dataset.chrome !== 'off' });
    }
  }

  /* ---------- events ---------- */

  function onClick(e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!el) return;
    var name = el.dataset.act;
    var fn = actions[name];
    if (!fn) return;
    // closest() returns the innermost action, so a heart inside a card runs the
    // heart's handler (often `stop`) and never the card's.
    fn(el.dataset.arg);
  }

  function onInput(e) {
    var el = e.target;
    if (!el.dataset || el.dataset.input !== 'search') return;
    set({ searchQuery: el.value, deskDetail: false, deskSub: null });
  }

  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);

  Store.subscribe(render);
  Store.render();
})(window);
