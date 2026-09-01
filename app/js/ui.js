/* Emerald Marketplace — shared style helpers, icons and repeated fragments.
   Styles are written inline, matching the design file 1:1, so each screen reads
   the way it was drawn. Anything reused more than twice lives here. */

(function (global) {
  'use strict';

  /* ---------- primitives ---------- */

  // Escape text destined for markup. Demo copy is authored here, but any value
  // that could come from a form (the search box) goes through this.
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Photo background with a colour underneath: if the remote image fails to
  // load, the tint shows through instead of an empty white box.
  function bg(url, tint) {
    return 'background: ' + (tint || '#E0DAC9') + " url('" + url + "') center/cover no-repeat;";
  }

  // `data-act` drives the single delegated click listener in app.js.
  function act(name, arg) {
    return 'data-act="' + name + '"' + (arg != null ? ' data-arg="' + esc(arg) + '"' : '');
  }

  function when(cond, html) { return cond ? html : ''; }

  function map(list, fn) { return list.map(fn).join(''); }

  /* ---------- chip / tab style variants ---------- */

  // Chips on a white surface.
  function chip(on) {
    return on
      ? 'background:#16233A;color:#FBF8F1;font-size:12px;font-weight:700;padding:6px 13px;border-radius:999px;white-space:nowrap;cursor:pointer;flex-shrink:0'
      : 'background:#FFFFFF;border:1px solid #E8E4D9;color:#3A4553;font-size:12px;font-weight:600;padding:6px 13px;border-radius:999px;white-space:nowrap;cursor:pointer;flex-shrink:0';
  }

  // Chips on the blue header ("L" = light-on-blue in the original).
  function chipL(on) {
    return on
      ? 'background:#F0B454;color:#2A1D06;font-size:12px;font-weight:600;padding:6px 13px;border-radius:999px;white-space:nowrap;cursor:pointer;flex-shrink:0'
      : 'background:rgba(255,255,255,0.12);color:#E6EEF9;font-size:12px;font-weight:400;padding:6px 13px;border-radius:999px;white-space:nowrap;cursor:pointer;flex-shrink:0';
  }

  // Second-level (vehicle sub-category) chips on the blue header.
  function subChip(on) {
    return on
      ? 'background:rgba(255,255,255,0.95);color:#0E3F80;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;white-space:nowrap;cursor:pointer;flex-shrink:0'
      : 'background:transparent;border:1px solid rgba(255,255,255,0.35);color:rgba(255,255,255,0.85);font-size:11px;font-weight:500;padding:5px 11px;border-radius:999px;white-space:nowrap;cursor:pointer;flex-shrink:0';
  }

  // Market tabs (Listings / Wanted / Jobs / Shops / Travel) on the blue header.
  function segL(on) {
    return on
      ? 'padding:2px 0 6px;text-align:center;font-size:14px;font-weight:700;color:#FFFFFF;border-bottom:2px solid #F0B454;cursor:pointer'
      : 'padding:2px 0 6px;text-align:center;font-size:14px;font-weight:600;color:rgba(255,255,255,0.78);border-bottom:2px solid transparent;cursor:pointer';
  }

  // Inbox sub-tabs (Messages / Notifications) on white.
  function msgTab(on) {
    return on
      ? 'padding:6px 0 8px;font-size:13.5px;font-weight:700;color:#16233A;border-bottom:2px solid #0E3F80;cursor:pointer'
      : 'padding:6px 0 8px;font-size:13.5px;font-weight:600;color:#8B94A3;border-bottom:2px solid transparent;cursor:pointer';
  }

  // Rows inside a sort bottom-sheet.
  function sortOpt(on) {
    return on
      ? 'padding:14px 20px;font-size:15px;font-weight:700;color:#0E3F80;border-bottom:1px solid #F0EDE4;background:#F7FCF9;cursor:pointer;display:flex;justify-content:space-between;align-items:center'
      : 'padding:14px 20px;font-size:15px;font-weight:600;color:#16233A;border-bottom:1px solid #F0EDE4;cursor:pointer';
  }

  // Desktop top-nav tabs.
  function deskTab(on) {
    return on
      ? 'color:#FFFFFF;font-size:13.5px;font-weight:700;border-bottom:2px solid #F0B454;padding-bottom:6px;cursor:pointer'
      : 'color:rgba(230,238,249,0.78);font-size:13.5px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;';
  }

  // Desktop sidebar filter rows.
  function deskSide(on) {
    return on ? 'font-weight:700;color:#0E3F80' : 'font-weight:600;color:#3A4553';
  }

  function tabCol(on) { return on ? '#0E3F80' : '#9AA49C'; }


  /* ---------- sort labels (shared by both frames) ---------- */

  var SORT_LABELS = { newest: 'Newest', price: 'Price ↑', priceDesc: 'Price ↓', near: 'Nearest', delivery: 'Delivery', viewed: 'Most viewed' };
  var WANTED_SORT_LABELS = { newest: 'Newest', budget: 'Budget ↑', budgetDesc: 'Budget ↓', offers: 'Most offers', fewOffers: 'Fewest offers' };
  var JOB_SORT_LABELS = { newest: 'Newest', pay: 'Pay ↑', payDesc: 'Pay ↓', viewed: 'Most viewed' };

  /* ---------- icons ---------- */

  var ICON = {
    mic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E3F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
    micLg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E3F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
    home: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>',
    cart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    cartLg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8B94A3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    plus: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    plusSm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    bell: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    person: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/></svg>',
    heart: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    heartSm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    share: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>',
    trash: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    pencil: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    bagSm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v1H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M8 10h8"/></svg>',
    card: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    gear: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    chatBubble: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    whatsapp: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.87-1.24-4.74-4.14-4.89-4.33-.14-.19-1.17-1.56-1.17-2.98s.74-2.12 1-2.41c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.13.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.65.78 1.94.92.29.15.48.22.55.34.07.13.07.72-.17 1.4z"/></svg>',
    google: '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.6l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5c-7.5 0-14 4.2-17.3 10.4z"/><path fill="#4CAF50" d="M24 43.5c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5c-2 1.4-4.6 2.2-7.6 2.2-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.9 39.2 16.4 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.5 5.5C41.5 36 43.5 30.6 43.5 24c0-1.2-.1-2.4-.3-3.5z"/></svg>',
    facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.93-1.95 1.89v2.28h3.32l-.53 3.49h-2.79v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>'
  };

  /* ---------- repeated fragments ---------- */

  function statusBar() {
    return '<div style="background: #0E3F80; padding: 12px 22px 0; display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #E6EEF9;">'
      + '<span>9:41</span><span style="letter-spacing: 0.08em;">▮▮▮ ᯤ 􀛨</span></div>';
  }

  // Circular back / close button used at the top of most sub-screens.
  function roundBtn(glyph, action, arg) {
    return '<div ' + act(action, arg) + ' style="width: 32px; height: 32px; border-radius: 50%; background: #FFFFFF; border: 1px solid #E8E4D9; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #16233A; cursor: pointer; flex-shrink: 0;">' + glyph + '</div>';
  }

  // Photo hero with floating back / save / share controls (listing detail pages).
  function heroHeader(height, imgCss, extra) {
    return '<div style="height: ' + height + 'px; ' + imgCss + ' position: relative; flex-shrink: 0;">'
      + '<div style="position: absolute; top: 46px; left: 16px; right: 16px; display: flex; justify-content: space-between;">'
      + '<div ' + act('nav', 'browse') + ' style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #16233A; cursor: pointer;">‹</div>'
      + '<div style="display: flex; gap: 8px;">'
      + '<div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: center; font-size: 15px; color: #A8483A;">♥</div>'
      + '<div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: center; font-size: 15px; color: #16233A;">⤴</div>'
      + '</div></div>' + (extra || '') + '</div>';
  }

  // The five-slot bottom nav, shared by Home, Browse, Inbox, Saved and Profile.
  function bottomNav(s) {
    function badge(count, right, top) {
      return '<div style="position: absolute; top: ' + top + '; right: ' + right + '; min-width: 18px; height: 18px; border-radius: 9px; background: #F0B454; color: #2A1D06; font-size: 10px; font-weight: 800; border: 1.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; padding: 0 3px;">' + count + '</div>';
    }
    var homeOn = ['home', 'browse', 'detail', 'collect'].indexOf(s.screen) !== -1;
    return '<div style="background: #FFFFFF; border-top: 1px solid #E8E4D9; padding: 12px 14px 22px; display: grid; grid-template-columns: repeat(5, 1fr); align-items: end; gap: 4px; position: relative; z-index: 5;">'
      + '<div ' + act('nav', 'home') + ' style="display: flex; justify-content: center; cursor: pointer; color: ' + tabCol(homeOn) + ';">' + ICON.home + '</div>'
      + '<div ' + act('nav', 'cart') + ' style="position: relative; display: flex; justify-content: center; cursor: pointer; color: ' + tabCol(s.screen === 'cart') + ';">' + ICON.cart + badge(s.cartCount, '-4px', '-7px') + '</div>'
      + '<div ' + act('nav', 'sell') + ' style="display: flex; justify-content: center; cursor: pointer;">'
      + '<div style="width: 52px; height: 52px; margin-top: -22px; border-radius: 50%; background: #16233A; color: #FBF8F1; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 18px -8px rgba(28,42,34,0.6);">' + ICON.plus + '</div></div>'
      + '<div ' + act('nav', 'messages') + ' style="position: relative; display: flex; justify-content: center; cursor: pointer; color: ' + tabCol(s.screen === 'messages' || s.screen === 'thread') + ';">' + ICON.bell + badge(3, '0px', '-6px') + '</div>'
      + '<div ' + act('nav', 'profile') + ' style="display: flex; justify-content: center; cursor: pointer; color: ' + tabCol(s.screen === 'profile') + ';">' + ICON.person + '</div>'
      + '</div>';
  }

  // Sticky footer holding the primary action(s) on a detail / form screen.
  function actionBar(inner, extraStyle) {
    return '<div style="background: #FFFFFF; border-top: 1px solid #E8E4D9; padding: 12px 18px 26px;' + (extraStyle || '') + '">' + inner + '</div>';
  }

  function primaryBtn(label, action, arg, flex) {
    return '<div ' + act(action, arg) + ' style="' + (flex ? 'flex: ' + flex + '; ' : '') + 'background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 15px 0; text-align: center; font-size: 15px; font-weight: 700; cursor: pointer;">' + label + '</div>';
  }

  // Bottom-sheet scaffold used by all three sort menus.
  function sheet(closeAction, rows) {
    return '<div ' + act(closeAction) + ' style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(23,35,29,0.42); display: flex; align-items: flex-end; z-index: 20; cursor: pointer;">'
      + '<div ' + act('stop') + ' style="width: 100%; background: #FFFFFF; border-radius: 22px 22px 0 0; padding: 0 0 26px; box-shadow: 0 -10px 40px rgba(23,35,29,0.18);">'
      + '<div style="width: 36px; height: 4px; border-radius: 2px; background: #C6CDD9; margin: 10px auto 14px;"></div>'
      + '<div style="padding: 0 20px 8px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; color: #9AA49C;">SORT BY</div>'
      + rows + '</div></div>';
  }

  function sortRows(options, current, action) {
    return map(options, function (o) {
      return '<div ' + act(action, o.key) + ' style="' + sortOpt(current === o.key) + '">' + o.label + '</div>';
    });
  }

  // Amber "pay in app" warning, repeated on detail pages, checkout and threads.
  function payWarning(text) {
    return '<div style="display: flex; align-items: flex-start; gap: 8px;">'
      + '<div style="width: 18px; height: 18px; border-radius: 5px; background: #0E3F80; color: #FFFFFF; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;">✓</div>'
      + '<div style="font-size: 12px; color: #3A4553; line-height: 1.4;">' + text + '</div></div>';
  }

  // Two-column key/value spec grid inside a DETAILS card.
  function detailsCard(pairs, cols) {
    return '<div style="display: flex; flex-direction: column; gap: 8px; background: #F7F6F0; border-radius: 12px; padding: 12px 13px;">'
      + '<div style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; color: #6C7585;">DETAILS</div>'
      + '<div style="display: grid; grid-template-columns: repeat(' + (cols || 2) + ', 1fr); gap: 8px; font-size: 12.5px;">'
      + map(pairs, function (p) {
        return '<div><span style="color: #8B94A3;">' + p[0] + '</span><br/><span style="color: #16233A; font-weight: 600;">' + p[1] + '</span></div>';
      })
      + '</div></div>';
  }

  // Neutral pill used for condition / category / meta tags.
  function tagPill(label) {
    return '<div style="background: #F4F2EC; color: #3A4553; font-size: 11.5px; font-weight: 600; padding: 5px 10px; border-radius: 7px;">' + label + '</div>';
  }

  function bluePill(label) {
    return '<div style="background: #E4EDF9; color: #0E3F80; font-size: 11.5px; font-weight: 700; padding: 5px 10px; border-radius: 7px;">' + label + '</div>';
  }

  // Stylised static map with a pin — a Google Maps embed would go here for real.
  function mapCard(height, label, viewBox, paths) {
    return '<div style="height: ' + height + 'px; border-radius: 12px; overflow: hidden; position: relative; background: #DDE6DE;">'
      + '<svg width="100%" height="100%" viewBox="' + viewBox + '" preserveAspectRatio="xMidYMid slice">' + paths + '</svg>'
      + '<div style="position: absolute; top: ' + (height / 2 - 18) + 'px; left: 165px; width: 24px; height: 24px; border-radius: 50%; background: #0E3F80; border: 3px solid #FFFFFF; box-shadow: 0 2px 6px rgba(23,35,29,0.35); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 11px;">📍</div>'
      + '<div style="position: absolute; bottom: 7px; left: 9px; background: rgba(255,255,255,0.9); font-size: 10px; font-weight: 700; color: #16233A; padding: 3px 7px; border-radius: 6px;">' + label + '</div></div>';
  }

  // Contact block with a WhatsApp button (job, shop and realty detail pages).
  function contactCard(name, line, label) {
    return '<div style="display: flex; flex-direction: column; gap: 8px; background: #F7F6F0; border-radius: 12px; padding: 12px 13px;">'
      + '<div style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; color: #6C7585;">' + (label || 'CONTACT') + '</div>'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="font-size: 13px; color: #16233A; font-weight: 600;">' + name + '</div>'
      + '<div ' + act('whatsapp') + ' style="display: flex; align-items: center; gap: 6px; background: #25D366; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 7px 12px; border-radius: 8px; cursor: pointer;">WhatsApp</div>'
      + '</div><div style="font-size: 12.5px; color: #7C8697;">' + line + '</div></div>';
  }

  function avatar(size, colours, extra) {
    var c = colours.split(',');
    return '<div style="width: ' + size + 'px; height: ' + size + 'px; border-radius: 50%; background: repeating-linear-gradient(135deg, ' + c[0] + ' 0 6px, ' + c[1] + ' 6px 12px);' + (extra || '') + '"></div>';
  }

  global.EMUI = {
    esc: esc, bg: bg, act: act, when: when, map: map,
    chip: chip, chipL: chipL, subChip: subChip, segL: segL, msgTab: msgTab,
    sortOpt: sortOpt, deskTab: deskTab, deskSide: deskSide, tabCol: tabCol,
    ICON: ICON,
    SORT_LABELS: SORT_LABELS, WANTED_SORT_LABELS: WANTED_SORT_LABELS, JOB_SORT_LABELS: JOB_SORT_LABELS,
    statusBar: statusBar, roundBtn: roundBtn, heroHeader: heroHeader,
    bottomNav: bottomNav, actionBar: actionBar, primaryBtn: primaryBtn,
    sheet: sheet, sortRows: sortRows, payWarning: payWarning, detailsCard: detailsCard,
    tagPill: tagPill, bluePill: bluePill, mapCard: mapCard, contactCard: contactCard,
    avatar: avatar
  };
})(window);
