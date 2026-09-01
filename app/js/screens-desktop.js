/* Emerald Marketplace — desktop web app (1440px, shown inside a browser mock).
   Same state as the phone: switching a tab or category here moves both. */

(function (global) {
  'use strict';

  var U = global.EMUI, D = global.EMData;
  var act = U.act, when = U.when, map = U.map, esc = U.esc, bg = U.bg;
  var S = global.EMScreens = global.EMScreens || {};

  var CARD_SHADOW = 'box-shadow: 0 1px 0 rgba(23,35,29,0.07);';
  var TILE_SHADOW = 'box-shadow: 0 1px 0 rgba(23,35,29,0.07), 0 8px 20px -14px rgba(23,35,29,0.3);';

  /* ============================== CHROME ============================== */

  function browserBar() {
    return '<div style="background: #E7E4DD; padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #D8D5CD;">'
      + '<div style="display: flex; gap: 7px;">'
      + '<div style="width: 11px; height: 11px; border-radius: 50%; background: #C9C5BC;"></div>'
      + '<div style="width: 11px; height: 11px; border-radius: 50%; background: #C9C5BC;"></div>'
      + '<div style="width: 11px; height: 11px; border-radius: 50%; background: #C9C5BC;"></div></div>'
      + '<div style="flex: 1; background: #FFFFFF; border-radius: 8px; padding: 7px 14px; font-size: 12.5px; color: #7C8697; font-family: \'IBM Plex Mono\', monospace;">emeraldmarketplace.ms</div></div>';
  }

  // The badge sits in reserved padding to the right of the label (see NAV_LINK)
  // rather than on top of it — the prototype's -12px offset covered the last
  // two letters, printing "Messag3" and "Ca2".
  function navBadge(n) {
    return '<div style="position: absolute; top: -7px; right: 0px; min-width: 17px; height: 17px; border-radius: 9px; background: #F0B454; color: #2A1D06; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; padding: 0 4px; border: 1.5px solid #0E3F80;">' + n + '</div>';
  }

  var NAV_LINK = 'color: #E6EEF9; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;';
  var NAV_LINK_BADGED = NAV_LINK + ' position: relative; padding-right: 24px;';

  function header(s) {
    var tabs = [
      { key: 'sellers', label: 'Listings' },
      { key: 'wanted', label: 'Wanted' },
      { key: 'jobs', label: 'Jobs' },
      { key: 'shops', label: 'Shops', soon: true },
      { key: 'travel', label: 'Travel', soon: true }
    ];
    // The blue bar runs full-bleed; its contents stay centred on a wide screen.
    return '<div style="background: #0E3F80; padding: 0 44px;">'
      + '<div style="max-width: 1440px; margin: 0 auto;">'
      + '<div style="display: flex; align-items: center; gap: 28px; padding: 18px 0;">'

      + '<div ' + act('nav', 'home') + ' style="display: flex; align-items: center; gap: 11px; cursor: pointer; flex-shrink: 0;">'
      // Shamrock-ish mark in amber on blue: island identity without state insignia.
      + '<div style="width: 36px; height: 36px; border-radius: 11px; background: #F0B454; position: relative;">'
      + '<div style="position: absolute; top: 7px; left: 9px; width: 9px; height: 9px; border-radius: 50%; background: #0B4630;"></div>'
      + '<div style="position: absolute; top: 7px; left: 18px; width: 9px; height: 9px; border-radius: 50%; background: #0B4630;"></div>'
      + '<div style="position: absolute; top: 16px; left: 13.5px; width: 9px; height: 9px; border-radius: 50%; background: #0B4630;"></div>'
      + '<div style="position: absolute; top: 24px; left: 17px; width: 2px; height: 7px; background: #0B4630;"></div></div>'
      + '<div style="display: flex; flex-direction: column; line-height: 1;">'
      + '<div style="color: #FFFFFF; font-weight: 800; font-size: 20px; letter-spacing: -0.01em;">Emerald Marketplace</div>'
      + '<div style="color: rgba(230,238,249,0.7); font-size: 10px; font-weight: 600; letter-spacing: 0.16em; margin-top: 4px;">MONTSERRAT · WEST INDIES</div></div></div>'

      // The search box is the only element allowed to give up width; every nav
      // item keeps its label intact.
      + '<div style="flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 10px; background: #FFFFFF; border-radius: 12px; padding: 13px 16px; max-width: 520px;">'
      + '<span style="color: #7C8697; font-size: 15px;">⌕</span>'
      + '<input data-focus-key="deskSearch" data-input="search" value="' + esc(s.searchQuery) + '" placeholder="Search the island…" '
      + 'style="border: none; outline: none; background: transparent; flex: 1; font-size: 14.5px; color: #16233A; font-family: inherit;" />'
      + U.ICON.micLg + '</div>'

      + '<div style="margin-left: auto; display: flex; align-items: center; gap: 22px; flex-shrink: 0;">'
      + '<div ' + act('nav', 'messages') + ' style="' + NAV_LINK_BADGED + '">Messages' + navBadge(3) + '</div>'
      + '<div ' + act('nav', 'saved') + ' style="' + NAV_LINK + '">Saved</div>'
      + '<div ' + act('nav', 'cart') + ' style="' + NAV_LINK_BADGED + '">Cart' + navBadge(s.cartCount) + '</div>'
      + '<div ' + act('nav', 'profile') + ' style="display: flex; align-items: center; gap: 9px; ' + NAV_LINK + '">'
      + '<div style="width: 30px; height: 30px; border-radius: 50%; background: repeating-linear-gradient(135deg, #2E7256 0 5px, #276549 5px 10px); flex-shrink: 0;"></div>Ashley</div>'
      + '<div ' + act('nav', 'sell') + ' style="background: #F0B454; color: #2A1D06; font-size: 14px; font-weight: 700; padding: 12px 20px; border-radius: 11px; cursor: pointer; white-space: nowrap;">+ Sell an item</div></div></div>'

      + '<div style="display: flex; gap: 26px; padding-bottom: 14px;">'
      + map(tabs, function (t) {
        return '<div ' + act('market', t.key) + ' style="' + U.deskTab(s.market === t.key) + '">' + t.label
          + when(t.soon, ' <span style="font-size: 8px; font-weight: 800; color: #F0B454;">SOON</span>') + '</div>';
      }) + '</div></div></div>';
  }

  /* ============================ SIDEBAR CARDS =========================== */

  function sideCard(title, body, extra) {
    return '<div style="background: #FFFFFF; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 14px; ' + CARD_SHADOW + '">'
      + '<div style="font-size: 14px; font-weight: 800; color: #17231D;">' + title + '</div>' + body + (extra || '') + '</div>';
  }

  function sideFilterRows(items, activeKey, action, counts, styleFn) {
    return '<div style="display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: #3A4553;">'
      + map(items, function (i) {
        return '<div ' + act(action, i.key) + ' style="display: flex; justify-content: space-between; cursor: pointer;">'
          + '<span style="' + styleFn(i.key === activeKey) + '">' + i.label + '</span>'
          + '<span style="color: #8B94A3;">' + counts[i.key] + '</span></div>';
      }) + '</div>';
  }

  function promoCard(bgColour, title, body, cta) {
    return '<div style="background: ' + bgColour + '; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: ' + (cta ? '10px' : '8px') + ';">'
      + '<div style="color: #FFFFFF; font-size: 14.5px; font-weight: 800;">' + title + '</div>'
      + '<div style="color: rgba(230,238,249,0.82); font-size: 12.5px; line-height: 1.5;">' + body + '</div>'
      + (cta || '') + '</div>';
  }

  var FULFILLMENT_CARD = '<div style="background: #FFFFFF; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 13px; ' + CARD_SHADOW + '">'
    + '<div style="font-size: 14px; font-weight: 800; color: #17231D;">Fulfillment</div>'
    + '<div style="display: flex; flex-direction: column; gap: 9px; font-size: 13.5px; color: #3A4553;">'
    + '<div style="display: flex; align-items: center; gap: 9px;"><div style="width: 16px; height: 16px; border-radius: 4px; background: #0E3F80; color: #FFF; font-size: 11px; display: flex; align-items: center; justify-content: center;">✓</div>Delivery available</div>'
    + '<div style="display: flex; align-items: center; gap: 9px;"><div style="width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #C6CDD9;"></div>Pickup only</div></div></div>';

  /* ============================== SORTING =============================== */

  // Desktop gets a dropdown anchored under its own button; the phone's bottom
  // sheet is driven by the same state, so both stay in step.
  function sortButton(label, openAction, closeAction, setAction, open, options, current) {
    return '<div style="position: relative;">'
      + '<div ' + act(openAction) + ' style="background: #FFFFFF; border: 1px solid #DDE4EE; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; color: #3A4553; cursor: pointer; white-space: nowrap;">Sort: ' + label + ' ⌄</div>'
      + (open
        ? '<div ' + act(closeAction) + ' style="position: fixed; inset: 0; z-index: 40;"></div>'
          + '<div style="position: absolute; top: calc(100% + 6px); right: 0; z-index: 41; background: #FFFFFF; border: 1px solid #E4E7E2; border-radius: 12px; box-shadow: 0 18px 40px -18px rgba(23,35,29,0.45); min-width: 210px; overflow: hidden;">'
          + map(options, function (o) {
            return '<div ' + act(setAction, o.key) + ' style="padding: 11px 16px; font-size: 13px; cursor: pointer; '
              + (current === o.key ? 'font-weight: 700; color: #0E3F80; background: #F7FCF9;' : 'font-weight: 600; color: #16233A;') + '">' + o.label + '</div>';
          }) + '</div>'
        : '')
      + '</div>';
  }

  var LISTING_SORTS = [
    { key: 'newest', label: 'Newest first' },
    { key: 'price', label: 'Price: low to high' },
    { key: 'priceDesc', label: 'Price: high to low' },
    { key: 'near', label: 'Nearest to me' },
    { key: 'delivery', label: 'Delivery available' },
    { key: 'viewed', label: 'Most viewed' }
  ];
  var WANTED_SORTS = [
    { key: 'newest', label: 'Newest first' },
    { key: 'budget', label: 'Budget: low to high' },
    { key: 'budgetDesc', label: 'Budget: high to low' },
    { key: 'offers', label: 'Most offers' },
    { key: 'fewOffers', label: 'Fewest offers' }
  ];
  var JOB_SORTS = [
    { key: 'newest', label: 'Newest first' },
    { key: 'pay', label: 'Pay: low to high' },
    { key: 'payDesc', label: 'Pay: high to low' },
    { key: 'viewed', label: 'Most viewed' }
  ];

  /* ============================== LISTINGS ============================== */

  function listingCard(item) {
    return '<div ' + act('deskOpenItem', item.id) + ' style="background: #FFFFFF; border-radius: 16px; overflow: hidden; ' + TILE_SHADOW + ' cursor: pointer;">'
      + '<div style="height: 168px; ' + bg(item.img, item.tint) + ' position: relative;">'
      + '<span ' + act('stop') + ' style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.94); border-radius: 999px; padding: 5px 9px; font-size: 12px; color: #0E3F80; cursor: pointer;">♡</span></div>'
      + '<div style="padding: 13px 14px 15px; display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="font-size: 18px; font-weight: 800; color: #17231D;">' + item.price + '</div>'
      + '<div style="font-size: 14px; font-weight: 500; color: #3A4553; line-height: 1.35;">' + item.title + '</div>'
      + '<div style="font-size: 12px; color: #7C8697;">' + item.location + ' · ' + item.timeAgo + ' ago</div>'
      + when(item.badgeText, '<div style="margin-top: 5px; align-self: flex-start; background: ' + item.badgeBg + '; color: ' + item.badgeColor + '; font-size: 10.5px; font-weight: 700; padding: 4px 8px; border-radius: 5px;">' + item.badgeText + '</div>')
      + '</div></div>';
  }

  function listingsView(s) {
    var items = D.sortedListings(s.cat, s.sortBy);
    var catKey = s.cat.length ? s.cat[0] : '';
    var cats = D.CATS.map(function (c) { return { key: c.key, label: c.key === '' ? 'All listings' : c.label }; });

    var sidebar = '<div style="width: 244px; flex-shrink: 0; display: flex; flex-direction: column; gap: 22px;">'
      + sideCard('Category',
          sideFilterRows(cats, catKey, 'cat', D.DESK_CAT_COUNTS, U.deskSide),
          '<div style="font-size: 11px; color: #8B94A3;">Pick a category to narrow the list.</div>')

      + '<div style="background: #FFFFFF; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 13px; ' + CARD_SHADOW + '">'
      + '<div style="font-size: 14px; font-weight: 800; color: #17231D;">Price (EC$)</div>'
      + '<div style="display: flex; gap: 8px;">'
      + '<div style="flex: 1; border: 1px solid #DDE4EE; border-radius: 9px; padding: 9px 11px; font-size: 13px; color: #8B94A3;">Min</div>'
      + '<div style="flex: 1; border: 1px solid #DDE4EE; border-radius: 9px; padding: 9px 11px; font-size: 13px; color: #8B94A3;">Max</div></div>'
      + '<div style="height: 1px; background: #E4E7E2;"></div>'
      + '<div style="font-size: 14px; font-weight: 800; color: #17231D;">Fulfillment</div>'
      + '<div style="display: flex; flex-direction: column; gap: 9px; font-size: 13.5px; color: #3A4553;">'
      + '<div style="display: flex; align-items: center; gap: 9px;"><div style="width: 16px; height: 16px; border-radius: 4px; background: #0E3F80; color: #FFF; font-size: 11px; display: flex; align-items: center; justify-content: center;">✓</div>Delivery available</div>'
      + '<div style="display: flex; align-items: center; gap: 9px;"><div style="width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #C6CDD9;"></div>Pickup only</div></div>'
      + '<div style="height: 1px; background: #E4E7E2;"></div>'
      + '<div style="font-size: 14px; font-weight: 800; color: #17231D;">Condition</div>'
      + '<div style="display: flex; flex-wrap: wrap; gap: 7px;">'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 12px; font-weight: 700; padding: 6px 11px; border-radius: 999px;">New</div>'
      + '<div style="background: #F1F3F0; color: #4A5A52; font-size: 12px; font-weight: 600; padding: 6px 11px; border-radius: 999px;">Like new</div>'
      + '<div style="background: #F1F3F0; color: #4A5A52; font-size: 12px; font-weight: 600; padding: 6px 11px; border-radius: 999px;">Used</div></div></div>'

      // The prototype printed the icon-label and the text-label side by side
      // ("☆ Save search  Save this search"); one label is what was meant.
      + '<div ' + act('toggleSaveSearch') + ' style="background: #FFFFFF; border: 1.5px solid #0E3F80; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">'
      + '<span style="font-size: 13px; color: ' + (s.searchSaved ? '#E09E3B' : '#0E3F80') + ';">' + (s.searchSaved ? '★' : '☆') + '</span>'
      + '<span style="font-size: 13px; font-weight: 700; color: #0E3F80; white-space: nowrap;">' + (s.searchSaved ? 'Search saved' : 'Save this search') + '</span></div>'

      + promoCard('#0E3F80', 'Selling is free', 'No listing fee. We only take a small cut when you get paid in app.')
      + '</div>';

    var title = !s.cat.length ? "What's new nearby" : (s.cat.length === 1 ? s.cat[0].charAt(0).toUpperCase() + s.cat[0].slice(1) : s.cat.length + ' categories');

    var main = '<div style="flex: 1; min-width: 380px; display: flex; flex-direction: column; gap: 18px;">'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="display: flex; flex-direction: column; gap: 4px;">'
      + '<div style="font-size: 22px; font-weight: 800; color: #17231D; letter-spacing: -0.01em;">' + title + '</div>'
      + '<div style="font-size: 13px; color: #7C8697;">' + items.length + ' shown of 412 listings from 186 neighbours</div></div>'
      + '<div style="display: flex; align-items: center; gap: 10px;">'
      + sortButton(U.SORT_LABELS[s.sortBy], 'openSort', 'closeSort', 'sort', s.sortOpen, LISTING_SORTS, s.sortBy)
      + '<div ' + act('toggleListView') + ' style="background: #FFFFFF; border: 1px solid #DDE4EE; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; color: #3A4553; cursor: pointer;">' + (s.listView ? 'List ☰' : 'Grid ▦') + '</div></div></div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px;">' + map(items, listingCard) + '</div>'
      + when(!items.length, '<div style="background: #FFFFFF; border-radius: 16px; padding: 44px; text-align: center; color: #7C8697; font-size: 14px;">Nothing listed in this category yet.</div>')
      + '</div>';

    return '<div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start;">' + sidebar + main + '</div>';
  }

  /* =============================== SHOPS =============================== */

  function shopTile(shop) {
    var thumb = shop.pattern ? 'background: ' + shop.pattern + ';' : bg(shop.img, shop.tint);
    var right = shop.delivers
      ? '<div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-end;">'
        + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10px; font-weight: 800; padding: 4px 7px; border-radius: 5px;">OPEN</div>'
        + '<div style="background: #FBF0DC; color: #8A5B0E; font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 5px;">DELIVERY AVAIL.</div></div>'
      : shop.statusStyle === 'closed'
        ? '<div style="background: #F2E7E4; color: #A8483A; font-size: 10px; font-weight: 800; padding: 4px 7px; border-radius: 5px;">' + shop.status + '</div>'
        : '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10px; font-weight: 800; padding: 4px 7px; border-radius: 5px;">' + shop.status + '</div>';
    return '<div ' + act('deskOpenShop') + ' style="background: #FFFFFF; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 13px; ' + CARD_SHADOW + ' cursor: pointer;">'
      + '<div style="width: 58px; height: 58px; border-radius: 12px; ' + thumb + ' flex-shrink: 0;"></div>'
      + '<div style="flex: 1;"><div style="font-size: 15px; font-weight: 700; color: #16233A;">' + shop.name + '</div>'
      + '<div style="font-size: 12px; color: #7C8697;">' + shop.meta + '</div></div>' + right + '</div>';
  }

  function shopsView(s) {
    var shopCats = D.SHOP_CATS.map(function (c) {
      return { key: c.key, label: c.key === 'all' ? 'All shops' : c.key === 'prime' ? 'PRIME · made here' : c.label };
    });
    var sidebar = '<div style="width: 244px; flex-shrink: 0; display: flex; flex-direction: column; gap: 22px;">'
      + sideCard('Shop type', sideFilterRows(shopCats, s.shopCat, 'shopCat', D.DESK_SHOP_COUNTS, U.deskSide))
      + FULFILLMENT_CARD
      + promoCard('#0E3F80', 'Own a shop?', 'List your storefront and reach the whole island.')
      + '</div>';

    var sections = map(D.SHOP_SECTIONS, function (sec) {
      var visible = sec.always ? sec.shops : sec.shops.filter(function (sh) { return D.shopVisible(s.shopCat, sh); });
      if (!visible.length) return '';
      return '<div style="display: flex; flex-direction: column; gap: 12px;">'
        + '<div style="font-size: 12px; font-weight: 800; letter-spacing: 0.06em; color: #8B94A3;">' + sec.heading + '</div>'
        + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap: 16px;">' + map(visible, shopTile) + '</div></div>';
    });

    var main = '<div style="flex: 1; min-width: 380px; display: flex; flex-direction: column; gap: 22px;">'
      + '<div><div style="font-size: 24px; font-weight: 800; color: #17231D;">Shops near you</div>'
      + '<div style="font-size: 13px; color: #8B94A3; margin-top: 3px;">24 shops open on the island</div></div>'
      + '<div style="display: flex; flex-direction: column; gap: 22px;">' + sections + '</div></div>';

    return '<div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start;">' + sidebar + main + '</div>';
  }

  /* =============================== WANTED =============================== */

  function wantedTile(item) {
    return '<div ' + (item.screen ? act('nav', item.screen) : act('wantedGate'))
      + ' style="background: #FFFFFF; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 14px; ' + CARD_SHADOW + ' cursor: pointer;">'
      + '<div style="width: 46px; height: 46px; border-radius: 12px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 21px; flex-shrink: 0;">' + item.icon + '</div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="display: flex; align-items: center; gap: 8px;">'
      + '<div style="font-size: 15px; font-weight: 700; color: #16233A;">' + item.title + '</div>'
      + '<div style="background: #F4F2EC; color: #6C7585; font-size: 9.5px; font-weight: 800; padding: 3px 7px; border-radius: 5px; white-space: nowrap;">' + item.catLabel + '</div></div>'
      + '<div style="display: flex; align-items: center; gap: 8px;">'
      + when(item.budgetLabel, '<div style="background: #E4EDF9; color: #0E3F80; font-size: 11.5px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">' + item.budgetLabel + '</div>')
      + '<div style="font-size: 12px; color: #8B94A3;">' + item.location + ' · ' + item.timeAgo + ' · ' + item.offers + ' offers</div></div></div>'
      + '<div style="font-size: 17px; color: #C6CDD9;">›</div></div>';
  }

  function wantedView(s) {
    var items = D.wantedItems(s.wantedCat, s.wantedSortBy);
    var cats = [
      { key: 'all', label: 'All asks' }, { key: 'goods', label: 'Goods' },
      { key: 'services', label: 'Services' }, { key: 'food', label: 'Food' },
      { key: 'equipment', label: 'Equipment' }, { key: 'other', label: 'Other' }
    ];
    var sidebar = '<div style="width: 244px; flex-shrink: 0; display: flex; flex-direction: column; gap: 22px;">'
      + sideCard('Category', sideFilterRows(cats, s.wantedCat, 'wantedCat', D.DESK_WANTED_COUNTS, U.deskSide))
      + promoCard('#16233A', "Can't find it?", 'Post what you need and let sellers come to you.')
      + '</div>';

    var main = '<div style="flex: 1; min-width: 380px; display: flex; flex-direction: column; gap: 22px;">'
      + '<div style="display: flex; align-items: flex-end; justify-content: space-between;">'
      + '<div><div style="font-size: 24px; font-weight: 800; color: #17231D;">What the island is asking for</div>'
      + '<div style="font-size: 13px; color: #8B94A3; margin-top: 3px;">14 open requests</div></div>'
      + sortButton(U.WANTED_SORT_LABELS[s.wantedSortBy], 'openWantedSort', 'closeWantedSort', 'wantedSort', s.wantedSortOpen, WANTED_SORTS, s.wantedSortBy) + '</div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap: 16px;">' + map(items, wantedTile) + '</div></div>';

    return '<div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start;">' + sidebar + main + '</div>';
  }

  /* ================================ JOBS ================================ */

  function jobTile(item) {
    return '<div ' + act('deskOpenJob') + ' style="background: #FFFFFF; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 14px; ' + CARD_SHADOW + ' cursor: pointer;">'
      + '<div style="width: 46px; height: 46px; border-radius: 12px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 21px; flex-shrink: 0;">' + item.icon + '</div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="display: flex; align-items: center; gap: 8px;">'
      + '<div style="font-size: 15px; font-weight: 700; color: #16233A;">' + item.title + '</div>'
      + '<div style="background: #F4F2EC; color: #6C7585; font-size: 9.5px; font-weight: 800; padding: 3px 7px; border-radius: 5px; white-space: nowrap;">' + item.typeLabel + '</div></div>'
      + '<div style="display: flex; align-items: center; gap: 8px;">'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 11.5px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">' + item.payLabel + '</div>'
      + '<div style="font-size: 12px; color: #8B94A3;">' + item.employer + ' · ' + item.location + ' · ' + item.applied + ' applied</div></div></div>'
      + '<div style="font-size: 17px; color: #C6CDD9;">›</div></div>';
  }

  function jobsView(s) {
    var items = D.jobItems(s.jobCat, s.jobSortBy);
    var cats = [
      { key: 'all', label: 'All openings' }, { key: 'retail', label: 'Retail' },
      { key: 'trades', label: 'Trades &amp; labor' }, { key: 'hospitality', label: 'Hospitality' },
      { key: 'delivery', label: 'Delivery' }
    ];
    var sidebar = '<div style="width: 244px; flex-shrink: 0; display: flex; flex-direction: column; gap: 22px;">'
      + sideCard('Job type', sideFilterRows(cats, s.jobCat, 'jobCat', D.DESK_JOB_COUNTS, U.deskSide))
      + promoCard('#0E3F80', 'Hiring on island?', 'Post a job free and reach people looking for work today.',
          '<div ' + act('wantedGate') + ' style="background: #F0B454; color: #2A1D06; font-size: 13px; font-weight: 700; padding: 10px; border-radius: 9px; text-align: center; cursor: pointer;">+ Post a job — free</div>')
      + '</div>';

    var main = '<div style="flex: 1; min-width: 380px; display: flex; flex-direction: column; gap: 22px;">'
      + '<div style="display: flex; align-items: flex-end; justify-content: space-between;">'
      + '<div><div style="font-size: 24px; font-weight: 800; color: #17231D;">Jobs on Montserrat</div>'
      + '<div style="font-size: 13px; color: #8B94A3; margin-top: 3px;">Openings posted by island employers</div></div>'
      + sortButton(U.JOB_SORT_LABELS[s.jobSortBy], 'openJobSort', 'closeJobSort', 'jobSort', s.jobSortOpen, JOB_SORTS, s.jobSortBy) + '</div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap: 16px;">' + map(items, jobTile) + '</div></div>';

    return '<div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start;">' + sidebar + main + '</div>';
  }

  /* =============================== TRAVEL =============================== */

  function stayTile(o, imgHeight) {
    return '<div style="background: #FFFFFF; border-radius: 16px; overflow: hidden; ' + CARD_SHADOW + ' cursor: pointer;">'
      + '<div style="height: ' + imgHeight + 'px; ' + bg(o.imgBig, o.tint) + '"></div>'
      + '<div style="padding: 13px 14px;">'
      + '<div style="font-size: 15px; font-weight: 700; color: #16233A;">' + o.name + '</div>'
      + '<div style="font-size: 12px; color: #7C8697;">' + (o.deskMeta || o.meta) + '</div>'
      + '<div style="font-size: 16px; font-weight: 800; color: #16233A; margin-top: 4px;">' + (o.deskPrice || o.price)
      + '<span style="font-size: 11px; font-weight: 500; color: #7C8697;">' + o.unit + '</span></div></div></div>';
  }

  function travelView() {
    var sidebar = '<div style="width: 244px; flex-shrink: 0; display: flex; flex-direction: column; gap: 22px;">'
      + '<div style="background: #16233A; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 12px;">'
      + '<div style="width: 40px; height: 40px; border-radius: 10px; background: #F0B454; display: flex; align-items: center; justify-content: center; font-size: 18px;">✈️</div>'
      + '<div style="color: #FFFFFF; font-size: 14.5px; font-weight: 800;">Fly here</div>'
      + '<div style="color: rgba(230,238,249,0.75); font-size: 12.5px; line-height: 1.5;">Fly Montserrat, Winair &amp; SVG Air serve the island.</div>'
      + '<div ' + act('flymni') + ' style="background: #F0B454; color: #2A1D06; font-size: 13px; font-weight: 700; padding: 10px; border-radius: 9px; text-align: center; cursor: pointer;">Book flights ↗</div></div>'
      + '<div style="background: #FFFFFF; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 10px; ' + CARD_SHADOW + '">'
      + '<div style="font-size: 14px; font-weight: 800; color: #17231D;">Hotels</div>'
      + '<div style="font-size: 12.5px; color: #7C8697; line-height: 1.5;">Licensed hotels &amp; guesthouses on island — book direct.</div></div></div>';

    var main = '<div style="flex: 1; min-width: 380px; display: flex; flex-direction: column; gap: 22px;">'
      + '<div><div style="font-size: 24px; font-weight: 800; color: #17231D;">Hotels on the island</div>'
      + '<div style="font-size: 13px; color: #8B94A3; margin-top: 3px;">Montserrat\'s licensed hotels &amp; guesthouses</div></div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 18px;">'
      + map(D.HOTELS, function (h) { return stayTile(h, 150); }) + '</div>'

      + '<div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">'
      + '<div style="font-size: 18px; font-weight: 800; color: #17231D;">Tours &amp; experiences</div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 18px;">'
      + map(D.TOURS, function (t) { return stayTile(t, 140); }) + '</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #17231D;">Airlines serving Montserrat</div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 14px;">'
      + map(D.AIRLINES, function (a) {
        return '<div ' + act('flymni') + ' style="position: relative; background: #FFFFFF; border: 1px solid #E4E7E2; border-radius: 14px; padding: 14px; display: flex; align-items: center; gap: 11px; cursor: pointer;">'
          + '<div style="position: absolute; top: 7px; right: 9px; font-size: 8px; font-weight: 800; letter-spacing: 0.04em; color: #C6CDD9;">AD</div>'
          + '<div style="width: 44px; height: 34px; border-radius: 8px; background: ' + a.bg + '; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: ' + a.color + '; letter-spacing: -0.01em; flex-shrink: 0;">' + a.shortDesk + '</div>'
          + '<div><div style="color: #16233A; font-size: 13.5px; font-weight: 700;">' + a.deskName + '</div>'
          + '<div style="color: #7C8697; font-size: 11px;">' + a.route + '</div></div></div>';
      }) + '</div></div></div>';

    return '<div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: flex-start;">' + sidebar + main + '</div>';
  }

  /* ============================ DETAIL VIEWS ============================ */

  function detailView(s) {
    var item = s.deskItem || D.LISTINGS[0];
    var isFarm = item.cat === 'farm';
    var isVehicle = item.cat === 'vehicles';
    var specs = isFarm
      ? [['Variety', 'Julie mango'], ['Quantity', '~40-45 fruit'], ['Harvested', 'This morning'], ['Ready to eat', '1-2 days']]
      : isVehicle
        ? [['Make', 'Toyota'], ['Model', 'Land Cruiser'], ['Year', '2018'], ['Mileage', '~62,000 km']]
        : [['Category', item.catLabel], ['Location', item.location]];
    var description = isFarm
      ? 'Whole crate, about 40-45 mangoes, picked this morning off the tree. Sweet Julie variety, ready to eat in a day or two.'
      : isVehicle
        ? '2018 Toyota Land Cruiser, well maintained, single owner. Serviced regularly, new tires. Ready to drive, no issues. Serious inquiries only.'
        : item.title + '. Well cared for, priced to sell. Serious inquiries only.';

    return '<div ' + act('deskCloseDetail') + ' style="font-size: 13px; font-weight: 700; color: #0E3F80; cursor: pointer; margin-bottom: 16px;">‹ Back to listings</div>'
      + '<div style="display: flex; gap: 40px; max-width: 1100px; flex-wrap: wrap; align-items: flex-start;">'

      + '<div style="flex: 1.1; min-width: 420px; display: flex; flex-direction: column; gap: 14px;">'
      + '<div style="height: 420px; border-radius: 18px; ' + bg(item.img, item.tint) + '"></div>'
      + '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">'
      + '<div style="height: 82px; border-radius: 10px; border: 2px solid #0E3F80; background: repeating-linear-gradient(135deg, #DDE4EE 0 8px, #D3DBE7 8px 16px);"></div>'
      + '<div style="height: 82px; border-radius: 10px; background: repeating-linear-gradient(135deg, #E3DED2 0 8px, #DBD5C7 8px 16px);"></div>'
      + '<div style="height: 82px; border-radius: 10px; background: repeating-linear-gradient(135deg, #D9E2E4 0 8px, #CFD9DC 8px 16px);"></div>'
      + '<div style="height: 82px; border-radius: 10px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #6C7585;">+2</div></div>'

      + '<div style="background: #FFFFFF; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 12px; ' + CARD_SHADOW + '">'
      + '<div style="font-size: 13px; font-weight: 800; letter-spacing: 0.04em; color: #6C7585;">DETAILS</div>'
      + '<div style="display: grid; grid-template-columns: repeat(' + (specs.length > 2 ? 4 : 2) + ', 1fr); gap: 14px; font-size: 13px;">'
      + map(specs, function (p) {
        return '<div><span style="color: #8B94A3;">' + p[0] + '</span><br/><span style="color: #16233A; font-weight: 600;">' + p[1] + '</span></div>';
      }) + '</div></div>'

      + '<div style="height: 160px; border-radius: 14px; overflow: hidden; position: relative; background: #DDE6DE;">'
      + '<svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice">'
      + '<rect width="600" height="160" fill="#DCE6DD"/><path d="M0 100 Q140 60 280 95 T600 80" stroke="#C3D3C6" stroke-width="18" fill="none"/></svg>'
      + '<div style="position: absolute; top: 60px; left: 280px; width: 30px; height: 30px; border-radius: 50%; background: #0E3F80; border: 3px solid #FFFFFF; box-shadow: 0 2px 6px rgba(23,35,29,0.35); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 13px;">📍</div>'
      + '<div style="position: absolute; bottom: 10px; left: 12px; background: rgba(255,255,255,0.9); font-size: 11px; font-weight: 700; color: #16233A; padding: 4px 9px; border-radius: 6px;">General area · ' + item.location + '</div></div>'
      + '</div>'

      + '<div style="flex: 1; min-width: 380px; display: flex; flex-direction: column; gap: 18px;">'
      + '<div><div style="font-size: 13px; font-weight: 700; color: #0E3F80; background: #E4EDF9; display: inline-block; padding: 4px 10px; border-radius: 6px; margin-bottom: 10px;">' + item.catLabel + '</div>'
      + '<div style="font-size: 28px; font-weight: 800; color: #17231D;">' + item.title + '</div>'
      + '<div style="font-size: 26px; font-weight: 800; color: #0E3F80; margin-top: 6px;">' + item.price + '</div></div>'
      + '<div style="display: flex; align-items: center; gap: 10px; font-size: 13px; color: #7C8697;">'
      + '<span>' + item.location + '</span><span>·</span><span>Posted ' + item.timeAgo + ' ago</span><span>·</span><span>' + item.views + ' views</span></div>'
      + when(item.badgeText, '<div style="display: flex; gap: 8px;"><div style="font-size: 11px; font-weight: 800; padding: 5px 10px; border-radius: 6px; background: ' + item.badgeBg + '; color: ' + item.badgeColor + ';">' + item.badgeText + '</div></div>')
      + '<div style="height: 1px; background: #E4E7E2;"></div>'
      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 14px; font-weight: 800; color: #17231D;">Description</div>'
      + '<div style="font-size: 13.5px; color: #4A5A52; line-height: 1.6;">' + description + '</div></div>'
      + '<div style="height: 1px; background: #E4E7E2;"></div>'
      + '<div style="display: flex; align-items: center; gap: 12px;">' + U.avatar(44, '#E6E1D4,#DED8C9')
      + '<div><div style="font-size: 14px; font-weight: 700; color: #16233A;">' + item.seller + '</div>'
      + '<div style="font-size: 12px; color: #8B94A3;">★ 4.8 (18) · Member since 2022 · 96% response rate</div></div></div>'
      + '<div style="display: flex; align-items: flex-start; gap: 9px; background: #FBF0DC; border: 1px solid #F0D9A8; border-radius: 10px; padding: 11px 13px;">'
      + '<span style="font-size: 14px;">🛈</span>'
      + '<div style="font-size: 12px; color: #6B4405; line-height: 1.5;"><b>Pay outside the app and you\'re on your own.</b> Emerald Pay holds payment until you confirm — off-app cash deals get no refund, no dispute support.</div></div>'
      + '<div style="display: flex; gap: 10px; margin-top: 6px;">'
      + '<div ' + act('nav', 'thread') + ' style="flex: 1; border: 1.5px solid #0E3F80; color: #0E3F80; text-align: center; padding: 13px; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer;">Make offer</div>'
      + '<div ' + act('nav', 'collect') + ' style="flex: 1.15; background: #0E3F80; color: #FFFFFF; text-align: center; padding: 13px; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer;">Buy · ' + item.price + '</div>'
      + '<div style="width: 48px; height: 48px; border-radius: 11px; border: 1px solid #DDE4EE; display: flex; align-items: center; justify-content: center; font-size: 17px; color: #0E3F80; cursor: pointer; flex-shrink: 0;">♡</div></div>'
      + '</div></div>'

      + '<div style="max-width: 1100px; margin-top: 30px; display: flex; flex-direction: column; gap: 12px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #17231D;">More from ' + item.seller.split(' ')[0] + '</div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">'
      + map([['EC$85', 'Tool box, full set', '#E3DED2,#DBD5C7'], ['EC$220', 'Pressure washer', '#D9E2E4,#CFD9DC']], function (p) {
        var c = p[2].split(',');
        return '<div style="background: #FFFFFF; border-radius: 14px; overflow: hidden; ' + CARD_SHADOW + '">'
          + '<div style="height: 100px; background: repeating-linear-gradient(135deg, ' + c[0] + ' 0 8px, ' + c[1] + ' 8px 16px);"></div>'
          + '<div style="padding: 10px 12px;"><div style="font-size: 13.5px; font-weight: 700; color: #17231D;">' + p[0] + '</div>'
          + '<div style="font-size: 11.5px; color: #7C8697;">' + p[1] + '</div></div></div>';
      }) + '</div></div>';
  }

  function jobDetailView() {
    var I = D.IMG, T = D.TINT;
    return '<div ' + act('deskBack') + ' style="font-size: 13px; font-weight: 700; color: #0E3F80; cursor: pointer; margin-bottom: 18px;">‹ Back to jobs</div>'
      + '<div style="display: flex; gap: 34px; max-width: 1080px; flex-wrap: wrap; align-items: flex-start;">'
      + '<div style="flex: 1.5; min-width: 420px; display: flex; flex-direction: column; gap: 22px;">'
      + '<div style="background: #FFFFFF; border-radius: 18px; padding: 28px 30px; display: flex; flex-direction: column; gap: 16px; ' + CARD_SHADOW + '">'
      + '<div style="display: flex; align-items: center; gap: 14px;">'
      + '<div style="width: 58px; height: 58px; border-radius: 14px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 26px;">🛒</div>'
      + '<div style="flex: 1;"><div style="font-size: 24px; font-weight: 800; color: #17231D;">Cashier, part-time</div>'
      + '<div style="font-size: 13.5px; color: #7C8697; margin-top: 3px;">Ram\'s Supermarket · Salem · posted 2 days ago</div></div>'
      + '<div style="background: #F4F2EC; color: #6C7585; font-size: 10.5px; font-weight: 800; padding: 5px 9px; border-radius: 6px;">PART-TIME</div></div>'
      + '<div style="display: flex; gap: 10px; flex-wrap: wrap;">'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 13px; font-weight: 700; padding: 7px 13px; border-radius: 8px;">EC$18/hr</div>'
      + '<div style="background: #F4F2EC; color: #3A4553; font-size: 13px; font-weight: 600; padding: 7px 13px; border-radius: 8px;">~24 hrs/week</div>'
      + '<div style="background: #F4F2EC; color: #3A4553; font-size: 13px; font-weight: 600; padding: 7px 13px; border-radius: 8px;">Start: immediately</div></div>'
      + '<div style="height: 1px; background: #EDE9DD;"></div>'
      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #17231D;">About the role</div>'
      + '<div style="font-size: 14px; color: #4A5A52; line-height: 1.65;">Serving customers at the register, handling cash and card payments, restocking shelves during quiet periods and helping with weekly deliveries. Weekend shifts required.</div></div>'
      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #17231D;">What we\'re looking for</div>'
      + '<div style="font-size: 14px; color: #4A5A52; line-height: 1.8;">· Comfortable handling cash accurately<br/>· Friendly with customers, reliable timekeeping<br/>· Able to lift stock boxes<br/>· Previous retail experience helpful, not required</div></div>'
      + '</div></div>'

      + '<div style="flex: 1; min-width: 380px; display: flex; flex-direction: column; gap: 18px;">'
      + '<div style="background: #FFFFFF; border-radius: 18px; padding: 24px; display: flex; flex-direction: column; gap: 14px; ' + CARD_SHADOW + '">'
      + '<div style="display: flex; align-items: center; gap: 12px;">'
      + '<div style="width: 46px; height: 46px; border-radius: 12px; ' + bg(I.grocery, T.shop) + '"></div>'
      + '<div><div style="font-size: 15px; font-weight: 700; color: #16233A;">Ram\'s Supermarket</div>'
      + '<div style="font-size: 12px; color: #7C8697;">Salem · verified employer</div></div></div>'
      + '<div style="font-size: 12.5px; color: #7C8697;">34 views · 5 people applied</div>'
      + '<div ' + act('wantedGate') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 12px; padding: 14px; text-align: center; font-size: 14.5px; font-weight: 700; cursor: pointer;">Apply now</div>'
      + '<div ' + act('nav', 'thread') + ' style="border: 1.5px solid #0E3F80; color: #0E3F80; border-radius: 12px; padding: 13px; text-align: center; font-size: 14px; font-weight: 700; cursor: pointer;">Message employer</div>'
      + '<div style="font-size: 12px; color: #8B94A3; text-align: center;">Contact: 664-491-2020 · jobs@rams.ms</div></div>'
      + '<div style="background: #FBF0DC; border: 1px solid #F0D9A8; border-radius: 12px; padding: 14px 16px; font-size: 12.5px; color: #6B4405; line-height: 1.5;"><b>Never pay to apply.</b> Emerald Marketplace does not charge job seekers — report any employer who asks for money.</div>'
      + '</div></div>';
  }

  function shopDetailView() {
    var I = D.IMG, T = D.TINT;
    var items = [
      { img: I.necklaceBig, price: 'EC$45', name: 'Shell necklace' },
      { img: I.cardsBig, price: 'EC$28', name: 'Volcano print card set' },
      { img: I.basketBig, price: 'EC$60', name: 'Handwoven basket' }
    ];
    return '<div ' + act('deskBack') + ' style="font-size: 13px; font-weight: 700; color: #0E3F80; cursor: pointer; margin-bottom: 18px;">‹ Back to shops</div>'
      + '<div style="max-width: 1080px; display: flex; flex-direction: column; gap: 22px;">'
      + '<div style="height: 240px; border-radius: 18px; ' + bg(I.momentosHero, T.craft) + '"></div>'
      + '<div style="display: flex; gap: 34px; flex-wrap: wrap; align-items: flex-start;">'

      + '<div style="flex: 1.5; min-width: 420px; display: flex; flex-direction: column; gap: 22px;">'
      + '<div style="display: flex; align-items: center; gap: 16px;">'
      + '<div style="width: 72px; height: 72px; border-radius: 16px; ' + bg(I.momentosMark, T.craft) + ' margin-top: -46px; border: 4px solid #F7F6F2;"></div>'
      + '<div style="flex: 1;"><div style="font-size: 26px; font-weight: 800; color: #17231D;">Island Momentos</div>'
      + '<div style="font-size: 13.5px; color: #7C8697; margin-top: 2px;">Little Bay · crafts, souvenirs, jewelry</div></div>'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 11px; font-weight: 800; padding: 6px 10px; border-radius: 6px;">OPEN</div></div>'
      + '<div style="display: flex; gap: 9px; flex-wrap: wrap;">'
      + map(['Made in Montserrat · PRIME', 'Mon–Sat, 9–5', 'Pickup only'], function (t) {
        return '<div style="background: #FFFFFF; border: 1px solid #E4E7E2; color: #3A4553; font-size: 12.5px; font-weight: 600; padding: 7px 12px; border-radius: 8px;">' + t + '</div>';
      }) + '</div>'
      + '<div style="font-size: 14px; color: #4A5A52; line-height: 1.65; max-width: 620px;">Handmade Montserrat crafts, jewelry and souvenirs — a PRIME-exhibiting local favourite. Stop by the shop in Little Bay or message ahead to reserve a piece.</div>'
      + '<div style="display: flex; flex-direction: column; gap: 12px;">'
      + '<div style="font-size: 17px; font-weight: 800; color: #17231D;">Featured items</div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px;">'
      + map(items, function (it) {
        return '<div style="background: #FFFFFF; border-radius: 14px; overflow: hidden; ' + CARD_SHADOW + '">'
          + '<div style="height: 130px; ' + bg(it.img, T.craft) + '"></div>'
          + '<div style="padding: 11px 13px;"><div style="font-size: 15px; font-weight: 800; color: #17231D;">' + it.price + '</div>'
          + '<div style="font-size: 12px; color: #7C8697;">' + it.name + '</div></div></div>';
      }) + '</div></div></div>'

      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 16px;">'
      + '<div style="background: #FFFFFF; border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px; ' + CARD_SHADOW + '">'
      + '<div style="font-size: 12px; font-weight: 800; letter-spacing: 0.05em; color: #6C7585;">CONTACT</div>'
      + '<div style="font-size: 14px; font-weight: 700; color: #16233A;">Sonia P. · Owner</div>'
      + '<div style="font-size: 13px; color: #7C8697;">+1 (664) 491-5502 · Little Bay</div>'
      + '<div ' + act('whatsapp') + ' style="background: #25D366; color: #FFFFFF; border-radius: 11px; padding: 12px; text-align: center; font-size: 14px; font-weight: 700; cursor: pointer;">WhatsApp the shop</div>'
      + '<div ' + act('nav', 'thread') + ' style="border: 1.5px solid #0E3F80; color: #0E3F80; border-radius: 11px; padding: 12px; text-align: center; font-size: 14px; font-weight: 700; cursor: pointer;">Message in app</div></div>'
      + '<div style="height: 150px; border-radius: 14px; overflow: hidden; position: relative; background: #DDE6DE;">'
      + '<svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice"><rect width="400" height="150" fill="#DCE6DD"/><path d="M0 90 Q100 55 200 85 T400 70" stroke="#C3D3C6" stroke-width="16" fill="none"/></svg>'
      + '<div style="position: absolute; top: 52px; left: 190px; width: 28px; height: 28px; border-radius: 50%; background: #0E3F80; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 12px;">📍</div>'
      + '<div style="position: absolute; bottom: 9px; left: 11px; background: rgba(255,255,255,0.9); font-size: 11px; font-weight: 700; color: #16233A; padding: 4px 8px; border-radius: 6px;">Little Bay</div></div>'
      + '</div></div></div>';
  }

  /* ========================== SEARCH / HOME / AUTH ======================= */

  function searchView(s) {
    var results = D.searchListings(s.searchQuery);
    return '<div style="display: flex; flex-direction: column; gap: 18px; max-width: 1180px;">'
      + '<div style="display: flex; align-items: baseline; gap: 12px;">'
      + '<div style="font-size: 22px; font-weight: 800; color: #17231D;">Results for “' + esc(s.searchQuery) + '”</div>'
      + '<div style="font-size: 13px; color: #7C8697;">' + results.length + (results.length === 1 ? ' result' : ' results') + '</div></div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px;">'
      + map(results, function (item) {
        return '<div ' + act('deskOpenItem', item.id) + ' style="background: #FFFFFF; border-radius: 16px; overflow: hidden; ' + TILE_SHADOW + ' cursor: pointer;">'
          + '<div style="height: 150px; ' + bg(item.img, item.tint) + '"></div>'
          + '<div style="padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px;">'
          + '<div style="font-size: 17px; font-weight: 800; color: #17231D;">' + item.price + '</div>'
          + '<div style="font-size: 13.5px; color: #3A4553;">' + item.title + '</div>'
          + '<div style="font-size: 11.5px; color: #7C8697;">' + item.location + ' · ' + item.timeAgo + ' ago</div></div></div>';
      }) + '</div>'
      + when(!results.length, '<div style="background: #FFFFFF; border-radius: 16px; padding: 44px; text-align: center; color: #7C8697; font-size: 14px;">No listings match “' + esc(s.searchQuery) + '” — try a shorter word, or browse by category.</div>')
      + '</div>';
  }

  function homeView() {
    var I = D.IMG, T = D.TINT;
    var entries = [
      { key: 'sellers', icon: '🏷️', label: 'Listings', count: '412 items' },
      { key: 'wanted', icon: '🙋', label: 'Wanted', count: '14 open asks' },
      { key: 'jobs', icon: '💼', label: 'Jobs', count: '3 openings' },
      { key: 'shops', icon: '🛒', label: 'Shops', count: '24 storefronts', soon: true }
    ];
    var newToday = [
      { img: I.vehicleCard, tint: T.vehicle, id: 'landcruiser', price: 'EC$68,500', title: 'Toyota Land Cruiser, 2018', meta: 'Look Out · 1h ago' },
      { img: I.diningCard, tint: T.home, id: 'diningtable', price: 'EC$2,200', title: 'Dining table &amp; 6 chairs', meta: 'Brades · 1d ago' },
      { img: I.mangoCard, tint: T.produce, id: 'mango', price: 'EC$25', title: 'Fresh mango crate', meta: 'Cudjoe Head · 5h ago' },
      { img: I.bedCard, tint: T.bed, id: 'bedset', price: 'EC$3,800', title: 'King bed set', meta: 'Salem · 3d ago' }
    ];

    return '<div style="display: flex; flex-direction: column; gap: 34px;">'
      + '<div style="background: #0E3F80; border-radius: 20px; padding: 44px 46px; display: flex; align-items: center; gap: 40px;">'
      + '<div style="flex: 1.2; display: flex; flex-direction: column; gap: 16px;">'
      + '<div style="color: #F0B454; font-size: 12px; font-weight: 800; letter-spacing: 0.14em;">MONTSERRAT · WEST INDIES</div>'
      + '<div style="color: #FFFFFF; font-size: 40px; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;">Buy, sell and find work<br/>across the island.</div>'
      + '<div style="color: rgba(230,238,249,0.82); font-size: 15px; line-height: 1.55; max-width: 460px;">One place for listings, wanted ads and island jobs — with protected payment and local pickup or delivery.</div>'
      + '<div style="display: flex; gap: 12px; margin-top: 6px;">'
      + '<div ' + act('nav', 'browse') + ' style="background: #F0B454; color: #2A1D06; font-size: 14.5px; font-weight: 700; padding: 14px 24px; border-radius: 12px; cursor: pointer;">Browse listings</div>'
      + '<div ' + act('nav', 'sell') + ' style="border: 1.5px solid rgba(255,255,255,0.5); color: #FFFFFF; font-size: 14.5px; font-weight: 700; padding: 14px 24px; border-radius: 12px; cursor: pointer;">Sell an item</div></div>'
      + '<div ' + act('openLogin') + ' style="color: rgba(230,238,249,0.85); font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 2px;">Already have an account? <span style="color: #F0B454; text-decoration: underline;">Sign in</span></div></div>'
      + '<div style="flex: 1; height: 260px; border-radius: 16px; ' + bg(I.vehicleWide, T.vehicle) + '"></div></div>'

      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">'
      + map(entries, function (e) {
        return '<div ' + act('market', e.key) + ' style="background: #FFFFFF; border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 13px; cursor: pointer; ' + CARD_SHADOW + (e.soon ? ' position: relative;' : '') + '">'
          + when(e.soon, '<div style="position: absolute; top: 10px; right: 12px; background: #E09E3B; color: #FFFFFF; font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 5px;">SOON</div>')
          + '<div style="width: 44px; height: 44px; border-radius: 12px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 20px;">' + e.icon + '</div>'
          + '<div><div style="font-size: 14.5px; font-weight: 700; color: #17231D;">' + e.label + '</div>'
          + '<div style="font-size: 12px; color: #7C8697;">' + e.count + '</div></div></div>';
      }) + '</div>'

      + '<div style="display: flex; flex-direction: column; gap: 14px;">'
      + '<div style="display: flex; align-items: baseline; justify-content: space-between;">'
      + '<div style="font-size: 20px; font-weight: 800; color: #17231D;">New today</div>'
      + '<div ' + act('nav', 'browse') + ' style="font-size: 13px; font-weight: 700; color: #0E3F80; cursor: pointer;">See all listings ›</div></div>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px;">'
      + map(newToday, function (c) {
        return '<div ' + act('deskOpenItem', c.id) + ' style="background: #FFFFFF; border-radius: 16px; overflow: hidden; ' + TILE_SHADOW + ' cursor: pointer;">'
          + '<div style="height: 150px; ' + bg(c.img, c.tint) + '"></div>'
          + '<div style="padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px;">'
          + '<div style="font-size: 17px; font-weight: 800; color: #17231D;">' + c.price + '</div>'
          + '<div style="font-size: 13.5px; color: #3A4553;">' + c.title + '</div>'
          + '<div style="font-size: 11.5px; color: #7C8697;">' + c.meta + '</div></div></div>';
      }) + '</div></div>'

      + '<div style="background: #16233A; border-radius: 18px; padding: 32px 36px; display: flex; align-items: center; justify-content: space-between; gap: 30px;">'
      + '<div><div style="color: #FFFFFF; font-size: 22px; font-weight: 800;">Selling is free to list</div>'
      + '<div style="color: rgba(230,238,249,0.8); font-size: 14px; margin-top: 6px;">We only take a small cut when you get paid through the app.</div></div>'
      + '<div ' + act('nav', 'sell') + ' style="background: #F0B454; color: #2A1D06; font-size: 14.5px; font-weight: 700; padding: 14px 26px; border-radius: 12px; cursor: pointer; white-space: nowrap;">Post a listing</div></div>'
      + '</div>';
  }

  function loginView() {
    var I = D.IMG;
    return '<div style="display: flex; justify-content: center; padding: 20px 0 40px;">'
      + '<div style="width: 900px; display: flex; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px -30px rgba(23,35,29,0.45);">'
      + '<div style="flex: 1; ' + bg(I.loginHero, '#1B4C86') + ' min-height: 480px;"></div>'
      + '<div style="flex: 1; padding: 48px 44px; display: flex; flex-direction: column; gap: 18px;">'
      + '<div style="display: flex; align-items: center; gap: 10px;">'
      + '<div style="width: 32px; height: 32px; border-radius: 10px; background: #0E3F80;"></div>'
      + '<div style="font-size: 17px; font-weight: 800; color: #17231D;">Emerald Marketplace</div></div>'
      + '<div style="font-size: 26px; font-weight: 800; color: #17231D; line-height: 1.2; margin-top: 6px;">Sign in to buy, sell<br/>and reply to asks.</div>'
      + '<div style="font-size: 13.5px; color: #7C8697; line-height: 1.5;">Free account. Verified sellers get a badge buyers trust.</div>'
      + '<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">'
      + '<div ' + act('nav', 'home') + ' style="border: 1px solid #DDE4EE; border-radius: 11px; padding: 13px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 600; color: #17231D; cursor: pointer;"><span style="font-size: 15px; font-weight: 800; color: #4285F4;">G</span>Continue with Google</div>'
      + '<div ' + act('nav', 'home') + ' style="border: 1px solid #DDE4EE; border-radius: 11px; padding: 13px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 600; color: #17231D; cursor: pointer;"><span style="font-size: 15px; font-weight: 800; color: #1877F2;">f</span>Continue with Facebook</div></div>'
      + '<div style="display: flex; align-items: center; gap: 12px; margin: 4px 0;"><div style="flex: 1; height: 1px; background: #E4E7E2;"></div><div style="font-size: 11.5px; color: #A8B3AB;">or</div><div style="flex: 1; height: 1px; background: #E4E7E2;"></div></div>'
      + '<div style="border: 1px solid #DDE4EE; border-radius: 11px; padding: 13px 14px; font-size: 13.5px; color: #8B94A3;">Email address</div>'
      + '<div ' + act('nav', 'home') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 11px; padding: 14px; text-align: center; font-size: 14.5px; font-weight: 700; cursor: pointer;">Continue with email</div>'
      + '<div ' + act('nav', 'home') + ' style="text-align: center; font-size: 13px; font-weight: 600; color: #0E3F80; cursor: pointer; margin-top: 4px;">Browse as guest</div>'
      + '</div></div></div>';
  }

  // Screens that only exist on the phone get a signpost card on desktop.
  var SIMPLE = {
    messages: { icon: '✉', title: 'Inbox', body: 'Your messages and notifications appear here.' },
    thread: { icon: '✉', title: 'Inbox', body: 'Your messages and notifications appear here.' },
    saved: { icon: '♡', title: 'Saved items', body: 'Items and searches you save show up here on any device.' },
    profile: { icon: '☺', title: 'Your profile', body: 'Manage your account, verification, payouts and listings.' },
    cart: { icon: '🛒', title: 'Your cart', body: 'Items you are buying, grouped by seller.' },
    collect: { icon: '📦', title: 'Your orders', body: 'Track pickups and deliveries in progress.' },
    sell: { icon: '＋', title: 'Create a listing', body: 'Post an item in under two minutes — free to list.' }
  };

  function simpleView(screen) {
    var o = SIMPLE[screen];
    return '<div style="display: flex; justify-content: center; padding: 60px 0;">'
      + '<div style="width: 520px; background: #FFFFFF; border-radius: 18px; padding: 44px; text-align: center; ' + CARD_SHADOW + '">'
      + '<div style="font-size: 34px; margin-bottom: 12px;">' + o.icon + '</div>'
      + '<div style="font-size: 20px; font-weight: 800; color: #17231D;">' + o.title + '</div>'
      + '<div style="font-size: 13.5px; color: #7C8697; line-height: 1.6; margin-top: 8px;">' + o.body + '</div>'
      + '<div ' + act('nav', 'browse') + ' style="display: inline-block; margin-top: 20px; background: #0E3F80; color: #FFFFFF; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 11px; cursor: pointer;">Back to listings</div>'
      + '</div></div>';
  }

  /* =============================== ROUTER =============================== */

  // opts.chrome === false renders the site on its own — no browser-window mock,
  // no scaling — which is what the standalone web build wants. The combined
  // view keeps the mock, since there it sits on a page beside the phone.
  S.desktop = function (s, opts) {
    var chrome = !opts || opts.chrome !== false;
    var hasQuery = !!(s.searchQuery && s.searchQuery.trim());
    var body;

    // Strict precedence: a detail view wins over a list, a list over the home page.
    if (s.deskDetail) body = detailView(s);
    else if (s.deskSub === 'job') body = jobDetailView();
    else if (s.deskSub === 'shop') body = shopDetailView();
    else if (s.screen === 'login' || s.wantedGateOpen) body = loginView();
    else if (hasQuery) body = searchView(s);
    else if (SIMPLE[s.screen]) body = simpleView(s.screen);
    else if (s.screen === 'home') body = homeView();
    else if (s.market === 'shops') body = shopsView(s);
    else if (s.market === 'wanted') body = wantedView(s);
    else if (s.market === 'jobs') body = jobsView(s);
    else if (s.market === 'travel') body = travelView();
    else body = listingsView(s);

    return (chrome ? browserBar() : '') + header(s)
      + '<div style="background: #F7F6F2; padding: 30px 44px 44px; min-height: 60vh;">'
      + '<div style="max-width: 1440px; margin: 0 auto;">' + body + '</div></div>';
  };
})(window);
