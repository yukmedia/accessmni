/* Emerald Marketplace — mobile: Home and Browse (Listings / Wanted / Jobs /
   Shops / Travel). Split from the rest of the mobile screens purely for file
   size; both halves attach to EMScreens. */

(function (global) {
  'use strict';

  var U = global.EMUI, D = global.EMData;
  var act = U.act, when = U.when, map = U.map, esc = U.esc, bg = U.bg;

  var S = global.EMScreens = global.EMScreens || {};

  /* ================================ HOME ================================ */

  // Small horizontal card used by "New today" and "Recently viewed".
  function homeCard(o) {
    return '<div ' + act('nav', o.screen || 'detail') + (o.item ? ' data-item="' + o.item + '"' : '')
      + ' style="width: 148px; flex-shrink: 0; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; overflow: hidden; cursor: pointer; position: relative;">'
      + when(o.isNew, '<div style="position: absolute; top: 7px; left: 7px; background: #0E3F80; color: #FFFFFF; font-size: 8.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px; z-index: 1;">NEW</div>')
      + '<div style="height: 100px; ' + bg(o.img, o.tint) + '"></div>'
      + '<div style="padding: 9px 10px 11px; display: flex; flex-direction: column; gap: 2px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">' + o.price + '</div>'
      + '<div style="font-size: 11.5px; color: #3A4553;">' + o.title + '</div>'
      + (o.trusted
        ? '<div style="display: flex; align-items: center; gap: 4px;">'
          + '<div style="font-size: 10px; color: #8B94A3;">' + o.meta + '</div>'
          + '<div style="font-size: 9px; background: #E4EDF9; color: #0E3F80; font-weight: 700; padding: 1px 5px; border-radius: 3px;">TRUSTED SELLER</div></div>'
        : '<div style="font-size: 10px; color: #8B94A3;">' + o.meta + '</div>')
      + '</div></div>';
  }

  function homeTile(o) {
    return '<div ' + act(o.action, o.arg) + ' style="display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;'
      + (o.soon ? ' position: relative;' : '') + '">'
      + '<div style="width: 52px; height: 52px; border-radius: 14px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 20px;">' + o.icon + '</div>'
      + when(o.soon, '<div style="position: absolute; top: -6px; right: -6px; background: #E09E3B; color: #FFFFFF; font-size: 7.5px; font-weight: 800; padding: 2px 5px; border-radius: 5px; letter-spacing: 0.02em;">SOON</div>')
      + '<div style="font-size: 10.5px; font-weight: 600; color: #3A4553; text-align: center;">' + o.label + '</div></div>';
  }

  S.home = function (s) {
    var I = D.IMG, T = D.TINT;
    return '<div style="display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative;">'
      + U.statusBar()

      // Search leads — no logo row, per the final design direction.
      + '<div style="background: #0E3F80; padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 14px;">'
      + '<div ' + act('nav', 'search') + ' style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 11px; padding: 12px 14px; cursor: pointer;">'
      + '<span style="color: #7C8697; font-size: 13px;">⌕</span>'
      + '<span style="color: #8B94A3; font-size: 13px; flex: 1;">Search the island</span>'
      + U.ICON.mic + '</div></div>'

      + '<div data-scroll-key="home" style="flex: 1; min-height: 0; overflow-y: auto; padding: 18px 20px 28px; display: flex; flex-direction: column; gap: 20px;">'

      + '<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">'
      + homeTile({ icon: '🏷️', label: 'Listings', action: 'market', arg: 'sellers' })
      + homeTile({ icon: '🙋', label: 'Wanted', action: 'market', arg: 'wanted' })
      + homeTile({ icon: '💼', label: 'Jobs', action: 'market', arg: 'jobs' })
      + homeTile({ icon: '🛒', label: 'Shops', action: 'market', arg: 'shops', soon: true })
      + homeTile({ icon: '✈️', label: 'Travel', action: 'market', arg: 'travel', soon: true })
      + '</div>'

      // Saved-search match: the hook that brings people back.
      + '<div ' + act('nav', 'browse') + ' style="display: flex; align-items: center; justify-content: space-between; background: #E4EDF9; border-radius: 10px; padding: 10px 12px; cursor: pointer;">'
      + '<div style="display: flex; align-items: center; gap: 8px;"><span style="font-size: 13px;">🔔</span>'
      + '<div style="font-size: 12.5px; color: #0E3F80; font-weight: 700;">2 new matches for &quot;Vehicles under EC$70k&quot;</div></div>'
      + '<div style="font-size: 13px; color: #0E3F80;">›</div></div>'

      + '<div ' + act('whatsapp') + ' style="position: relative; border-radius: 16px; overflow: hidden; cursor: pointer; height: 84px; ' + bg(I.bank, T.dark) + '">'
      + '<div style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(14,63,128,0.88) 0%, rgba(14,63,128,0.35) 65%, rgba(14,63,128,0) 100%); display: flex; flex-direction: column; justify-content: center; padding: 0 16px; gap: 3px;">'
      + '<div style="color: #FFFFFF; font-size: 14px; font-weight: 800;">Bank of Montserrat</div>'
      + '<div style="color: rgba(255,255,255,0.85); font-size: 11.5px;">Small business loans now open — apply today</div></div>'
      + '<div style="position: absolute; top: 7px; right: 9px; background: rgba(255,255,255,0.85); color: #3A4553; font-size: 8.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.03em;">SPONSORED</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 10px;">'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">New today</div>'
      + '<div ' + act('nav', 'browse') + ' style="font-size: 12px; font-weight: 700; color: #0E3F80; cursor: pointer;">See all</div></div>'
      + '<div style="display: flex; gap: 11px; overflow-x: auto; -webkit-overflow-scrolling: touch;">'
      + homeCard({ img: I.diningTable, tint: T.home, price: 'EC$450', title: 'Dining table, seats 6', meta: 'Brades · 2h', isNew: true, trusted: true })
      + homeCard({ img: I.mango, tint: T.produce, price: 'EC$25', title: 'Fresh mango crate', meta: 'Cudjoe Head · 18 views', isNew: true, item: 'mango' })
      + homeCard({ img: I.vehicle, tint: T.vehicle, price: 'EC$68,500', title: 'Land Cruiser, 2018', meta: 'Look Out · 41 views', isNew: true })
      + '</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 10px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Recently viewed</div>'
      + '<div style="display: flex; gap: 11px; overflow-x: auto; -webkit-overflow-scrolling: touch;">'
      + homeCard({ img: I.vehicle, tint: T.vehicle, price: 'EC$68,500', title: 'Land Cruiser, 2018', meta: 'Look Out · 41 views' })
      + homeCard({ img: I.bed, tint: T.bed, price: 'EC$3,800', title: 'King bed set', meta: 'Salem · 112 views' })
      + homeCard({ img: I.generator, tint: T.neutral, price: 'EC$28,000', title: 'Generator, 5kW', meta: 'Salem · 63 views' })
      + '</div></div>'

      + '<div ' + act('nav', 'sell') + ' style="background: #16233A; border-radius: 16px; padding: 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">'
      + '<div style="display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="color: #FFFFFF; font-size: 14.5px; font-weight: 700;">Got something to sell?</div>'
      + '<div style="color: rgba(230,238,249,0.72); font-size: 12px;">Takes under two minutes</div></div>'
      + '<div style="width: 38px; height: 38px; border-radius: 50%; background: #F0B454; color: #2A1D06; display: flex; align-items: center; justify-content: center;">' + U.ICON.plusSm + '</div></div>'

      + '</div></div>' + U.bottomNav(s);
  };

  /* =============================== BROWSE =============================== */

  function chipRow(items, activeKey, action, style) {
    return '<div style="display: flex; align-items: center; gap: 7px; overflow-x: auto; -webkit-overflow-scrolling: touch;">'
      + map(items, function (c) {
        return '<div ' + act(action, c.key) + ' style="' + style(c.key === activeKey) + '">' + c.label + '</div>';
      }) + '</div>';
  }

  function browseHeader(s) {
    var catKey = s.cat.length ? s.cat[0] : '';
    var tabs = [
      { key: 'sellers', label: 'Listings' },
      { key: 'wanted', label: 'Wanted' },
      { key: 'jobs', label: 'Jobs' },
      { key: 'shops', label: 'Shops', soon: true },
      { key: 'travel', label: 'Travel', soon: true }
    ];
    return U.statusBar()
      + '<div style="background: #0E3F80; padding: 18px 20px 16px; display: flex; flex-direction: column; gap: 12px;">'

      + '<div ' + act('nav', 'search') + ' style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 12px; padding: 12px 14px; cursor: pointer;">'
      + '<span style="color: #7C8697; font-size: 13px;">⌕</span>'
      + '<span style="color: #8B94A3; font-size: 13px; flex: 1;">Search the island</span>'
      + U.ICON.mic + '</div>'

      + '<div style="display: flex; gap: 18px;">'
      + map(tabs, function (t) {
        // An amber dot, not a "SOON" label — the calmer treatment settled on.
        return '<div ' + act('market', t.key) + ' style="' + U.segL(s.market === t.key) + (t.soon ? ' position: relative;' : '') + '">' + t.label
          + when(t.soon, '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#F0B454;margin-left:4px;vertical-align:middle;"></span>')
          + '</div>';
      }) + '</div>'

      + when(s.market === 'sellers',
          chipRow(D.CATS, catKey, 'cat', U.chipL)
          + when(catKey === 'vehicles',
              '<div style="display: flex; align-items: center; gap: 6px; overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top: -2px;">'
              + map(D.VEHICLE_SUBS, function (c) {
                return '<div ' + act('vehSub', c.key) + ' style="' + U.subChip(s.vehSub === c.key) + '">' + c.label + '</div>';
              }) + '</div>'))
      + when(s.market === 'shops', chipRow(D.SHOP_CATS, s.shopCat, 'shopCat', U.chipL))
      + when(s.market === 'jobs', chipRow(D.JOB_CATS, s.jobCat, 'jobCat', U.chipL))
      + when(s.market === 'wanted', chipRow(D.WANTED_CATS, s.wantedCat, 'wantedCat', U.chipL))
      + '</div>';
  }

  var SORT_LABELS = U.SORT_LABELS, WANTED_SORT_LABELS = U.WANTED_SORT_LABELS, JOB_SORT_LABELS = U.JOB_SORT_LABELS;

  function sortPill(label, action) {
    return '<div ' + act(action) + ' style="display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #0E3F80; cursor: pointer; background: #E4EDF9; padding: 5px 9px; border-radius: 7px;">' + label + ' ⌄</div>';
  }

  /* ---- Listings ---- */

  function listingCard(item, s) {
    var cardStyle = s.listView
      ? 'background:#FFFFFF;border:1px solid #E8E4D9;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:row'
      : 'background:#FFFFFF;border:1px solid #E8E4D9;border-radius:16px;overflow:hidden;cursor:pointer';
    var imgExtra = s.listView ? 'width:110px;height:110px;' : '';
    var flag = item.sponsored
      ? '<div style="position: absolute; top: 7px; left: 7px; background: rgba(28,42,34,0.75); color: #F0E2B0; font-size: 9px; font-weight: 800; letter-spacing: 0.04em; padding: 3px 7px; border-radius: 4px;">SPONSORED</div>'
      : item.tag
        ? '<div style="position: absolute; top: 7px; left: 7px; background: #5B6FBA; color: #FFFFFF; font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 4px;">' + item.tag + '</div>'
        : item.urgency
          ? '<div style="position: absolute; top: 7px; left: 7px; background: #A8483A; color: #FFFFFF; font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 4px;">' + item.urgency + '</div>'
          : '';
    return '<div ' + act('openListing', item.id) + ' style="' + cardStyle + '">'
      + '<div style="height: 96px; ' + bg(item.img, item.tint) + ' position: relative; flex-shrink: 0; ' + imgExtra + '">'
      + flag
      + '<div style="position: absolute; top: 7px; right: 7px; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #0E3F80;">♡</div></div>'
      + '<div style="padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 2px;">'
      + '<div style="display: flex; align-items: center; gap: 5px; font-size: 9px; font-weight: 800; letter-spacing: 0.06em; color: ' + item.catColor + ';">'
      + '<span style="width: 5px; height: 5px; border-radius: 50%; background: ' + item.catColor + ';"></span>' + item.catLabel + '</div>'
      + '<div style="font-size: 14.5px; font-weight: 800; letter-spacing: -0.02em; color: #16233A; line-height: 1.1;">' + item.price + '</div>'
      + '<div style="font-size: 12px; color: #3A4553; line-height: 1.2;">' + item.title + '</div>'
      + '<div style="font-size: 10.5px; color: #8B94A3; line-height: 1.15;">' + item.location + ' · ' + item.timeAgo + '</div>'
      + '<div style="font-size: 9.5px; color: #A8B3AB; line-height: 1.15;">' + item.views + ' views</div>'
      + when(item.badgeText, '<div style="margin-top: 3px; align-self: flex-start; background: ' + item.badgeBg + '; color: ' + item.badgeColor + '; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 5px;">' + item.badgeText + '</div>')
      + '</div></div>';
  }

  function listingsPanel(s) {
    var items = D.sortedListings(s.cat, s.sortBy);
    var title = !s.cat.length
      ? "What's new nearby"
      : (s.cat.length === 1 ? s.cat[0].charAt(0).toUpperCase() + s.cat[0].slice(1) : s.cat.length + ' categories selected');
    var gridStyle = s.listView ? 'display:flex;flex-direction:column;gap:10px' : 'display:grid;grid-template-columns:1fr 1fr;gap:12px';

    return '<div style="display: flex; flex-direction: column; flex: 1; min-height: 0;">'
      + '<div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; padding-bottom: 10px;">'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">' + title + '</div>'
      + '<div style="display: flex; align-items: center; gap: 6px;">'
      // Save-search sits with sort/view, applying to the filtered result set.
      + '<div ' + act('toggleSaveSearch') + ' title="' + (s.searchSaved ? 'Search saved' : 'Save this search') + '" style="width: 30px; height: 30px; border-radius: 8px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: ' + (s.searchSaved ? '#E09E3B' : '#6C7585') + ';">' + (s.searchSaved ? '★' : '☆') + '</div>'
      + '<div ' + act('toggleListView') + ' style="width: 30px; height: 30px; border-radius: 8px; background: ' + (s.listView ? '#16233A' : '#EFEBE1') + '; display: flex; align-items: center; justify-content: center; cursor: pointer;">'
      + '<svg width="14" height="14" viewBox="0 0 14 14" fill="' + (s.listView ? '#FBF8F1' : '#6C7585') + '"><rect x="0" y="0" width="14" height="3" rx="1.5"/><rect x="0" y="5.5" width="14" height="3" rx="1.5"/><rect x="0" y="11" width="14" height="3" rx="1.5"/></svg></div>'
      + sortPill(SORT_LABELS[s.sortBy], 'openSort')
      + '</div></div></div>'
      + '<div data-scroll-key="listings" style="overflow-y: auto; flex: 1; min-height: 0; padding-bottom: 16px;">'
      + '<div style="' + gridStyle + '">' + map(items, function (i) { return listingCard(i, s); }) + '</div>'
      + when(!items.length, '<div style="text-align: center; padding: 40px 16px; color: #8B94A3; font-size: 13px;">Nothing listed in this category yet.</div>')
      + '</div></div>';
  }

  /* ---- Shops ---- */

  function shopCard(shop) {
    var thumb = shop.pattern
      ? 'background: ' + shop.pattern + ';'
      : bg(shop.img, shop.tint);
    var statusPill = shop.statusStyle === 'closed'
      ? '<div style="background: #F2E7E4; color: #A8483A; font-size: 10px; font-weight: 800; padding: 4px 7px; border-radius: 5px;">' + shop.status + '</div>'
      : '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10px; font-weight: 800; padding: 4px 7px; border-radius: 5px;">' + shop.status + '</div>';
    var right = shop.delivers
      ? '<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">' + statusPill
        + '<div style="background: #FBF0DC; color: #8A5B0E; font-size: 9.5px; font-weight: 800; padding: 3px 7px; border-radius: 5px;">DELIVERY AVAIL.</div></div>'
      : statusPill;
    return '<div ' + (shop.screen ? act('nav', shop.screen) : act('noop'))
      + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; padding: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer;">'
      + '<div style="width: 54px; height: 54px; border-radius: 11px; ' + thumb + ' flex-shrink: 0;"></div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="font-size: 14px; font-weight: 700; color: #16233A;">' + shop.name + '</div>'
      + '<div style="font-size: 11.5px; color: #7C8697;">' + shop.meta + '</div></div>'
      + right + '</div>';
  }

  function shopsPanel(s) {
    var body = map(D.SHOP_SECTIONS, function (sec, idx) {
      var visible = sec.always ? sec.shops : sec.shops.filter(function (sh) { return D.shopVisible(s.shopCat, sh); });
      if (!visible.length) return '';
      return '<div style="padding: ' + (idx ? '10px' : '2px') + ' 2px 2px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; color: #8B94A3;">' + sec.heading + '</div>'
        + '<div style="display: flex; flex-direction: column; gap: 9px;">' + map(visible, shopCard) + '</div>';
    });
    return '<div style="display: flex; flex-direction: column; flex: 1; min-height: 0;">'
      + '<div data-scroll-key="shops" style="overflow-y: auto; flex: 1; min-height: 0; padding-bottom: 16px; display: flex; flex-direction: column; gap: 9px;">'
      + body + '<div style="height: 56px; flex-shrink: 0;"></div></div></div>';
  }

  /* ---- Wanted ---- */

  function wantedRow(item) {
    return '<div ' + (item.screen ? act('nav', item.screen) : act('wantedGate'))
      + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 12px 13px; display: flex; align-items: center; gap: 11px; cursor: pointer;">'
      + '<div style="width: 40px; height: 40px; border-radius: 11px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">' + item.icon + '</div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="display: flex; align-items: center; gap: 7px;">'
      + '<div style="font-size: 14px; font-weight: 700; color: #16233A;">' + item.title + '</div>'
      + '<div style="background: #F4F2EC; color: #3A4553; font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 5px; white-space: nowrap;">' + item.catLabel + '</div></div>'
      + '<div style="display: flex; align-items: center; gap: 6px;">'
      + when(item.budgetLabel, '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 5px;">' + item.budgetLabel + '</div>')
      + '<div style="font-size: 11px; color: #8B94A3;">' + item.location + ' · ' + item.timeAgo + ' · ' + item.offers + ' offers</div></div></div>'
      + '<div ' + act('stop') + ' style="font-size: 15px; color: #0E3F80; cursor: pointer;">♡</div>'
      + '<div style="font-size: 15px; color: #C6CDD9;">›</div></div>';
  }

  function wantedPanel(s) {
    var items = D.wantedItems(s.wantedCat, s.wantedSortBy);
    return '<div style="display: flex; flex-direction: column; flex: 1; min-height: 0;">'
      + '<div style="flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">What the island is asking for</div>'
      + sortPill(WANTED_SORT_LABELS[s.wantedSortBy], 'openWantedSort') + '</div>'
      + '<div data-scroll-key="wanted" style="overflow-y: auto; flex: 1; min-height: 0; padding-bottom: 16px; display: flex; flex-direction: column; gap: 9px;">'
      + '<div style="background: #E4EDF9; border-radius: 16px; padding: 13px 14px; display: flex; align-items: center; gap: 12px;">'
      + '<div style="width: 34px; height: 34px; border-radius: 10px; background: #0E3F80; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 16px; font-weight: 700;">?</div>'
      + '<div style="flex: 1; font-size: 12.5px; line-height: 1.4; color: #16233A;">14 neighbours are looking for things. Have it in the shed? Say so.</div></div>'
      + '<div ' + act('nav', 'postWanted') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 12px; padding: 12px 0; text-align: center; font-size: 14px; font-weight: 700; cursor: pointer;">+ Post a Wanted ad <span style="opacity: 0.7; font-weight: 600;">· Free</span></div>'
      + map(items, wantedRow)
      + when(!items.length, '<div style="text-align: center; padding: 30px 16px; color: #8B94A3; font-size: 13px;">No open asks in this category.</div>')
      + '<div style="text-align: center; font-size: 13px; font-weight: 700; color: #0E3F80; cursor: pointer;">See all 14 asks</div>'
      + '<div style="height: 56px; flex-shrink: 0;"></div></div></div>';
  }

  /* ---- Jobs ---- */

  function jobRow(item) {
    return '<div ' + act('nav', 'jobDetail') + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 12px 13px; display: flex; align-items: center; gap: 11px; cursor: pointer;">'
      + '<div style="width: 40px; height: 40px; border-radius: 11px; background: #F4F2EC; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">' + item.icon + '</div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="display: flex; align-items: center; gap: 7px;">'
      + '<div style="font-size: 14px; font-weight: 700; color: #16233A;">' + item.title + '</div>'
      + '<div style="background: #F4F2EC; color: #3A4553; font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 5px; white-space: nowrap;">' + item.typeLabel + '</div></div>'
      + '<div style="display: flex; align-items: center; gap: 6px;">'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 5px;">' + item.payLabel + '</div>'
      + '<div style="font-size: 11px; color: #8B94A3;">' + item.employer + ' · ' + item.location + ' · ' + item.applied + ' applied</div></div></div>'
      + '<div ' + act('stop') + ' style="font-size: 15px; color: #0E3F80; cursor: pointer;">♡</div>'
      + '<div style="font-size: 15px; color: #C6CDD9;">›</div></div>';
  }

  function jobsPanel(s) {
    var items = D.jobItems(s.jobCat, s.jobSortBy);
    return '<div style="display: flex; flex-direction: column; flex: 1; min-height: 0;">'
      + '<div style="flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Job openings</div>'
      + sortPill(JOB_SORT_LABELS[s.jobSortBy], 'openJobSort') + '</div>'
      + '<div data-scroll-key="jobs" style="overflow-y: auto; flex: 1; min-height: 0; padding-bottom: 16px; display: flex; flex-direction: column; gap: 10px;">'
      + '<div ' + act('wantedGate') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 12px; padding: 12px 0; text-align: center; font-size: 14px; font-weight: 700; cursor: pointer;">+ Post a job <span style="opacity: 0.7; font-weight: 600;">· Free</span></div>'
      + map(items, jobRow)
      + when(!items.length, '<div style="text-align: center; padding: 30px 16px; color: #8B94A3; font-size: 13px;">No openings in this category right now.</div>')
      + '<div style="height: 56px; flex-shrink: 0;"></div></div></div>';
  }

  /* ---- Travel ---- */

  function stayCard(o, priceKey) {
    return '<div ' + act('noop') + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; overflow: hidden; cursor: pointer; display: flex;">'
      + '<div style="width: 110px; height: 110px; ' + bg(o.img, o.tint) + ' flex-shrink: 0;"></div>'
      + '<div style="padding: 11px 12px; display: flex; flex-direction: column; gap: 3px; flex: 1;">'
      + '<div style="font-size: 14px; font-weight: 700; color: #16233A;">' + o.name + '</div>'
      + '<div style="font-size: 11.5px; color: #7C8697;">' + o.meta + '</div>'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A; margin-top: 3px;">' + o[priceKey || 'price']
      + '<span style="font-size: 11px; font-weight: 500; color: #7C8697;">' + o.unit + '</span></div></div></div>';
  }

  function travelPanel() {
    return '<div style="display: flex; flex-direction: column; flex: 1; min-height: 0;">'
      + '<div data-scroll-key="travel" style="overflow-y: auto; flex: 1; min-height: 0; padding-bottom: 16px; display: flex; flex-direction: column; gap: 16px;">'

      + '<div style="display: flex; flex-direction: column; gap: 9px;">'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Fly to Montserrat</div>'
      + '<div style="font-size: 9px; font-weight: 800; letter-spacing: 0.04em; color: #A8B3AB;">SPONSORED</div></div>'
      + '<div style="display: flex; gap: 8px;">'
      + map(D.AIRLINES, function (a) {
        return '<div ' + act('flymni') + ' style="flex: 1; position: relative; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 8px 6px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer;">'
          + '<div style="position: absolute; top: 4px; right: 5px; font-size: 6.5px; font-weight: 800; letter-spacing: 0.03em; color: #C6CDD9;">AD</div>'
          + '<div style="width: 30px; height: 30px; border-radius: 7px; background: ' + a.bg + '; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; color: ' + a.color + '; letter-spacing: -0.02em; text-align: center; line-height: 1.1;">' + a.short + '</div>'
          + '<div style="font-size: 9.5px; font-weight: 700; color: #16233A; text-align: center;">' + a.name + '</div></div>';
      }) + '</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 9px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Hotels on the island</div>'
      + map(D.HOTELS, function (h) { return stayCard(h); }) + '</div>'

      + '<div style="display: flex; flex-direction: column; gap: 9px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Tours &amp; experiences</div>'
      + map(D.TOURS.filter(function (t) { return !t.deskOnly; }), function (t) { return stayCard(t); }) + '</div>'

      + '<div style="height: 56px; flex-shrink: 0;"></div></div></div>';
  }

  /* ---- Browse shell ---- */

  S.browse = function (s) {
    var panel = s.market === 'sellers' ? listingsPanel(s)
      : s.market === 'shops' ? shopsPanel(s)
      : s.market === 'wanted' ? wantedPanel(s)
      : s.market === 'jobs' ? jobsPanel(s)
      : travelPanel(s);

    var showCartBar = s.market === 'shops' && !s.hasActiveOrder;
    var waBottom = (s.hasActiveOrder || showCartBar) ? '138px' : '96px';

    return '<div style="display: flex; flex-direction: column; flex: 1; min-height: 0; position: relative;">'
      + browseHeader(s)
      + '<div style="padding: 14px 20px 0; display: flex; flex-direction: column; gap: 13px; flex: 1; min-height: 0;">' + panel + '</div>'

      // Persistent help channel — WhatsApp is how the island actually talks.
      + '<div ' + act('whatsapp') + ' style="position: absolute; right: 14px; bottom: ' + waBottom + '; width: 44px; height: 44px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -4px rgba(23,35,29,0.4); cursor: pointer; z-index: 15; transition: bottom 0.15s;">'
      + U.ICON.whatsapp + '</div>'

      + when(s.hasActiveOrder,
          '<div ' + act('nav', 'collect') + ' style="background: #F0B454; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">'
          + '<div style="display: flex; align-items: center; gap: 9px;">'
          + '<div style="width: 24px; height: 24px; border-radius: 50%; background: #2A1D06; color: #F0E2B0; font-size: 13px; display: flex; align-items: center; justify-content: center;">✓</div>'
          + '<div style="color: #2A1D06; font-size: 13px; font-weight: 700;">Order ready at Ram\'s, Salem</div></div>'
          + '<div style="color: #2A1D06; font-size: 13px; font-weight: 700;">Collect ›</div></div>')

      + when(showCartBar,
          '<div ' + act('nav', 'cart') + ' style="background: #16233A; padding: 11px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">'
          + '<div style="display: flex; align-items: center; gap: 9px;">'
          + '<div style="width: 26px; height: 26px; border-radius: 50%; background: #F0B454; color: #2A1D06; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center;">' + s.cartCount + '</div>'
          + '<div style="color: #FBF8F1; font-size: 13px; font-weight: 600;">Cart · EC$64</div></div>'
          + '<div style="color: #F0B454; font-size: 13px; font-weight: 700;">Checkout ›</div></div>')

      + '</div>' + U.bottomNav(s);
  };

})(window);
