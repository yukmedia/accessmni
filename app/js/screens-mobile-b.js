/* Emerald Marketplace — mobile: detail pages, checkout, inbox, sell flow,
   account screens and the modal overlays. */

(function (global) {
  'use strict';

  var U = global.EMUI, D = global.EMData;
  var act = U.act, when = U.when, map = U.map, esc = U.esc, bg = U.bg;
  var S = global.EMScreens;

  /* ============================ LISTING DETAIL =========================== */

  // Seller trust card + the Emerald Pay note, shared by both detail variants.
  function sellerCard(name, stats) {
    return '<div ' + act('nav', 'thread') + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; padding: 13px; display: flex; flex-direction: column; gap: 11px; cursor: pointer;">'
      + '<div style="display: flex; align-items: center; gap: 11px;">'
      + U.avatar(40, '#E6E1D4,#DED8C9', 'flex-shrink: 0;')
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="display: flex; align-items: center; gap: 6px;">'
      + '<div style="font-size: 14px; font-weight: 700; color: #16233A;">' + name + '</div>'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">VERIFIED</div></div>'
      + '<div style="font-size: 11.5px; color: #7C8697;">' + stats + '</div></div>'
      + '<div style="font-size: 15px; color: #0E3F80;">›</div></div>'
      + '<div style="height: 1px; background: #EDE9DD;"></div>'
      + U.payWarning('<strong style="color: #16233A;">Emerald Pay</strong> holds payment until you confirm the item. Off-app cash deals get no refund, no dispute support.')
      + '</div>';
  }

  function qaSection(s, count, rows) {
    return '<div ' + act('toggleQA') + ' style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding-bottom: 4px;">'
      + '<div style="font-size: 13.5px; font-weight: 800; color: #16233A;">Questions &amp; Answers <span style="color: #8B94A3; font-weight: 600;">(' + count + ')</span></div>'
      + '<div style="font-size: 13px; color: #8B94A3;">' + (s.qaOpen ? '▲' : '▼') + '</div></div>'
      + when(s.qaOpen,
          '<div style="display: flex; flex-direction: column; gap: 10px; padding-bottom: 6px;">'
          + '<div ' + act('wantedGate') + ' style="font-size: 12px; font-weight: 700; color: #0E3F80; cursor: pointer; align-self: flex-end;">Ask a question</div>'
          + rows + '</div>');
  }

  function qaItem(q, a, when_) {
    return '<div style="display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="font-size: 12.5px; font-weight: 700; color: #16233A;">Q: ' + q + '</div>'
      + '<div style="font-size: 12.5px; color: #4A5A52; padding-left: 12px;">A: ' + a + '</div>'
      + '<div style="font-size: 10.5px; color: #B0B8AE; padding-left: 12px;">' + when_ + '</div></div>';
  }

  function mangoDetail(s) {
    var I = D.IMG, T = D.TINT;
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + U.heroHeader(220, bg(I.mango, T.produce))
      + '<div data-scroll-key="detail" style="flex: 1; overflow-y: auto; padding: 16px 20px 0; display: flex; flex-direction: column; gap: 13px;">'

      + '<div style="display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">'
      + '<div style="font-size: 33px; font-weight: 800; letter-spacing: -0.03em; color: #16233A; line-height: 1;">EC$25</div>'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 11px; font-weight: 700; padding: 5px 9px; border-radius: 6px; white-space: nowrap; margin-top: 5px;">Fixed price</div></div>'
      + '<div style="font-size: 17px; font-weight: 600; color: #16233A; line-height: 1.3;">Fresh mango crate — Julie variety</div>'
      + '<div style="font-size: 11.5px; color: #8B94A3;">Cudjoe Head · 5h ago · 18 views · 3 saves</div></div>'

      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">' + U.tagPill('Farm &amp; Produce') + U.tagPill('Picked fresh') + '</div>'

      // Fulfillment reads as its own colour-coded row, distinct from the tags.
      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">'
      + '<div style="display: flex; align-items: center; gap: 5px; background: #FFFFFF; border: 1px solid #D8E4DB; color: #0E3F80; font-size: 11.5px; font-weight: 700; padding: 5px 10px; border-radius: 7px;"><span>📍</span>Pickup · Cudjoe Head</div>'
      + '<div style="display: flex; align-items: center; gap: 5px; background: #FBF0DC; border: 1px solid #F0D9A8; color: #8A5B0E; font-size: 11.5px; font-weight: 700; padding: 5px 10px; border-radius: 7px;"><span>🚚</span>Delivery avail. · EC$10</div></div>'

      + '<div style="font-size: 13.5px; line-height: 1.55; color: #3A4553;">Whole crate, about 40-45 mangoes, picked this morning off the tree. Sweet Julie variety, ready to eat in a day or two.</div>'

      + U.detailsCard([['Variety', 'Julie mango'], ['Quantity', '~40-45 fruit'], ['Harvested', 'This morning'], ['Ready to eat', '1-2 days']])
      + sellerCard('Kenrick B.', '★ 4.8 (14) · 9 sales · member since 2022')

      + '<div style="border-top: 1px solid #EDE9DD; padding-top: 12px;">'
      + qaSection(s, 1, qaItem('Are these tree-ripened or picked green?', 'Tree-ripened, picked same day. — Kenrick B.', '1 day ago'))
      + '</div><div style="height: 20px;"></div></div>'

      + U.actionBar('<div ' + act('nav', 'collect') + ' style="flex: 1; background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 14px 0; text-align: center; font-size: 15px; font-weight: 700; cursor: pointer;">Buy · EC$25</div>', ' display: flex; gap: 9px;')
      + '</div>';
  }

  function carDetail(s) {
    var I = D.IMG, T = D.TINT;
    var heroes = [I.vehicleBig, I.car1, I.car2, I.car3];
    var thumbs = [I.vehicleThumb, I.car1Thumb, I.car2Thumb, I.car3Thumb];
    var idx = s.carPhotoIdx || 0;

    var dots = map([0, 1, 2, 3], function (i) {
      return '<div ' + act('carPhoto', i) + ' style="cursor: pointer; width: ' + (idx === i ? '18px' : '5px') + '; height: 5px; border-radius: 3px; background: ' + (idx === i ? '#0E3F80' : 'rgba(23,35,29,0.22)') + ';"></div>';
    });

    var heroExtra = '<div style="position: absolute; bottom: 14px; right: 14px; background: rgba(28,42,34,0.72); color: #FBF8F1; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;">' + (idx + 1) + ' / 4</div>'
      + '<div style="position: absolute; bottom: 16px; left: 0; right: 0; display: flex; justify-content: center; gap: 5px;">' + dots + '</div>';

    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + U.heroHeader(252, bg(heroes[idx], T.vehicle), heroExtra)

      + '<div style="display: flex; gap: 6px; padding: 8px 20px; flex-shrink: 0;">'
      + map(thumbs, function (t, i) {
        return '<div ' + act('carPhoto', i) + ' style="width: 44px; height: 44px; border-radius: 8px; cursor: pointer; border: 2px solid ' + (idx === i ? '#0E3F80' : 'transparent') + '; ' + bg(t, T.vehicle) + '"></div>';
      }) + '</div>'

      + '<div data-scroll-key="detail" style="flex: 1; overflow-y: auto; padding: 4px 20px 0; display: flex; flex-direction: column; gap: 13px;">'

      + '<div style="display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">'
      + '<div style="font-size: 33px; font-weight: 800; letter-spacing: -0.03em; color: #16233A; line-height: 1;">EC$68,500</div>'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 11px; font-weight: 700; padding: 5px 9px; border-radius: 6px; white-space: nowrap; margin-top: 5px;">Offers welcome</div></div>'
      + '<div style="font-size: 17px; font-weight: 600; color: #16233A; line-height: 1.3;">2018 Toyota Land Cruiser</div>'
      + '<div style="font-size: 11.5px; color: #8B94A3;">Look Out · 1h ago · 41 views · 12 saves</div></div>'

      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">' + U.tagPill('Well maintained') + U.tagPill('Vehicles') + '</div>'
      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">'
      + '<div style="display: flex; align-items: center; gap: 5px; background: #FFFFFF; border: 1px solid #D8E4DB; color: #0E3F80; font-size: 11.5px; font-weight: 700; padding: 5px 10px; border-radius: 7px;"><span>📍</span>View by appointment · Look Out</div></div>'

      + '<div style="font-size: 13.5px; line-height: 1.55; color: #3A4553;">Well maintained, single owner, serviced regularly with new tires. Ready for island roads. <span style="color: #0E3F80; font-weight: 700;">More</span></div>'

      + U.detailsCard([['Make', 'Toyota'], ['Model', 'Land Cruiser'], ['Year', '2018'], ['Mileage', '~62,000 km']])

      + U.mapCard(100, 'General area · Look Out', '0 0 350 100',
          '<rect width="350" height="100" fill="#DCE6DD"/><path d="M0 60 Q80 35 160 55 T350 45" stroke="#C3D3C6" stroke-width="12" fill="none"/>')

      + sellerCard('Denroy A.', '★ 4.9 (31) · 23 sales · replies in ~1 hr')

      + '<div style="border-top: 1px solid #EDE9DD; padding-top: 12px; display: flex; flex-direction: column; gap: 4px;">'
      + qaSection(s, 2,
          qaItem('Any accident history?', 'None, single owner since new. — Denroy A.', '2 days ago')
          + '<div style="height: 1px; background: #EDE9DD;"></div>'
          + qaItem('Can I get it inspected before I buy?', 'Yes, happy to arrange a viewing. — Denroy A.', '5 days ago'))
      + '</div>'

      + '<div style="display: flex; flex-direction: column; gap: 9px; padding-bottom: 16px;">'
      + '<div style="font-size: 13.5px; font-weight: 800; color: #16233A;">More from Denroy</div>'
      + '<div style="display: flex; gap: 10px; overflow-x: auto;">'
      + map([['EC$120', 'Roof rack, universal'], ['EC$220', 'Tire set, off-road']], function (p) {
        return '<div style="width: 118px; flex-shrink: 0; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; overflow: hidden;">'
          + '<div style="height: 78px; ' + bg(I.carParts, T.neutral) + '"></div>'
          + '<div style="padding: 7px 8px 9px;"><div style="font-size: 12.5px; font-weight: 700; color: #16233A;">' + p[0] + '</div>'
          + '<div style="font-size: 10.5px; color: #7C8697;">' + p[1] + '</div></div></div>';
      }) + '</div></div>'

      + '<div style="height: 20px;"></div></div>'

      + U.actionBar(
          '<div ' + act('nav', 'thread') + ' style="flex: 1; border: 1.5px solid #0E3F80; color: #0E3F80; border-radius: 13px; padding: 14px 0; text-align: center; font-size: 15px; font-weight: 700; cursor: pointer;">Make offer</div>'
          + '<div ' + act('nav', 'collect') + ' style="flex: 1.15; background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 14px 0; text-align: center; font-size: 15px; font-weight: 700; cursor: pointer;">Buy · EC$68,500</div>',
          ' display: flex; gap: 9px;')
      + '</div>';
  }

  S.detail = function (s) {
    return s.detailItem === 'mango' ? mangoDetail(s) : carDetail(s);
  };

  /* ============================== CHECKOUT ============================== */

  S.collect = function () {
    var I = D.IMG, T = D.TINT;
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 12px;">'
      + U.roundBtn('‹', 'nav', 'browse')
      + '<div style="flex: 1; font-size: 15px; font-weight: 700; color: #16233A;">Pickup &amp; pay</div></div>'
      + '<div data-scroll-key="collect" style="flex: 1; overflow-y: auto; padding: 16px 20px 0; display: flex; flex-direction: column; gap: 14px;">'

      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; padding: 13px; display: flex; align-items: center; gap: 12px;">'
      + '<div style="width: 52px; height: 52px; border-radius: 11px; ' + bg(I.vehicle, T.vehicle) + ' flex-shrink: 0;"></div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">'
      + '<div style="font-size: 13.5px; font-weight: 700; color: #16233A;">2018 Toyota Land Cruiser</div>'
      + '<div style="font-size: 11.5px; color: #8B94A3;">from Denroy A. · Look Out</div></div>'
      + '<div style="font-size: 19px; font-weight: 800; letter-spacing: -0.02em; color: #16233A; line-height: 1.1;">EC$68,500</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 9px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Where will you pick up?</div>'
      + '<div style="height: 120px; border-radius: 14px; overflow: hidden; position: relative; background: #DDE6DE;">'
      + '<svg width="100%" height="100%" viewBox="0 0 350 120" preserveAspectRatio="xMidYMid slice">'
      + '<rect width="350" height="120" fill="#DCE6DD"/>'
      + '<path d="M0 70 Q80 40 160 65 T350 55" stroke="#C3D3C6" stroke-width="14" fill="none"/>'
      + '<path d="M40 0 Q60 60 30 120" stroke="#C3D3C6" stroke-width="10" fill="none"/>'
      + '<path d="M300 0 Q280 50 320 120" stroke="#C3D3C6" stroke-width="8" fill="none"/></svg>'
      + '<div style="position: absolute; top: 38px; left: 165px; display: flex; flex-direction: column; align-items: center;">'
      + '<div style="width: 30px; height: 30px; border-radius: 50%; background: #0E3F80; border: 3px solid #FFFFFF; box-shadow: 0 2px 6px rgba(23,35,29,0.35); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 13px;">📍</div></div>'
      + '<div style="position: absolute; bottom: 8px; left: 10px; background: rgba(255,255,255,0.9); font-size: 10px; font-weight: 700; color: #16233A; padding: 3px 8px; border-radius: 6px;">Emerald point, Brades</div></div>'

      + '<div style="background: #E4EDF9; border: 1.5px solid #0E3F80; border-radius: 14px; padding: 12px 13px; display: flex; align-items: center; gap: 11px;">'
      + '<div style="width: 18px; height: 18px; border-radius: 50%; background: #0E3F80; color: #FFFFFF; font-size: 11px; display: flex; align-items: center; justify-content: center;">✓</div>'
      + '<div style="flex: 1;"><div style="font-size: 13.5px; font-weight: 700; color: #0E3F80;">Brades — Emerald point</div>'
      + '<div style="font-size: 11.5px; color: #3A5A4A; margin-top: 2px;">Beside the BBC complex · til 6pm</div></div></div>'

      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 12px 13px; display: flex; align-items: center; gap: 11px;">'
      + '<div style="width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid #C6CDD9;"></div>'
      + '<div style="flex: 1;"><div style="font-size: 13.5px; font-weight: 700; color: #16233A;">Seller delivers to you</div>'
      + '<div style="font-size: 11.5px; color: #8B94A3; margin-top: 2px;">EC$40 · anywhere on island</div></div></div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 9px;">'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">How will you pay?</div>'
      + '<div style="display: flex; gap: 9px;">'
      + '<div style="flex: 1; background: #FFFFFF; border: 1.5px solid #0E3F80; border-radius: 13px; padding: 12px 10px;">'
      + '<div style="font-size: 13px; font-weight: 800; color: #0E3F80;">Cash</div><div style="font-size: 10.5px; color: #3A5A4A; margin-top: 3px;">On pickup</div></div>'
      + '<div style="flex: 1; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 13px; padding: 12px 10px;">'
      + '<div style="font-size: 13px; font-weight: 800; color: #16233A;">Card</div><div style="font-size: 10.5px; color: #8B94A3; margin-top: 3px;">Held in escrow</div></div>'
      + '<div style="flex: 1; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 13px; padding: 12px 10px;">'
      + '<div style="font-size: 13px; font-weight: 800; color: #16233A;">Transfer</div><div style="font-size: 10.5px; color: #8B94A3; margin-top: 3px;">Upload receipt</div></div></div>'
      + '<div style="font-size: 11.5px; line-height: 1.45; color: #7C8697;">Cash orders are held until closing. Two no-shows pauses cash for a month.</div></div>'

      + '<div style="display: flex; align-items: flex-start; gap: 8px; background: #FBF0DC; border: 1px solid #F0D9A8; border-radius: 10px; padding: 10px 12px;">'
      + '<span style="font-size: 13px;">🛡️</span>'
      + '<div style="font-size: 11px; color: #6B4405; line-height: 1.45;">Pay through Emerald Pay for buyer protection — settling off-app means no refund if something goes wrong.</div></div>'

      + '<div style="height: 12px;"></div></div>'

      + U.actionBar(
          '<div style="display: flex; justify-content: space-between; font-size: 12.5px; color: #7C8697;">'
          + '<span>1 item · no delivery fee</span><span style="font-weight: 700; color: #16233A;">EC$68,500</span></div>'
          + U.primaryBtn('Reserve for collection', 'nav', 'orderConfirmed'),
          ' display: flex; flex-direction: column; gap: 9px;')
      + '</div>';
  };

  /* =============================== INBOX =============================== */

  S.messages = function (s) {
    var onMessages = s.msgTab !== 'notifications';
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 20px 0; border-bottom: 1px solid #E8E4D9; display: flex; flex-direction: column; gap: 10px;">'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="font-family: \'Instrument Serif\', serif; font-size: 27px; color: #16233A; line-height: 1;">Inbox</div>'
      + '<div style="display: inline-flex; align-items: center; justify-content: center; font-size: 17px; line-height: 1;">🇲🇸</div></div>'
      + '<div style="display: flex; gap: 18px;">'
      + '<div ' + act('msgTab', 'messages') + ' style="' + U.msgTab(onMessages) + '">Messages</div>'
      + '<div ' + act('msgTab', 'notifications') + ' style="' + U.msgTab(!onMessages) + '">Notifications</div>'
      + '</div></div>'

      + (onMessages
        ? '<div data-scroll-key="inbox" style="flex: 1; overflow-y: auto; padding: 8px 20px 0; display: flex; flex-direction: column;">'
          + map(D.THREADS, function (t) {
            return '<div ' + (t.open ? act('nav', 'thread') : act('noop')) + ' style="padding: 14px 0; border-bottom: 1px solid #F0EDE4; display: flex; align-items: center; gap: 12px;' + (t.open ? ' cursor: pointer;' : '') + '">'
              + U.avatar(46, t.avatar)
              + '<div style="flex: 1;"><div style="display: flex; justify-content: space-between; align-items: baseline;">'
              + '<div style="font-size: 14.5px; font-weight: 700; color: #16233A;">' + t.name + '</div>'
              + '<div style="font-size: 11px; color: #9AA49C;">' + t.time + '</div></div>'
              + '<div style="font-size: 12.5px; color: #6E7B72; margin-top: 3px;">' + t.preview + '</div></div>'
              + when(t.unread, '<div style="width: 9px; height: 9px; border-radius: 50%; background: #0E3F80;"></div>')
              + '</div>';
          }) + '</div>'
        : '<div data-scroll-key="inbox" style="flex: 1; overflow-y: auto; padding: 8px 20px 0; display: flex; flex-direction: column;">'
          + '<div style="display: flex; justify-content: flex-end; padding: 6px 0 4px;">'
          + '<div style="font-size: 12px; font-weight: 700; color: #0E3F80; cursor: pointer;">Mark all read</div></div>'
          + map(D.NOTIFICATIONS, function (n) {
            return '<div style="padding: 13px 0; border-bottom: 1px solid #F0EDE4; display: flex; gap: 11px;">'
              + '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + n.dot + '; margin-top: 6px;"></div>'
              + '<div style="flex: 1;"><div style="font-size: 13px; font-weight: 700; color: #16233A;">' + n.title + '</div>'
              + '<div style="font-size: 12px; color: #7C8697; margin-top: 3px;">' + n.body + '</div></div></div>';
          }) + '</div>')

      + U.bottomNav(s) + '</div>';
  };

  S.thread = function (s) {
    var offerCard = s.offer === 'open'
      ? '<div style="align-self: stretch; background: #FFFFFF; border: 1.5px solid #E09E3B; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 11px;">'
        + '<div style="display: flex; align-items: center; justify-content: space-between;">'
        + '<div style="font-size: 10px; font-weight: 800; letter-spacing: 0.08em; color: #8A5B0E;">OFFER FROM ASHLEY</div>'
        + '<div style="font-size: 11px; color: #9AA49C;">9:12</div></div>'
        + '<div style="font-size: 11px; font-weight: 700; color: #A8483A;">⏱ Denroy has 23h 12m to respond</div>'
        + '<div style="display: flex; align-items: baseline; gap: 10px;">'
        + '<div style="font-size: 26px; font-weight: 800; letter-spacing: -0.025em; color: #16233A; line-height: 1;">EC$1,650</div>'
        + '<div style="font-size: 12px; color: #8B94A3; text-decoration: line-through;">1,850</div></div>'
        + '<div style="font-size: 12px; color: #6E7B72;">Cash on pickup at Brades point</div>'
        + '<div style="display: flex; gap: 9px;">'
        + '<div ' + act('declineOffer') + ' style="flex: 1; border: 1.5px solid #C6CDD9; color: #3A4553; border-radius: 11px; padding: 11px 0; text-align: center; font-size: 13.5px; font-weight: 700; cursor: pointer;">Decline</div>'
        + '<div ' + act('acceptOffer') + ' style="flex: 1.2; background: #0E3F80; color: #FFFFFF; border-radius: 11px; padding: 11px 0; text-align: center; font-size: 13.5px; font-weight: 700; cursor: pointer;">Accept</div></div></div>'
      : s.offer === 'accepted'
        ? '<div style="align-self: stretch; background: #E4EDF9; border: 1.5px solid #0E3F80; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">'
          + '<div style="font-size: 10px; font-weight: 800; letter-spacing: 0.08em; color: #0E3F80;">OFFER ACCEPTED · EC$1,650</div>'
          + '<div style="font-size: 13px; line-height: 1.45; color: #3A5A4A;">Pick up at Brades — Emerald point, til 6pm. Pay cash on pickup.</div>'
          + '<div ' + act('nav', 'collect') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 11px; padding: 11px 0; text-align: center; font-size: 13.5px; font-weight: 700; cursor: pointer;">Arrange collection</div></div>'
        : '<div style="align-self: stretch; background: #F7F6F0; border: 1px solid #E8E4D9; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">'
          + '<div style="font-size: 10px; font-weight: 800; letter-spacing: 0.08em; color: #A8483A;">OFFER DECLINED</div>'
          + '<div style="font-size: 13px; line-height: 1.45; color: #3A4553;">Denroy can counter, or you can send another price.</div>'
          + '<div ' + act('resetOffer') + ' style="border: 1.5px solid #0E3F80; color: #0E3F80; border-radius: 11px; padding: 11px 0; text-align: center; font-size: 13.5px; font-weight: 700; cursor: pointer;">Counter at EC$1,750</div></div>';

    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 11px;">'
      + U.roundBtn('‹', 'nav', 'messages')
      + U.avatar(34, '#E6E1D4,#DED8C9')
      + '<div style="flex: 1;"><div style="font-size: 14px; font-weight: 700; color: #16233A;">Denroy A.</div>'
      + '<div style="font-size: 11px; color: #8B94A3;">★ 4.9 · usually replies in 1 hr</div></div></div>'

      + '<div style="padding: 10px 18px; background: #F4F1E8; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #E8E4D9;">'
      + '<div style="width: 34px; height: 34px; border-radius: 8px; background: repeating-linear-gradient(135deg, #E6E1D4 0 6px, #DED8C9 6px 12px);"></div>'
      + '<div style="flex: 1; font-size: 12.5px; font-weight: 600; color: #16233A;">Honda generator, 3kW</div>'
      + '<div style="font-size: 12.5px; font-weight: 700; color: #16233A;">EC$1,850</div></div>'

      + '<div style="padding: 8px 18px; background: #FBF0DC; border-bottom: 1px solid #F0D9A8; display: flex; align-items: center; gap: 7px;">'
      + '<span style="font-size: 12px;">🛡️</span>'
      + '<div style="font-size: 10.5px; color: #6B4405; line-height: 1.3;">Keep offers &amp; payment in-app — Emerald Pay protects you if something goes wrong.</div></div>'

      + '<div data-scroll-key="thread" style="flex: 1; overflow-y: auto; padding: 14px 18px 0; display: flex; flex-direction: column; gap: 10px;">'
      + '<div style="align-self: flex-start; max-width: 74%; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px 14px 14px 4px; padding: 10px 13px; font-size: 13.5px; color: #16233A; line-height: 1.45;">Morning. Still have the generator?</div>'
      + '<div style="align-self: flex-end; max-width: 74%; background: #0E3F80; border-radius: 14px 14px 4px 14px; padding: 10px 13px; font-size: 13.5px; color: #FFFFFF; line-height: 1.45;">Yes, in Salem. You can see it this evening.</div>'
      + offerCard + '<div style="height: 12px;"></div></div>'

      + '<div style="border-top: 1px solid #E8E4D9; background: #FFFFFF; padding: 12px 18px 26px; display: flex; align-items: center; gap: 10px;">'
      + '<div style="flex: 1; background: #F4F1E8; border-radius: 999px; padding: 12px 16px; font-size: 13.5px; color: #8B94A3;">Write a message</div>'
      + '<div style="width: 42px; height: 42px; border-radius: 50%; background: #0E3F80; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px;">↑</div></div>'
      + '</div>';
  };

  /* =============================== SELL =============================== */

  function pillRow(items) {
    return '<div style="display: flex; gap: 7px; flex-wrap: wrap;">' + map(items, function (p) {
      return p.on
        ? '<div style="background: ' + (p.tone === 'amber' ? '#FBF0DC' : p.tone === 'outline' ? '#E4EDF9' : '#0E3F80')
          + '; ' + (p.tone === 'amber' ? 'border: 1.5px solid #E09E3B; color: #8A5B0E;' : p.tone === 'outline' ? 'border: 1.5px solid #0E3F80; color: #0E3F80;' : 'color: #FFFFFF;')
          + ' font-size: 12.5px; font-weight: 700; padding: 8px 13px; border-radius: 999px;">' + p.label + '</div>'
        : '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; color: #3A4553; font-size: 12.5px; font-weight: 600; padding: 8px 13px; border-radius: 999px;">' + p.label + '</div>';
    }) + '</div>';
  }

  S.sell = function () {
    var I = D.IMG, T = D.TINT;
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 12px;">'
      + U.roundBtn('✕', 'nav', 'browse')
      + '<div style="flex: 1; font-size: 15px; font-weight: 700; color: #16233A;">Sell something</div>'
      + '<div style="font-size: 13px; font-weight: 700; color: #0E3F80; cursor: pointer;">Save draft</div></div>'

      + '<div data-scroll-key="sell" style="flex: 1; overflow-y: auto; padding: 16px 20px 0; display: flex; flex-direction: column; gap: 14px;">'

      // AI assist entry point — the shortcut past a form nobody wants to fill in.
      + '<div ' + act('openAiAssist') + ' style="background: linear-gradient(135deg, #16694A, #0E3F80); border-radius: 14px; padding: 13px 14px; display: flex; align-items: center; gap: 11px; cursor: pointer;">'
      + '<div style="width: 34px; height: 34px; border-radius: 9px; background: rgba(255,255,255,0.16); display: flex; align-items: center; justify-content: center; font-size: 16px;">✨</div>'
      + '<div style="flex: 1;"><div style="color: #FFFFFF; font-size: 13.5px; font-weight: 700;">Fill this in for me</div>'
      + '<div style="color: rgba(230,238,249,0.75); font-size: 11.5px; margin-top: 1px;">Snap a photo — AI writes the title, price &amp; details</div></div>'
      + '<div style="color: #F0B454; font-size: 15px;">›</div></div>'

      + '<div style="display: flex; gap: 10px;">'
      + '<div style="width: 92px; height: 92px; border-radius: 14px; border: 1.5px dashed #C6CDD9; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">'
      + '<div style="font-size: 20px; color: #0E3F80;">+</div><div style="font-size: 10.5px; color: #7C8697;">Add photo</div></div>'
      + '<div style="width: 92px; height: 92px; border-radius: 14px; ' + bg(I.grocery, T.shop) + ' flex-shrink: 0;"></div>'
      + '<div style="width: 92px; height: 92px; border-radius: 14px; ' + bg(I.grocery, T.shop) + ' flex-shrink: 0;"></div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 9px;">'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #16233A;">Honda generator, 3kW</div>'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 13.5px; color: #8B94A3; line-height: 1.45;">Say what it is, how old, any faults…</div>'
      + '<div style="display: flex; gap: 9px;">'
      + '<div style="flex: 1; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #16233A;">EC$ 1,850</div>'
      + '<div style="flex: 1; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #8B94A3;">Salem ⌄</div></div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Condition</div>'
      + pillRow([{ label: 'New' }, { label: 'Like new', on: true }, { label: 'Used' }, { label: 'For parts' }]) + '</div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">How can buyers get it?</div>'
      + pillRow([{ label: 'Pickup', on: true, tone: 'outline' }, { label: "I'll drop it", on: true, tone: 'outline' }, { label: 'Pickup point' }]) + '</div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Category</div>'
      + pillRow([{ label: 'Tools &amp; power', on: true, tone: 'amber' }, { label: 'Home' }, { label: 'Farm' }, { label: 'Vehicles' }]) + '</div>'

      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 12px 13px; display: flex; align-items: center; gap: 11px;">'
      + '<div style="width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #C6CDD9;"></div>'
      + '<div style="flex: 1;"><div style="font-size: 13px; font-weight: 700; color: #16233A;">Boost to the top for a week</div>'
      + '<div style="font-size: 11.5px; color: #8B94A3; margin-top: 2px;">EC$10 · paid at checkout</div></div></div>'

      // Fee transparency: sellers see exactly what they keep before posting.
      + '<div style="background: #F7F6F0; border-radius: 14px; padding: 13px 14px; display: flex; flex-direction: column; gap: 7px;">'
      + '<div style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; color: #6C7585;">IF THIS SELLS</div>'
      + '<div style="display: flex; justify-content: space-between; font-size: 13px; color: #3A4553;"><span>Sale price</span><span>EC$1,850</span></div>'
      + '<div style="display: flex; justify-content: space-between; font-size: 13px; color: #3A4553;"><span>Emerald fee (5%)</span><span>−EC$92.50</span></div>'
      + '<div style="height: 1px; background: #E4E1D3; margin: 2px 0;"></div>'
      + '<div style="display: flex; justify-content: space-between; font-size: 14.5px; font-weight: 800; color: #16233A;"><span>You keep</span><span>EC$1,757.50</span></div>'
      + '<div style="font-size: 11px; color: #8B94A3; margin-top: 2px;">No fee unless it sells — listing is free.</div></div>'

      + '<div style="height: 12px;"></div></div>'
      + U.actionBar(U.primaryBtn('Post listing — free', 'nav', 'pending'))
      + '</div>';
  };

  /* =============================== SEARCH =============================== */

  S.search = function (s) {
    var results = D.searchListings(s.searchQuery);
    var hasQuery = !!(s.searchQuery && s.searchQuery.trim());
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 10px;">'
      + U.roundBtn('‹', 'closeSearch')
      + '<div style="flex: 1; display: flex; align-items: center; gap: 8px; background: #F4F2EC; border-radius: 10px; padding: 9px 12px;">'
      + '<span style="color: #7C8697; font-size: 13px;">⌕</span>'
      + '<input data-focus-key="search" data-input="search" value="' + esc(s.searchQuery) + '" placeholder="Search the island" '
      + 'style="border: none; outline: none; background: transparent; flex: 1; font-size: 13.5px; color: #16233A; font-family: inherit;" /></div></div>'

      + '<div style="flex: 1; overflow-y: auto; padding: 14px 18px; display: flex; flex-direction: column; gap: 10px;">'
      + (hasQuery
        ? '<div style="font-size: 11.5px; font-weight: 700; color: #8B94A3;">' + results.length + (results.length === 1 ? ' result' : ' results') + '</div>'
          + map(results, function (item) {
            return '<div ' + act('openListing', item.id) + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 11px; display: flex; align-items: center; gap: 12px; cursor: pointer;">'
              + '<div style="width: 52px; height: 52px; border-radius: 10px; ' + bg(item.img, item.tint) + ' flex-shrink: 0;"></div>'
              + '<div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">'
              + '<div style="font-size: 13.5px; font-weight: 700; color: #16233A;">' + item.title + '</div>'
              + '<div style="font-size: 11.5px; color: #8B94A3;">' + item.location + ' · ' + item.timeAgo + '</div></div>'
              + '<div style="font-size: 14px; font-weight: 800; color: #16233A;">' + item.price + '</div></div>';
          })
          + when(!results.length, '<div style="text-align: center; padding: 30px 10px; color: #8B94A3; font-size: 13px;">No listings match &quot;' + esc(s.searchQuery) + '&quot;</div>')
        // A near-empty search screen with a few suggestions is the norm.
        : '<div style="font-size: 11.5px; font-weight: 700; color: #8B94A3; padding-top: 4px;">TRY SEARCHING</div>'
          + map(['Land Cruiser', 'Mango', 'Bed set'], function (q) {
            return '<div ' + act('searchFor', q) + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 12px 14px; font-size: 13.5px; color: #3A4553; cursor: pointer;">' + q + '</div>';
          }))
      + '</div></div>';
  };

  /* =============================== LOGIN =============================== */

  S.login = function () {
    var I = D.IMG;
    return '<div style="display: flex; flex-direction: column; height: 100%; background: #0E3F80;">'
      + '<div style="height: 40%; position: relative; flex-shrink: 0; ' + bg(I.loginHero, '#1B4C86') + '">'
      + '<div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,92,63,0.15) 0%, #0E3F80 100%); pointer-events: none;"></div>'
      + '<div ' + act('nav', 'home') + ' style="position: absolute; top: 46px; right: 20px; width: 32px; height: 32px; border-radius: 50%; background: rgba(28,42,34,0.5); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer;">✕</div></div>'

      + '<div style="flex: 1; display: flex; flex-direction: column; padding: 6px 26px 30px; gap: 20px;">'
      + '<div style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: -4px;">'
      + '<div style="color: #FFFFFF; font-family: \'Instrument Serif\', serif; font-size: 25px;">Join Emerald Marketplace</div>'
      + '<div style="color: rgba(230,238,249,0.72); font-size: 13px; text-align: center;">Buy, sell and connect across Montserrat</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 10px;">'
      + '<div ' + act('nav', 'home') + ' style="background: #FFFFFF; border-radius: 13px; padding: 14px 0; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">'
      + '<span style="font-size: 16px;">✉️</span><span style="font-size: 14.5px; font-weight: 700; color: #16233A;">Continue with Email</span></div>'
      + '<div ' + act('nav', 'home') + ' style="background: #FFFFFF; border-radius: 13px; padding: 14px 0; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">'
      + U.ICON.google + '<span style="font-size: 14.5px; font-weight: 700; color: #16233A;">Continue with Google</span></div>'
      + '<div ' + act('nav', 'home') + ' style="background: #1877F2; border-radius: 13px; padding: 14px 0; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">'
      + U.ICON.facebook + '<span style="font-size: 14.5px; font-weight: 700; color: #FFFFFF;">Continue with Facebook</span></div>'
      + '<div ' + act('nav', 'home') + ' style="border: 1.5px solid rgba(255,255,255,0.4); border-radius: 13px; padding: 13px 0; text-align: center; cursor: pointer;">'
      + '<span style="font-size: 13.5px; font-weight: 700; color: #E6EEF9;">Continue as Guest</span></div></div>'

      + '<div style="font-size: 11px; color: rgba(230,238,249,0.6); text-align: center; line-height: 1.5;">Guests can browse, but need an account to message sellers, reply to Wanted posts, or sell.</div>'
      + '</div></div>';
  };

  /* ========================== WANTED / JOB DETAIL ======================== */

  S.wantedDetail = function () {
    var I = D.IMG;
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="height: 220px; ' + bg(I.wantedWasher, '#D4D8DC') + ' position: relative; flex-shrink: 0;">'
      + '<div style="position: absolute; top: 46px; left: 16px; right: 16px; display: flex; justify-content: space-between;">'
      + '<div ' + act('nav', 'browse') + ' style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; font-size: 15px; color: #16233A; cursor: pointer;">‹</div>'
      + '<div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; font-size: 15px; color: #0E3F80;">♡</div></div>'
      + '<div style="position: absolute; bottom: 12px; left: 16px; background: #FBF0DC; color: #8A5B0E; font-size: 10px; font-weight: 800; padding: 4px 9px; border-radius: 6px;">WANTED — reference photo</div></div>'

      + '<div data-scroll-key="wantedDetail" style="flex: 1; overflow-y: auto; padding: 16px 20px 0; display: flex; flex-direction: column; gap: 14px;">'
      + '<div style="display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="font-size: 21px; font-weight: 800; color: #16233A; line-height: 1.2;">Washing machine, working</div>'
      + '<div style="font-size: 13px; color: #7C8697;">St. Peter\'s · posted 1h ago</div></div>'

      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">'
      + U.bluePill('Up to EC$600') + U.tagPill('Needed this week') + U.tagPill('52 views') + U.tagPill('3 offers so far') + '</div>'

      + '<div style="font-size: 13.5px; line-height: 1.55; color: #3A4553;">Front or top loader, just needs to actually work. Can collect from anywhere on the island — I have a pickup truck. Photo shown is just an example of the style I\'m after.</div>'

      // Identity is gated: seeing who posted is what drives sign-ups.
      + '<div style="background: #E4EDF9; border-radius: 12px; padding: 13px 14px; display: flex; align-items: center; gap: 10px;">'
      + '<span style="font-size: 15px;">🔒</span>'
      + '<div style="font-size: 12.5px; color: #0E3F80; line-height: 1.4;">Log in to see who\'s asking and send an offer</div></div>'
      + '<div style="height: 20px;"></div></div>'

      + U.actionBar('<div ' + act('wantedGate') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 15px 0; text-align: center; font-size: 15px; font-weight: 700; cursor: pointer;">I have this — offer it</div>')
      + '</div>';
  };

  S.yardDetail = function () {
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 12px;">'
      + U.roundBtn('‹', 'nav', 'browse')
      + '<div style="flex: 1; font-size: 15px; font-weight: 700; color: #16233A;">Wanted — Service</div></div>'

      + '<div data-scroll-key="yard" style="flex: 1; overflow-y: auto; padding: 18px 20px 0; display: flex; flex-direction: column; gap: 14px;">'
      + '<div style="display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">'
      + '<div style="font-size: 21px; font-weight: 800; color: #16233A; line-height: 1.2;">Someone to cut a yard, Salem</div>'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10.5px; font-weight: 800; padding: 5px 9px; border-radius: 6px; white-space: nowrap; margin-top: 3px;">SERVICE</div></div>'
      + '<div style="font-size: 13px; color: #7C8697;">Salem · posted yesterday</div></div>'

      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">'
      + U.bluePill('Cash same day') + U.tagPill('19 views') + U.tagPill('1 offer so far') + '</div>'

      + '<div style="font-size: 13.5px; line-height: 1.55; color: #3A4553;">Medium-size yard, mostly grass with a slope at the back. Own tools preferred but not required — I have a weed whacker you could borrow. Looking to get this done this weekend.</div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px; background: #F7F6F0; border-radius: 12px; padding: 12px 13px;">'
      + '<div style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em; color: #6C7585;">POSTED BY</div>'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="display: flex; align-items: center; gap: 9px;">' + U.avatar(34, '#DDE4EE,#D3DBE7', 'flex-shrink: 0;')
      + '<div style="font-size: 13px; color: #16233A; font-weight: 600;">Merle J. · Salem</div></div>'
      + '<div ' + act('whatsapp') + ' style="display: flex; align-items: center; gap: 6px; background: #25D366; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 7px 12px; border-radius: 8px; cursor: pointer;">WhatsApp</div></div>'
      + '<div style="font-size: 12.5px; color: #7C8697;">Member since 2024 · usually replies within a few hours</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Your offer</div>'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #8B94A3;">Your price, EC$</div>'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; min-height: 56px; font-size: 13.5px; color: #8B94A3; line-height: 1.45;">Add a note — when you\'re free, tools you have…</div></div>'
      + '<div style="height: 20px;"></div></div>'

      + U.actionBar(U.primaryBtn('Send offer', 'nav', 'browse'))
      + '</div>';
  };

  S.jobDetail = function () {
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 12px;">'
      + U.roundBtn('‹', 'nav', 'browse')
      + '<div style="flex: 1; font-size: 15px; font-weight: 700; color: #16233A;">Job posting</div>'
      + '<div style="font-size: 17px; color: #0E3F80;">♡</div></div>'

      + '<div data-scroll-key="jobDetail" style="flex: 1; overflow-y: auto; padding: 18px 20px 0; display: flex; flex-direction: column; gap: 14px;">'
      + '<div style="display: flex; flex-direction: column; gap: 5px;">'
      + '<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">'
      + '<div style="font-size: 21px; font-weight: 800; color: #16233A; line-height: 1.2;">Cashier, part-time</div>'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10.5px; font-weight: 800; padding: 5px 9px; border-radius: 6px; white-space: nowrap; margin-top: 3px;">HIRING</div></div>'
      + '<div style="font-size: 13px; color: #7C8697;">Ram\'s Supermarket · Salem</div></div>'

      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">'
      + U.tagPill('Part-time') + U.tagPill('EC$18/hr') + U.tagPill('In-person') + '</div>'

      + '<div style="font-size: 13.5px; line-height: 1.55; color: #3A4553;">Looking for a reliable cashier to join our Salem location, weekday afternoons and Saturdays. Prior retail/cash handling experience preferred but not required — we\'ll train the right person.</div>'

      + U.detailsCard([['Schedule', 'Weekday PM + Sat'], ['Pay', 'EC$18/hr'], ['Start date', 'As soon as possible'], ['Experience', 'Not required']])
      + U.contactCard('Denise A. · Store manager', '+1 (664) 491-2278 · replies within a day')
      + '<div style="height: 20px;"></div></div>'

      + U.actionBar(U.primaryBtn('Apply now', 'nav', 'thread'))
      + '</div>';
  };

  /* ======================= SHOP / REALTY STOREFRONTS ===================== */

  function storefront(o) {
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="height: 190px; ' + bg(o.hero, o.tint) + ' position: relative; flex-shrink: 0;">'
      + '<div style="position: absolute; top: 46px; left: 16px; right: 16px; display: flex; justify-content: space-between;">'
      + '<div ' + act('nav', 'browse') + ' style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; font-size: 15px; color: #16233A; cursor: pointer;">‹</div>'
      + '<div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; font-size: 15px; color: #0E3F80;">♡</div></div></div>'

      + '<div style="padding: 14px 20px 0; display: flex; align-items: center; gap: 12px;">'
      + '<div style="width: 58px; height: 58px; border-radius: 14px; ' + bg(o.mark, o.tint) + ' margin-top: -34px; border: 3px solid #FFFFFF; flex-shrink: 0;"></div>'
      + '<div style="flex: 1;"><div style="font-size: 18px; font-weight: 800; color: #16233A;">' + o.name + '</div>'
      + '<div style="font-size: 12px; color: #7C8697;">' + o.meta + '</div></div>'
      + '<div style="background: #E4EDF9; color: #0E3F80; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 5px;">OPEN</div></div>'

      + '<div data-scroll-key="storefront" style="flex: 1; overflow-y: auto; padding: 14px 20px 0; display: flex; flex-direction: column; gap: 14px;">'
      + '<div style="display: flex; gap: 7px; flex-wrap: wrap;">' + map(o.tags, U.tagPill) + '</div>'
      + '<div style="font-size: 13.5px; line-height: 1.55; color: #3A4553;">' + o.blurb + '</div>'
      + o.body
      + U.contactCard(o.contactName, o.contactLine)
      + '<div style="height: 20px;"></div></div>'
      + U.actionBar(U.primaryBtn(o.cta, 'nav', 'thread'))
      + '</div>';
  }

  S.shopDetail = function () {
    var I = D.IMG, T = D.TINT;
    var items = [
      { img: I.necklace, price: 'EC$45', name: 'Shell necklace' },
      { img: I.cards, price: 'EC$28', name: 'Volcano print card set' },
      { img: I.basket, price: 'EC$60', name: 'Handwoven basket' }
    ];
    return storefront({
      hero: I.momentosWide, mark: I.momentos, tint: T.craft,
      name: 'Island Momentos', meta: 'Little Bay · Crafts, souvenirs, jewelry',
      tags: ['Made in Montserrat', 'Mon-Sat, 9-5', 'Pickup only'],
      blurb: 'Handmade Montserrat crafts, jewelry and souvenirs — a PRIME-exhibiting local favorite. Stop by the shop in Little Bay or message ahead to reserve a piece.',
      body: '<div style="display: flex; flex-direction: column; gap: 9px;">'
        + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Featured items</div>'
        + '<div style="display: flex; gap: 11px; overflow-x: auto; -webkit-overflow-scrolling: touch;">'
        + map(items, function (it) {
          return '<div style="width: 128px; flex-shrink: 0; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; overflow: hidden;">'
            + '<div style="height: 88px; ' + bg(it.img, T.craft) + '"></div>'
            + '<div style="padding: 8px 9px 10px;"><div style="font-size: 13px; font-weight: 800; color: #16233A;">' + it.price + '</div>'
            + '<div style="font-size: 10.5px; color: #7C8697;">' + it.name + '</div></div></div>';
        }) + '</div></div>',
      contactName: 'Sonia P. · Owner', contactLine: '+1 (664) 491-5502 · Little Bay',
      cta: 'Message the shop'
    });
  };

  S.realtyDetail = function () {
    var I = D.IMG, T = D.TINT;
    var props = [
      { img: I.villa, price: 'EC$1,250,000', title: '3-bed villa, sea view', meta: 'Woodlands · For sale' },
      { img: I.apartment, price: 'EC$2,400/mo', title: '2-bed apartment', meta: 'Salem · For rent' },
      { img: I.lot, price: 'EC$310,000', title: 'Building lot, 0.5 acre', meta: 'Look Out · For sale' }
    ];
    return storefront({
      hero: I.realtyWide, mark: I.realty, tint: T.realty,
      name: 'Montserrat Realty Co.', meta: 'Brades · Licensed real estate agency',
      tags: ['Licensed agent', 'Sales &amp; rentals', 'Mon-Fri, 9-5'],
      blurb: 'Full-service real estate agency covering all of Montserrat — home sales, long-term rentals, and land. Message us for a viewing.',
      body: '<div style="display: flex; flex-direction: column; gap: 9px;">'
        + '<div style="font-size: 15px; font-weight: 800; color: #16233A;">Listed properties</div>'
        + '<div style="display: flex; flex-direction: column; gap: 9px;">'
        + map(props, function (p) {
          return '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; overflow: hidden; display: flex; cursor: pointer;">'
            + '<div style="width: 100px; height: 88px; ' + bg(p.img, T.realty) + ' flex-shrink: 0;"></div>'
            + '<div style="padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; justify-content: center;">'
            + '<div style="font-size: 14px; font-weight: 800; color: #16233A;">' + p.price + '</div>'
            + '<div style="font-size: 12px; color: #3A4553;">' + p.title + '</div>'
            + '<div style="font-size: 10.5px; color: #8B94A3;">' + p.meta + '</div></div></div>';
        }) + '</div></div>',
      contactName: 'Denise A. · Broker', contactLine: '+1 (664) 491-8820 · Brades',
      cta: 'Message the agency'
    });
  };

  /* ============================ POST WANTED ============================ */

  S.postWanted = function () {
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 12px;">'
      + U.roundBtn('✕', 'nav', 'browse')
      + '<div style="flex: 1; font-size: 15px; font-weight: 700; color: #16233A;">Post a Wanted ad</div></div>'

      + '<div data-scroll-key="postWanted" style="flex: 1; overflow-y: auto; padding: 16px 20px 0; display: flex; flex-direction: column; gap: 14px;">'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #16233A;">What are you looking for?</div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Reference photo (optional)</div>'
      + '<div style="display: flex; gap: 10px;">'
      + '<div style="width: 76px; height: 76px; border-radius: 14px; border: 1.5px dashed #C6CDD9; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">'
      + '<div style="font-size: 18px; color: #0E3F80;">+</div><div style="font-size: 9.5px; color: #7C8697;">Add photo</div></div></div></div>'

      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 13.5px; color: #8B94A3; line-height: 1.45;">Add detail — brand, size, condition you\'ll accept…</div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Budget</div>'
      + '<div style="display: flex; gap: 9px;">'
      + '<div style="flex: 1; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #8B94A3;">Min EC$</div>'
      + '<div style="flex: 1; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #8B94A3;">Max EC$</div></div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Needed by</div>'
      + pillRow([{ label: 'This week', on: true }, { label: 'This month' }, { label: 'No rush' }])
      + '<div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; cursor: pointer;">'
      + '<span style="font-size: 14px;">📅</span><span style="font-size: 13.5px; color: #8B94A3;">Or pick a specific date or date range</span></div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Area</div>'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #8B94A3;">Salem ⌄</div></div>'

      + '<div style="display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="font-size: 12.5px; font-weight: 800; color: #16233A;">Notes for sellers</div>'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; min-height: 64px; font-size: 13.5px; color: #8B94A3; line-height: 1.45;">e.g. Can collect same day, prefer cash…</div></div>'

      + '<div style="height: 12px;"></div></div>'
      + U.actionBar(U.primaryBtn('Post Wanted ad — free', 'nav', 'browse'))
      + '</div>';
  };

  /* ======================== VERIFY / PENDING STATES ====================== */

  S.verify = function () {
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 12px;">'
      + U.roundBtn('✕', 'nav', 'profile')
      + '<div style="flex: 1; font-size: 15px; font-weight: 700; color: #16233A;">Verify your identity</div></div>'

      + '<div style="flex: 1; overflow-y: auto; padding: 18px 20px 0; display: flex; flex-direction: column; gap: 16px;">'
      + '<div style="font-size: 13.5px; color: #4A5A52; line-height: 1.55;">Every seller on Emerald Marketplace is verified — this keeps the island\'s buyers and sellers safe. Takes about 2 minutes.</div>'
      + '<div style="display: flex; flex-direction: column; gap: 10px;">'
      + '<div style="border: 1.5px dashed #C6CDD9; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 7px;">'
      + '<div style="font-size: 22px; color: #0E3F80;">🪪</div>'
      + '<div style="font-size: 13px; font-weight: 700; color: #16233A;">Upload a photo ID</div>'
      + '<div style="font-size: 11.5px; color: #8B94A3;">Passport or national ID</div></div>'
      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #8B94A3;">Phone number for verification</div></div>'
      + '<div style="display: flex; align-items: flex-start; gap: 8px; background: #E4EDF9; border-radius: 10px; padding: 11px 12px;">'
      + '<span style="font-size: 13px;">🛡️</span>'
      + '<div style="font-size: 11.5px; color: #3A5A4A; line-height: 1.45;">Your ID is only used to confirm you\'re a real person — it\'s never shown to buyers.</div></div></div>'

      + U.actionBar(U.primaryBtn('Submit for verification', 'completeVerify'))
      + '</div>';
  };

  S.pending = function () {
    return '<div style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: center; padding: 40px 30px; text-align: center; gap: 16px;">'
      + '<div style="width: 64px; height: 64px; border-radius: 50%; background: #FBF0DC; display: flex; align-items: center; justify-content: center; font-size: 28px;">⏳</div>'
      + '<div style="font-size: 19px; font-weight: 800; color: #16233A;">Submitted for review</div>'
      + '<div style="font-size: 13.5px; color: #7C8697; line-height: 1.55; max-width: 280px;">Your listing goes live once our team approves it — usually within a few hours. We check photos and pricing to keep the marketplace trustworthy.</div>'
      + '<div ' + act('nav', 'home') + ' style="margin-top: 8px; background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 14px 30px; font-size: 14.5px; font-weight: 700; cursor: pointer;">Back to home</div></div>';
  };

  S.orderConfirmed = function () {
    return '<div style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: center; padding: 36px 30px; text-align: center; gap: 14px;">'
      + '<div style="width: 64px; height: 64px; border-radius: 50%; background: #E4F5EA; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #13944B;">✓</div>'
      + '<div style="font-size: 17px; font-weight: 800; color: #16233A;">Order placed!</div>'
      + '<div style="font-size: 13px; color: #8B94A3; line-height: 1.5;">Ram\'s Supermarket will prepare your delivery. Hilltop Coffee House will have your pickup ready — cash on arrival.</div>'
      + '<div style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 8px;">'
      + '<div ' + act('nav', 'collect') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 14px 0; text-align: center; font-size: 14.5px; font-weight: 700; cursor: pointer;">Track my order</div>'
      + '<div ' + act('nav', 'home') + ' style="background: #F4F2EC; color: #16233A; border-radius: 13px; padding: 14px 0; text-align: center; font-size: 14.5px; font-weight: 700; cursor: pointer;">Continue shopping</div></div></div>';
  };

  /* =============================== CART =============================== */

  function cartLine(item, qty, s) {
    var lineTotal = 'EC$' + (item.unitPrice * qty);
    return '<div style="display: flex; flex-direction: column; gap: 8px; background: #F7F6F0; border-radius: 16px; padding: 12px;">'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="font-size: 12.5px; font-weight: 700; color: #16233A;">' + item.seller + '</div>'
      + '<div style="background: ' + item.sellerBadgeBg + '; color: ' + item.sellerBadgeColor + '; font-size: 9.5px; font-weight: 800; padding: 3px 7px; border-radius: 5px;">' + item.sellerBadge + '</div></div>'

      + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 12px; display: flex; gap: 12px;">'
      // Taller photo, quantity moved alongside — the Amazon-style cart row.
      + '<div style="width: 84px; height: 108px; border-radius: 10px; ' + bg(item.img, item.tint) + ' flex-shrink: 0;"></div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">'
      + '<div style="display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">'
      + '<div style="font-size: 14px; font-weight: 700; color: #16233A; line-height: 1.25;">' + item.title + '</div>'
      + '<div style="font-size: 15px; font-weight: 800; color: #16233A; flex-shrink: 0;">' + lineTotal + '</div></div>'
      + '<div style="font-size: 11px; color: #8B94A3;">' + item.meta + '</div>'
      + '<div style="font-size: 11px; color: #13944B; font-weight: 600;">In stock</div></div>'
      + '<div style="display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="display: flex; align-items: center; gap: 10px; background: #F4F2EC; border-radius: 7px; padding: 4px 10px;">'
      + '<span ' + act('qty', item.key + ':-1') + ' style="font-size: 14px; font-weight: 700; color: #0E3F80; cursor: pointer; width: 12px; text-align: center;">−</span>'
      + '<span style="font-size: 12.5px; font-weight: 700; color: #16233A;">' + qty + '</span>'
      + '<span ' + act('qty', item.key + ':1') + ' style="font-size: 14px; font-weight: 700; color: #0E3F80; cursor: pointer; width: 12px; text-align: center;">+</span></div>'
      // Icons only: save / share / remove read fine without labels.
      + '<div style="display: flex; align-items: center; gap: 12px;">'
      + '<div ' + act('saveForLater', item.key) + ' style="color: #3A4553; cursor: pointer; display: flex;">' + U.ICON.heart + '</div>'
      + '<div ' + act('noop') + ' style="color: #3A4553; cursor: pointer; display: flex;">' + U.ICON.share + '</div>'
      + '<div ' + act('removeItem', item.key) + ' style="color: #3A4553; cursor: pointer; display: flex;">' + U.ICON.trash + '</div>'
      + '</div></div></div></div>'

      + '<div style="display: flex; align-items: center; justify-content: space-between; padding: 2px 2px 0;">'
      + '<div style="font-size: 10.5px; color: #8B94A3;">' + item.payNote + '</div>'
      + '<div style="font-size: 11px; font-weight: 700; color: #3A4553;">Subtotal ' + lineTotal + '</div></div></div>';
  }

  function savedForLaterRow(item) {
    return '<div style="background: #F7F6F0; border: 1px solid #E8E4D9; border-radius: 14px; padding: 11px; display: flex; align-items: center; gap: 12px;">'
      + '<div style="width: 52px; height: 52px; border-radius: 10px; ' + bg(item.thumb, item.tint) + ' flex-shrink: 0; opacity: 0.7;"></div>'
      + '<div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="font-size: 13.5px; font-weight: 700; color: #16233A;">' + item.title + '</div>'
      + '<div ' + act('moveToCart', item.key) + ' style="font-size: 11px; font-weight: 700; color: #0E3F80; cursor: pointer;">Move to cart</div></div>'
      + '<div style="font-size: 14px; font-weight: 800; color: #8B94A3;">EC$' + item.unitPrice + '</div></div>';
  }

  S.cart = function (s) {
    var C = D.CART_ITEMS, I = D.IMG, T = D.TINT;
    var header = '<div style="padding: 46px 18px 12px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; gap: 12px;">'
      + U.roundBtn('‹', 'nav', 'home')
      + '<div style="flex: 1; font-size: 15px; font-weight: 700; color: #16233A;">Your cart</div></div>';

    if (s.ramsRemoved && s.hilltopRemoved) {
      return '<div style="display: flex; flex-direction: column; height: 100%;">' + header
        + '<div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 40px; text-align: center;">'
        + '<div style="width: 60px; height: 60px; border-radius: 50%; background: #F4F2EC; display: flex; align-items: center; justify-content: center;">' + U.ICON.cartLg + '</div>'
        + '<div style="font-size: 15px; font-weight: 700; color: #16233A;">Your cart is empty</div>'
        + '<div style="font-size: 12.5px; color: #8B94A3;">Browse listings and shops to add items</div>'
        + '<div ' + act('nav', 'browse') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 12px; padding: 11px 22px; font-size: 13.5px; font-weight: 700; cursor: pointer; margin-top: 6px;">Start browsing</div>'
        + '</div></div>';
    }

    var savedCount = (s.ramsSaved ? 1 : 0) + (s.hilltopSaved ? 1 : 0);
    var subtotal = (s.ramsSaved || s.ramsRemoved ? 0 : C.rams.unitPrice * s.ramsQty)
      + (s.hilltopSaved || s.hilltopRemoved ? 0 : C.hilltop.unitPrice * s.hilltopQty);

    return '<div style="display: flex; flex-direction: column; height: 100%;">' + header
      + '<div data-scroll-key="cart" style="flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 16px;">'
      + when(!s.ramsSaved && !s.ramsRemoved, cartLine(C.rams, s.ramsQty, s))
      + when(!s.hilltopSaved && !s.hilltopRemoved, cartLine(C.hilltop, s.hilltopQty, s))

      + when(savedCount,
          '<div style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px; border-top: 1px solid #F0EDE3;">'
          + '<div style="font-size: 12.5px; font-weight: 700; color: #8B94A3;">Saved for later (' + savedCount + ')</div>'
          + when(s.ramsSaved, savedForLaterRow(C.rams))
          + when(s.hilltopSaved, savedForLaterRow(C.hilltop)) + '</div>')

      + '<div style="display: flex; flex-direction: column; gap: 8px; padding-top: 4px; border-top: 1px solid #F0EDE3;">'
      + '<div style="font-size: 12.5px; font-weight: 700; color: #8B94A3;">Bought before</div>'
      + '<div style="display: flex; gap: 10px; overflow-x: auto; -webkit-overflow-scrolling: touch;">'
      + '<div style="width: 118px; flex-shrink: 0; background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 12px; overflow: hidden;">'
      + '<div style="height: 78px; ' + bg(I.mangoSquare, T.produce) + '"></div>'
      + '<div style="padding: 7px 8px 8px;"><div style="font-size: 12px; font-weight: 800; color: #16233A;">EC$25</div>'
      + '<div style="font-size: 9.5px; color: #7C8697;">Mango crate</div>'
      + '<div ' + act('noop') + ' style="margin-top: 4px; text-align: center; background: #F4F2EC; color: #0E3F80; font-size: 10px; font-weight: 700; padding: 4px 0; border-radius: 6px; cursor: pointer;">+ Add again</div>'
      + '</div></div></div></div>'
      + '</div>'

      + '<div style="background: #FFFFFF; border-top: 1px solid #E8E4D9; padding: 14px 18px 26px; display: flex; flex-direction: column; gap: 8px;">'
      + '<div style="display: flex; align-items: center; gap: 6px; justify-content: center; background: #F4F2EC; border-radius: 8px; padding: 6px 0; font-size: 11.5px; font-weight: 700; color: #A8483A;">⏱ Reserved for 9:42 — complete your order</div>'
      + when(s.cartSummaryOpen,
          '<div style="display: flex; align-items: flex-start; gap: 7px; background: #FBF0DC; border: 1px solid #F0D9A8; border-radius: 10px; padding: 9px 10px;">'
          + '<span style="font-size: 13px;">🛡️</span>'
          + '<div style="font-size: 10.5px; color: #6B4405; line-height: 1.4;">Pay through Emerald Pay for buyer protection — cash off-app means no refund if something goes wrong.</div></div>'
          + '<div style="background: #E4EDF9; border-radius: 10px; padding: 8px 10px; font-size: 11px; color: #0E3F80; font-weight: 600;">Add EC$36 more from Ram\'s for free delivery</div>'
          + '<div style="font-size: 11px; color: #8B94A3;">2 sellers · 2 fulfillment methods — charged separately per seller</div>'
          + '<div style="display: flex; justify-content: space-between; font-size: 12px; color: #3A4553;"><span>Subtotal</span><span>EC$' + subtotal + '</span></div>'
          + '<div style="display: flex; justify-content: space-between; font-size: 12px; color: #3A4553;"><span>Delivery fee</span><span>EC$0</span></div>')
      + '<div ' + act('toggleCartSummary') + ' style="display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 700; color: #16233A; padding-top: 4px; border-top: 1px solid #F0EDE3; cursor: pointer;">'
      + '<span style="display: flex; align-items: center; gap: 5px;">Total <span style="font-size: 10px; color: #8B94A3;">' + (s.cartSummaryOpen ? '▾' : '▸') + '</span></span>'
      + '<span>EC$' + subtotal + '</span></div>'
      + '<div ' + act('nav', 'orderConfirmed') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 14px 0; text-align: center; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 4px;">Checkout</div>'
      + '</div></div>';
  };

  /* =============================== SAVED =============================== */

  S.saved = function (s) {
    var I = D.IMG, T = D.TINT;
    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 20px 14px; border-bottom: 1px solid #E8E4D9; display: flex; align-items: center; justify-content: space-between;">'
      + '<div style="font-family: \'Instrument Serif\', serif; font-size: 27px; color: #16233A; line-height: 1;">Saved</div>'
      + '<div style="font-size: 12.5px; color: #8B94A3;">6 items</div></div>'

      + when(s.searchSaved,
          '<div style="padding: 12px 20px 0;">'
          + '<div style="font-size: 11px; font-weight: 700; letter-spacing: 0.05em; color: #8B94A3; margin-bottom: 6px;">SAVED SEARCHES</div>'
          + '<div ' + act('nav', 'browse') + ' style="background: #FBF0DC; border: 1px solid #F0D9A8; border-radius: 11px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">'
          + '<div style="font-size: 13px; font-weight: 700; color: #16233A;">☆ Your saved search</div>'
          + '<div style="font-size: 11.5px; color: #8A5B0E;">View ›</div></div></div>')

      + '<div data-scroll-key="saved" style="flex: 1; overflow-y: auto; padding: 14px 20px 0;">'
      + '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">'
      + '<div ' + act('nav', 'detail') + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; overflow: hidden; cursor: pointer;">'
      + '<div style="height: 120px; ' + bg(I.generator, T.neutral) + ' position: relative;">'
      + '<div style="position: absolute; top: 7px; right: 7px; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #0E3F80;">♡</div></div>'
      + '<div style="padding: 10px 11px 12px; display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.07em; color: #E09E3B;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #E09E3B;"></span>TOOLS</div>'
      + '<div style="font-size: 15px; font-weight: 800; letter-spacing: -0.02em; color: #16233A; line-height: 1.1;">EC$1,850</div>'
      + '<div style="font-size: 12.5px; color: #3A4553; line-height: 1.3;">Honda generator, 3kW</div>'
      + '<div style="font-size: 11px; color: #8B94A3;">Price dropped EC$200</div></div></div>'

      + '<div ' + act('nav', 'detail') + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; overflow: hidden; cursor: pointer;">'
      + '<div style="height: 88px; background: repeating-linear-gradient(135deg, #DEE4D6 0 8px, #D5DCCB 8px 16px); position: relative;">'
      + '<div style="position: absolute; top: 7px; right: 7px; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #0E3F80;">♡</div></div>'
      + '<div style="padding: 10px 11px 12px; display: flex; flex-direction: column; gap: 3px;">'
      + '<div style="display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.07em; color: #0E3F80;"><span style="width: 5px; height: 5px; border-radius: 50%; background: #0E3F80;"></span>HOME</div>'
      + '<div style="font-size: 15px; font-weight: 800; letter-spacing: -0.02em; color: #16233A; line-height: 1.1;">EC$300</div>'
      + '<div style="font-size: 12.5px; color: #3A4553; line-height: 1.3;">Mahogany chairs (4)</div>'
      + '<div style="font-size: 11px; color: #8B94A3;">Brades · still available</div></div></div>'
      + '</div></div>' + U.bottomNav(s) + '</div>';
  };

  /* ============================== PROFILE ============================== */

  function profileRow(icon, label, action, colour) {
    return '<div ' + act(action) + ' style="display: flex; align-items: center; gap: 12px; padding: 13px 2px; cursor: pointer;">'
      + '<div style="width: 22px; color: ' + (colour || '#6C7585') + ';">' + icon + '</div>'
      + '<div style="flex: 1; font-size: 13.5px; font-weight: 600; color: ' + (colour || '#16233A') + ';">' + label + '</div>'
      + when(!colour, '<div style="font-size: 15px; color: #C6CDD9;">›</div>') + '</div>';
  }

  S.profile = function (s) {
    var I = D.IMG, T = D.TINT;

    var sellingBlock = s.isSeller
      ? when(!s.verified,
          '<div ' + act('nav', 'verify') + ' style="background: #FBF0DC; border: 1px solid #F0D9A8; border-radius: 14px; padding: 13px 14px; display: flex; align-items: center; gap: 11px; cursor: pointer;">'
          + '<div style="width: 34px; height: 34px; border-radius: 10px; background: #E09E3B; display: flex; align-items: center; justify-content: center; font-size: 15px;">🛡️</div>'
          + '<div style="flex: 1;"><div style="font-size: 13px; font-weight: 700; color: #6B4405;">Verify your identity to sell</div>'
          + '<div style="font-size: 11.5px; color: #8A5B0E; margin-top: 1px;">ID + phone check — required before listing goes live</div></div>'
          + '<div style="font-size: 15px; color: #8A5B0E;">›</div></div>')

        + '<div style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; color: #9AA49C; padding-top: 6px;">SELLING</div>'
        + '<div style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 16px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">'
        + '<div><div style="font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: #9AA49C;">EARNED THIS MONTH</div>'
        + '<div style="font-size: 27px; font-weight: 800; letter-spacing: -0.025em; color: #16233A; line-height: 1; margin-top: 6px;">EC$2,140</div></div>'
        + '<div style="text-align: right;"><div style="font-size: 12px; color: #8B94A3;">4 sold</div>'
        + '<div style="font-size: 12px; font-weight: 700; color: #0E3F80; margin-top: 3px;">EC$310 pending</div></div></div>'

        + '<div style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; color: #9AA49C; padding-top: 2px;">BUYING</div>'
        + '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">'
        + map([
            { icon: U.ICON.heartSm, label: 'Saved', action: 'nav', arg: 'saved' },
            { icon: U.ICON.bagSm, label: 'Purchases', action: 'nav', arg: 'collect' },
            { icon: U.ICON.card, label: 'Payment', action: 'noop' }
          ], function (t) {
            return '<div ' + act(t.action, t.arg) + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 12px 8px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;">'
              + '<div style="color: #0E3F80;">' + t.icon + '</div>'
              + '<div style="font-size: 11px; font-weight: 700; color: #16233A; text-align: center;">' + t.label + '</div></div>';
          }) + '</div>'

        + '<div style="display: flex; gap: 18px; border-bottom: 1px solid #E8E4D9;">'
        + '<div style="font-size: 13.5px; font-weight: 700; color: #0E3F80; padding-bottom: 9px; border-bottom: 2px solid #0E3F80;">Active 3</div>'
        + '<div style="font-size: 13.5px; font-weight: 600; color: #8B94A3; padding-bottom: 9px;">Pending 1</div>'
        + '<div style="font-size: 13.5px; font-weight: 600; color: #8B94A3; padding-bottom: 9px;">Sold 4</div>'
        + '<div style="font-size: 13.5px; font-weight: 600; color: #8B94A3; padding-bottom: 9px;">Drafts 2</div></div>'

        + '<div style="display: flex; flex-direction: column; gap: 10px;">'
        + map([
            { title: 'Breadfruit, half dozen', meta: 'EC$18 · 22 views · 2 saves', link: true },
            { title: 'Baby stroller', meta: 'EC$150 · offer pending EC$120' }
          ], function (l) {
            return '<div ' + (l.link ? act('nav', 'detail') : act('noop')) + ' style="background: #FFFFFF; border: 1px solid #E8E4D9; border-radius: 14px; padding: 11px; display: flex; align-items: center; gap: 12px; cursor: pointer;">'
              + '<div style="width: 54px; height: 54px; border-radius: 10px; ' + bg(I.grocery, T.shop) + ' flex-shrink: 0;"></div>'
              + '<div style="flex: 1;"><div style="font-size: 13.5px; font-weight: 600; color: #16233A;">' + l.title + '</div>'
              + '<div style="font-size: 11.5px; color: #8B94A3; margin-top: 3px;">' + l.meta + '</div></div>'
              + '<div style="font-size: 15px; color: #9AA49C;">⋯</div></div>';
          }) + '</div>'

      // Buyers who have never sold get an invitation, not an empty dashboard.
      : '<div style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; color: #9AA49C; padding-top: 6px;">SELLING</div>'
        + '<div ' + act('startSelling') + ' style="background: #F4F2EC; border: 1px dashed #C6D0C9; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; cursor: pointer;">'
        + '<div style="width: 40px; height: 40px; border-radius: 50%; background: #16233A; color: #FBF8F1; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700;">+</div>'
        + '<div style="font-size: 13.5px; font-weight: 700; color: #16233A;">Start selling on Emerald</div>'
        + '<div style="font-size: 11.5px; color: #8B94A3;">List your first item — free to post, small fee only when it sells</div></div>';

    return '<div style="display: flex; flex-direction: column; height: 100%;">'
      + '<div style="padding: 46px 20px 16px; background: #0E3F80; display: flex; align-items: center; gap: 13px;">'
      + '<div style="width: 52px; height: 52px; border-radius: 50%; background: repeating-linear-gradient(135deg, #2E7256 0 6px, #276549 6px 12px); border: 1.5px solid rgba(255,255,255,0.35);"></div>'
      + '<div style="flex: 1;"><div style="color: #FFFFFF; font-size: 18px; font-weight: 700;">Ashley M.</div>'
      + '<div style="color: rgba(230,238,249,0.75); font-size: 12px; margin-top: 3px;">Salem · joined 2025 · ★ 5.0 (8)</div></div>'
      + '<div ' + act('noop') + ' style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer;">' + U.ICON.pencil + '</div></div>'

      + '<div data-scroll-key="profile" style="flex: 1; overflow-y: auto; padding: 14px 20px 0; display: flex; flex-direction: column; gap: 14px;">'
      + sellingBlock
      + '<div style="display: flex; flex-direction: column; gap: 2px; padding-top: 4px; border-top: 1px solid #F0EDE3;">'
      + profileRow(U.ICON.gear, 'Settings &amp; account', 'noop')
      + profileRow(U.ICON.chatBubble, 'Help &amp; support', 'whatsapp')
      + profileRow(U.ICON.logout, 'Log out', 'logOut', '#A8483A')
      + '<div style="text-align: center; font-size: 10.5px; color: #C6CDD9; padding: 10px 0 4px;">Emerald Marketplace · v1.0</div>'
      + '</div></div>' + U.bottomNav(s) + '</div>';
  };

  /* ============================== OVERLAYS ============================== */

  S.overlays = function (s) {
    var out = '';

    if (s.sortOpen) {
      out += U.sheet('closeSort', U.sortRows([
        { key: 'newest', label: 'Newest first' },
        { key: 'price', label: 'Price: low to high' },
        { key: 'priceDesc', label: 'Price: high to low' },
        { key: 'near', label: 'Nearest to me' },
        { key: 'delivery', label: 'Delivery available' },
        { key: 'viewed', label: 'Most viewed' }
      ], s.sortBy, 'sort'));
    }

    if (s.jobSortOpen) {
      out += U.sheet('closeJobSort', U.sortRows([
        { key: 'newest', label: 'Newest first' },
        { key: 'pay', label: 'Pay: low to high' },
        { key: 'payDesc', label: 'Pay: high to low' },
        { key: 'viewed', label: 'Most viewed' }
      ], s.jobSortBy, 'jobSort'));
    }

    if (s.wantedSortOpen) {
      out += U.sheet('closeWantedSort', U.sortRows([
        { key: 'newest', label: 'Newest first' },
        { key: 'budget', label: 'Budget: low to high' },
        { key: 'budgetDesc', label: 'Budget: high to low' },
        { key: 'offers', label: 'Most offers' },
        { key: 'fewOffers', label: 'Fewest offers' }
      ], s.wantedSortBy, 'wantedSort'));
    }

    if (s.wantedGateOpen) {
      out += '<div ' + act('closeWantedGate') + ' style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(23,35,29,0.42); display: flex; align-items: center; justify-content: center; z-index: 25; cursor: pointer; padding: 30px;">'
        + '<div ' + act('stop') + ' style="width: 100%; background: #FFFFFF; border-radius: 18px; padding: 26px 22px; box-shadow: 0 20px 40px -14px rgba(23,35,29,0.45); display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center;">'
        + '<div style="width: 52px; height: 52px; border-radius: 50%; background: #FBF0DC; display: flex; align-items: center; justify-content: center; font-size: 22px;">🔒</div>'
        + '<div style="font-size: 17px; font-weight: 800; color: #16233A;">Create a free account to reply</div>'
        + '<div style="font-size: 13px; color: #7C8697; line-height: 1.5;">Sign up to see who\'s asking and message them directly — takes under a minute.</div>'
        + '<div ' + act('openLogin') + ' style="width: 100%; background: #0E3F80; color: #FFFFFF; border-radius: 12px; padding: 13px 0; text-align: center; font-size: 14.5px; font-weight: 700; cursor: pointer;">Sign up free</div>'
        + '<div ' + act('openLogin') + ' style="font-size: 12.5px; font-weight: 700; color: #0E3F80; cursor: pointer;">I already have an account</div></div></div>';
    }

    if (s.aiAssistOpen) {
      out += '<div ' + act('closeAiAssist') + ' style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(23,35,29,0.42); display: flex; align-items: flex-end; z-index: 25; cursor: pointer;">'
        + '<div ' + act('stop') + ' style="width: 100%; background: #FFFFFF; border-radius: 22px 22px 0 0; padding: 22px 20px 30px; box-shadow: 0 -10px 40px rgba(23,35,29,0.18); display: flex; flex-direction: column; gap: 14px;">'
        + '<div style="width: 36px; height: 4px; border-radius: 3px; background: #E4E1D3; margin: 0 auto;"></div>'
        + '<div style="display: flex; align-items: center; gap: 10px;">'
        + '<div style="width: 36px; height: 36px; border-radius: 10px; background: #0E3F80; display: flex; align-items: center; justify-content: center; font-size: 16px;">✨</div>'
        + '<div style="font-size: 16px; font-weight: 800; color: #16233A;">AI listing assist</div></div>'
        + '<div style="font-size: 13.5px; color: #4A5A52; line-height: 1.5;">Take or upload a photo of your item — AI suggests a title, category, condition and fair price based on similar Montserrat listings. You review and edit before posting.</div>'
        + '<div style="border: 1.5px dashed #C6CDD9; border-radius: 14px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 8px;">'
        + '<div style="font-size: 24px; color: #0E3F80;">📷</div>'
        + '<div style="font-size: 13px; font-weight: 700; color: #16233A;">Take a photo</div>'
        + '<div style="font-size: 11.5px; color: #8B94A3;">or choose from your library</div></div>'
        + '<div ' + act('closeAiAssist') + ' style="background: #0E3F80; color: #FFFFFF; border-radius: 13px; padding: 14px 0; text-align: center; font-size: 15px; font-weight: 700; cursor: pointer;">Continue</div></div></div>';
    }

    return out;
  };
})(window);
