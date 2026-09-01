/* Emerald Marketplace — demo data.
   Every list the prototype renders lives here so a real backend can replace
   this one file later. No network calls, no persistence: this is a demo. */

(function (global) {
  'use strict';

  // Unsplash URL builder. Photos are remote; each usage pairs the URL with a
  // fallback colour (see ui.bg) so a blocked/failed image degrades to a tinted
  // block rather than an empty white box.
  function u(id, w, h) {
    return 'https://images.unsplash.com/photo-' + id + '?w=' + w + '&h=' + h + '&fit=crop&auto=format';
  }

  var IMG = {
    vehicle:      u('1519641471654-76ce0107ad1b', 400, 300),
    vehicleBig:   u('1519641471654-76ce0107ad1b', 800, 600),
    vehicleWide:  u('1519641471654-76ce0107ad1b', 800, 560),
    vehicleCard:  u('1519641471654-76ce0107ad1b', 500, 350),
    vehicleThumb: u('1519641471654-76ce0107ad1b', 200, 200),
    car1:         u('1506794778202-cad84cf45f1d', 800, 600),
    car2:         u('1547038577-da80abbc4f19', 800, 600),
    car3:         u('1533473359331-0135ef1b58bf', 800, 600),
    car1Thumb:    u('1506794778202-cad84cf45f1d', 200, 200),
    car2Thumb:    u('1547038577-da80abbc4f19', 200, 200),
    car3Thumb:    u('1533473359331-0135ef1b58bf', 200, 200),
    home:         u('1555041469-a586c61ea9bc', 400, 300),
    mango:        u('1553279768-865429fa0078', 400, 300),
    mangoCard:    u('1553279768-865429fa0078', 500, 350),
    mangoSquare:  u('1553279768-865429fa0078', 300, 300),
    bed:          u('1586105251261-72a756497a11', 400, 300),
    bedCard:      u('1586105251261-72a756497a11', 500, 350),
    diningTable:  u('1617806118233-18e1de247200', 400, 300),
    diningCard:   u('1617806118233-18e1de247200', 500, 350),
    generator:    u('1558618666-fcd25c85cd64', 400, 300),
    carParts:     u('1449965408869-eaa3f722e40d', 300, 200),
    grocery:      u('1509440159596-0249088772ff', 120, 120),
    groceryTall:  u('1509440159596-0249088772ff', 200, 260),
    cafe:         u('1495474472287-4d71bcdd2085', 120, 120),
    cafeTall:     u('1495474472287-4d71bcdd2085', 200, 260),
    bank:         u('1495474472287-4d71bcdd2085', 800, 300),
    momentos:     u('1610701596007-11502861dcfa', 120, 120),
    momentosWide: u('1610701596007-11502861dcfa', 800, 500),
    momentosHero: u('1610701596007-11502861dcfa', 1200, 500),
    momentosMark: u('1610701596007-11502861dcfa', 160, 160),
    jcouture:     u('1590874103328-eac38a683ce7', 120, 120),
    amelda:       u('1587049352846-4a222e784d38', 120, 120),
    liburd:       u('1544816155-12df9643f363', 120, 120),
    realty:       u('1568084680786-a84f91d1153c', 120, 120),
    realtyWide:   u('1568084680786-a84f91d1153c', 800, 500),
    realtyCard:   u('1568084680786-a84f91d1153c', 300, 300),
    realtyBig:    u('1568084680786-a84f91d1153c', 500, 350),
    villa:        u('1568605114967-8130f3a36994', 300, 300),
    apartment:    u('1600585154340-be6161a56a0c', 300, 300),
    lot:          u('1570129477492-45c003edd2be', 300, 300),
    necklace:     u('1611652022419-a9419f74343d', 300, 300),
    necklaceBig:  u('1611652022419-a9419f74343d', 400, 400),
    cards:        u('1600857062241-98e5dba7f214', 300, 300),
    cardsBig:     u('1600857062241-98e5dba7f214', 400, 400),
    basket:       u('1513519245088-0e12902e5a38', 300, 300),
    basketBig:    u('1513519245088-0e12902e5a38', 400, 400),
    hotelTropical:      u('1571896349842-33c89424de2d', 300, 300),
    hotelTropicalCard:  u('1602343168117-bb8ffe3e2e9f', 500, 350),
    hotelTropicalBig:   u('1571896349842-33c89424de2d', 500, 350),
    hotelCottage:       u('1602343168117-bb8ffe3e2e9f', 300, 300),
    hotelCottageBig:    u('1602343168117-bb8ffe3e2e9f', 500, 350),
    hotelVilla:         u('1613490493576-7fde63acd811', 500, 350),
    tourHeli:     u('1608889825205-eebdb9fc5806', 300, 300),
    tourHeliBig:  u('1608889825205-eebdb9fc5806', 500, 350),
    tourBoat:     u('1544551763-8dd44758c2dd', 300, 300),
    tourBoatBig:  u('1544551763-8dd44758c2dd', 500, 350),
    tourIsland:   u('1519681393784-d120267933ba', 500, 350),
    wantedWasher: u('1626806787461-102c1bfaaea1', 800, 600),
    loginHero:    u('1590523278191-995cbcda646b', 700, 900)
  };

  // Fallback tints, keyed loosely by subject, used behind every photo.
  var TINT = {
    vehicle: '#C9CFD6', home: '#DED8C9', produce: '#D8DEC4', bed: '#DED6CB',
    shop: '#DED8C9', craft: '#E0D6CC', hotel: '#CFD9DC', tour: '#C6D3D8',
    realty: '#D5DBE3', neutral: '#E0DAC9', dark: '#123763'
  };

  /* ---------- Listings (Browse › Listings, desktop grid, search) ---------- */

  var LISTINGS = [
    {
      id: 'landcruiser', cat: 'vehicles', catLabel: 'VEHICLES', catColor: '#A8483A',
      img: IMG.vehicle, tint: TINT.vehicle, sponsored: true,
      price: 'EC$68,500', priceNum: 68500, title: 'Toyota Land Cruiser, 2018',
      seller: 'Courtney W.', location: 'Look Out', timeAgo: '1h', hoursAgo: 1,
      views: 41, delivery: false,
      badgeText: 'PICKUP ONLY', badgeBg: '#FBF0DC', badgeColor: '#8A5B0E'
    },
    {
      id: 'diningtable', cat: 'home', catLabel: 'HOME & GARDEN', catColor: '#0E3F80',
      img: IMG.home, tint: TINT.home,
      price: 'EC$2,200', priceNum: 2200, title: 'Dining table & 6 chairs',
      seller: 'Merle J.', location: 'Brades', timeAgo: '1d', hoursAgo: 24,
      views: 96, delivery: false,
      badgeText: 'PICKUP ONLY', badgeBg: '#FBF0DC', badgeColor: '#8A5B0E',
      urgency: 'MOVING SALE'
    },
    {
      id: 'mango', cat: 'farm', catLabel: 'FARM & PRODUCE', catColor: '#2E7F8C',
      img: IMG.mango, tint: TINT.produce,
      price: 'EC$25', priceNum: 25, title: 'Fresh mango crate',
      seller: 'Kenrick B.', location: 'Cudjoe Head', timeAgo: '5h', hoursAgo: 5,
      views: 18, delivery: true,
      badgeText: 'DELIVERY AVAIL.', badgeBg: '#E4EDF9', badgeColor: '#0E3F80'
    },
    {
      id: 'bedset', cat: 'home', catLabel: 'HOME & GARDEN', catColor: '#0E3F80',
      img: IMG.bed, tint: TINT.bed,
      price: 'EC$3,800', priceNum: 3800, title: 'King bed set, solid wood',
      seller: 'Alvira R.', location: 'Salem', timeAgo: '3d', hoursAgo: 72,
      views: 112, delivery: true,
      badgeText: 'DELIVERY AVAIL.', badgeBg: '#E4EDF9', badgeColor: '#0E3F80'
    },
    {
      id: 'room', cat: 'rentals', catLabel: 'REAL ESTATE', catColor: '#5B6FBA',
      img: IMG.bed, tint: TINT.bed, tag: 'FOR RENT',
      price: 'EC$1,500/mo', priceNum: 1500, title: 'Private room, Salem',
      seller: 'Marcus T.', location: 'Salem', timeAgo: '12h', hoursAgo: 12,
      views: 63, delivery: false
    },
    {
      id: 'yaris', cat: 'rentals', catLabel: 'REAL ESTATE', catColor: '#5B6FBA',
      img: IMG.vehicle, tint: TINT.vehicle, tag: 'FOR HIRE',
      price: 'EC$180/day', priceNum: 180, title: 'Toyota Yaris — car hire',
      seller: 'Janice R.', location: 'Brades', timeAgo: '2d', hoursAgo: 48,
      views: 29, delivery: false
    }
  ];

  /* ---------- Wanted board ---------- */

  var WANTED = [
    {
      id: 'wm', icon: '🧊', title: 'Washing machine, working',
      catLabel: 'EQUIPMENT', cat: 'equipment',
      budgetLabel: 'Up to EC$600', budget: 600,
      location: "St. Peter's", timeAgo: '1h', hoursAgo: 1,
      views: 52, offers: 3, gated: false, screen: 'wantedDetail'
    },
    {
      id: 'yard', icon: '🌿', title: 'Someone to cut a yard, Salem',
      catLabel: 'SERVICES', cat: 'services',
      budgetLabel: 'Cash', budget: 0,
      location: 'Salem', timeAgo: 'yesterday', hoursAgo: 24,
      views: 19, offers: 1, gated: true, screen: 'yardDetail'
    },
    {
      id: 'plantain', icon: '🍌', title: 'Ripe plantain, a dozen',
      catLabel: 'FOOD', cat: 'food',
      budgetLabel: null, budget: 0,
      location: 'Brades', timeAgo: '4h', hoursAgo: 4,
      views: 28, offers: 0, gated: true, screen: null
    },
    {
      id: 'caterer', icon: '🍽️', title: 'Caterer for 40th birthday, Salem',
      catLabel: 'SERVICES', cat: 'services',
      budgetLabel: 'Up to EC$1,200', budget: 1200,
      location: 'Salem', timeAgo: '3h', hoursAgo: 3,
      views: 37, offers: 2, gated: true, screen: null
    }
  ];

  /* ---------- Jobs ---------- */

  var JOBS = [
    {
      id: 'cashier', icon: '🛒', title: 'Cashier, part-time', typeLabel: 'PART-TIME',
      cat: 'retail', payLabel: 'EC$18/hr', pay: 18,
      employer: "Ram's Supermarket", location: 'Salem', views: 34, applied: 5
    },
    {
      id: 'landscape', icon: '🌿', title: 'Landscaper / groundskeeper', typeLabel: 'CASUAL',
      cat: 'trades', payLabel: 'Negotiable', pay: 0,
      employer: 'Olveston House', location: 'Olveston', views: 12, applied: 1
    },
    {
      id: 'driver', icon: '🚚', title: 'Delivery driver', typeLabel: 'FULL-TIME',
      cat: 'delivery', payLabel: 'EC$20/hr', pay: 20,
      employer: 'Emerald Marketplace', location: 'island-wide', views: 41, applied: 8
    }
  ];

  /* ---------- Shops ---------- */
  // `pattern` replaces `img` where the prototype used a woven-stripe block.

  var SHOP_SECTIONS = [
    {
      heading: 'MADE IN MONTSERRAT · PRIME',
      shops: [
        { id: 'momentos', name: 'Island Momentos', meta: 'Little Bay · crafts, souvenirs, jewelry', cat: 'prime', img: IMG.momentos, tint: TINT.craft, status: 'OPEN', screen: 'shopDetail' },
        { id: 'jcouture', name: "J'Couture", meta: 'Salem · crocheted designer bags', cat: 'prime', img: IMG.jcouture, tint: TINT.craft, status: 'OPEN' },
        { id: 'amelda', name: "Amelda's Crafts & Confectioneries", meta: 'Brades · baked goods, handmade crafts', cat: 'prime', img: IMG.amelda, tint: TINT.craft, status: 'OPEN' },
        { id: 'liburd', name: "Liburd's Unique Gift Shop", meta: 'Brades · gifts, cards, novelties', cat: 'prime', img: IMG.liburd, tint: TINT.craft, status: 'OPEN' }
      ]
    },
    {
      heading: 'SUPERMARKETS & SHOPS',
      shops: [
        { id: 'rams', name: "Ram's Supermarket", meta: 'Salem · grocery, wines, snacks', cat: 'grocery', img: IMG.grocery, tint: TINT.shop, status: 'OPEN', delivers: true, screen: 'collect' },
        { id: 'ashoks', name: "Ashok's Supermarket", meta: 'Brades · local veg, ground provisions', cat: 'grocery', img: IMG.grocery, tint: TINT.shop, status: 'OPEN' },
        { id: 'victors', name: "Victor's Supermarket", meta: 'Davy Hill · local, Caribbean, international', cat: 'grocery', img: IMG.grocery, tint: TINT.shop, status: 'OPEN', delivers: true },
        { id: 'umpire', name: 'The Umpire', meta: 'Brades · American imports, frozen, desserts', cat: 'grocery', img: IMG.cafe, tint: TINT.shop, status: 'OPEN' },
        { id: 'hilltop', name: 'Hilltop Coffee House', meta: "St Peter's · coffee, cinnamon rolls, pastries", cat: 'eats', img: IMG.cafe, tint: TINT.shop, status: '8AM', statusStyle: 'closed' },
        { id: 'aravins', name: 'Aravins Enterprises', meta: "St. John's · wholesale & retail, cheeses, wines", cat: 'grocery', img: IMG.cafe, tint: TINT.shop, status: '8AM', statusStyle: 'closed' },
        { id: 'osborne', name: 'M.S. Osborne Ltd', meta: 'Brades · hardware, building materials, appliances', cat: 'hardware', pattern: 'repeating-linear-gradient(135deg, #E0DAC9 0 7px, #D6CFBB 7px 14px)', status: 'OPEN' },
        { id: 'bbc', name: 'BBC Radio & TV Ltd', meta: 'Brades Main Road · electronics, appliances', cat: 'hardware', pattern: 'repeating-linear-gradient(135deg, #D6DEE0 0 7px, #CCD5D8 7px 14px)', status: 'OPEN' },
        { id: 'esg', name: 'ESG Variety Ltd.', meta: 'Brades · variety, household goods, snacks', cat: 'grocery', pattern: 'repeating-linear-gradient(135deg, #E4DCD0 0 7px, #DAD1C2 7px 14px)', status: 'OPEN' }
      ]
    },
    {
      heading: 'REAL ESTATE',
      // Always visible: the realty agency is not filtered by the shop-type chips.
      always: true,
      shops: [
        { id: 'realty', name: 'Montserrat Realty Co.', meta: 'Brades · homes for sale & rent', cat: 'realty', img: IMG.realty, tint: TINT.realty, status: 'OPEN', screen: 'realtyDetail' }
      ]
    }
  ];

  /* ---------- Travel ---------- */

  var AIRLINES = [
    { id: 'flymni', short: 'FLY<br/>MNI', shortDesk: 'FLY', name: 'Fly MNI', deskName: 'Fly Montserrat', route: 'Antigua ↔ MNI, daily', bg: '#E7F2EB', color: '#13944B' },
    { id: 'winair', short: 'WM', shortDesk: 'WM', name: 'Winair', deskName: 'Winair', route: 'St. Maarten ↔ MNI', bg: '#E4EDF9', color: '#0057B8' },
    { id: 'svg', short: 'SVG', shortDesk: 'SVG', name: 'SVG Air', deskName: 'SVG Air', route: 'Antigua ↔ MNI', bg: '#FBF0DC', color: '#8A5B0E' }
  ];

  var HOTELS = [
    { id: 'tropical', name: 'Tropical Mansion Suites', meta: 'Sweeneys · pool, on-site restaurant', deskMeta: 'Sweeneys · pool, restaurant', price: 'from EC$380', unit: '/night', img: IMG.hotelTropical, imgBig: IMG.hotelTropicalBig, tint: TINT.hotel },
    { id: 'olveston', name: 'Olveston House', meta: 'Olveston · 6 rooms, restaurant & bar', price: 'from EC$310', unit: '/night', img: IMG.realtyCard, imgBig: IMG.realtyBig, tint: TINT.realty },
    { id: 'gingerbread', name: 'Gingerbread Hill', meta: 'Jacks Bay · self-catering cottages', price: 'from EC$240', unit: '/night', img: IMG.hotelCottage, imgBig: IMG.hotelCottageBig, tint: TINT.hotel },
    { id: 'chezmango', name: 'Chez Mango Villas', meta: 'Old Towne · pool, ocean views', deskMeta: 'Olveston · private villas, pool', price: 'from EC$410', deskPrice: 'from EC$420', unit: '/night', img: IMG.hotelCottage, imgBig: IMG.hotelVilla, tint: TINT.hotel }
  ];

  var TOURS = [
    { id: 'heli', name: "Calvin's Helicopter Tours", meta: 'Volcano flyover · 20 min · up to 3 people', price: 'from EC$450', unit: '/person', img: IMG.tourHeli, imgBig: IMG.tourHeliBig, tint: TINT.tour },
    { id: 'boat', name: 'Island Boat Tours', meta: 'Exclusion zone coastal tour · half day', price: 'from EC$180', unit: '/person', img: IMG.tourBoat, imgBig: IMG.tourBoatBig, tint: TINT.tour },
    { id: 'islandtour', name: 'Montserrat Island Tours', meta: 'Volcano observatory & Plymouth · guided', price: 'from EC$140', unit: '/person', img: IMG.tourIsland, imgBig: IMG.tourIsland, tint: TINT.tour, deskOnly: true }
  ];

  /* ---------- Cart ---------- */

  var CART_ITEMS = {
    rams: {
      key: 'rams', seller: "Ram's Supermarket", sellerBadge: 'DELIVERY AVAIL',
      sellerBadgeBg: '#E4EDF9', sellerBadgeColor: '#0E3F80',
      title: 'Bread, whole wheat loaf', meta: "700g · sliced · sold by Ram's Supermarket",
      unitPrice: 14, img: IMG.groceryTall, thumb: IMG.grocery, tint: TINT.shop,
      payNote: 'Pay by card or cash on delivery'
    },
    hilltop: {
      key: 'hilltop', seller: 'Hilltop Coffee House', sellerBadge: 'PICKUP ONLY',
      sellerBadgeBg: '#F4F2EC', sellerBadgeColor: '#3A4553',
      title: 'Cinnamon rolls (box of 4)', meta: 'Baked fresh daily · sold by Hilltop Coffee House',
      unitPrice: 50, img: IMG.cafeTall, thumb: IMG.cafe, tint: TINT.shop,
      payNote: 'Cash only, pay at pickup'
    }
  };

  /* ---------- Inbox ---------- */

  var THREADS = [
    { id: 'denroy', name: 'Denroy A.', time: '9:12', preview: 'Offered EC$1,650 — generator', unread: true, avatar: '#E6E1D4,#DED8C9', open: true },
    { id: 'rams', name: "Ram's, Salem", time: '8:40', preview: 'Your order is bagged, cash on pickup', avatar: '#DEE4D6,#D5DCCB' },
    { id: 'alvira', name: 'Alvira R.', time: 'Yesterday', preview: 'Wanted: washing machine — still looking?', avatar: '#D9E4E6,#CFDBDE' }
  ];

  var NOTIFICATIONS = [
    { dot: '#0E3F80', title: 'Denroy accepted your offer', body: 'EC$1,650 · pickup at Brades til 6pm' },
    { dot: '#F0B454', title: "Someone wants what you're selling", body: 'Wanted ad matches your breadfruit listing' },
    { dot: '#C6CDD9', title: "Ram's order is bagged", body: 'Cash on pickup · Salem counter' }
  ];

  /* ---------- Filter chip definitions ---------- */

  var CATS = [
    { key: '', label: 'All' },
    { key: 'vehicles', label: 'Vehicles' },
    { key: 'home', label: 'Home &amp; Garden' },
    { key: 'rentals', label: 'Real Estate' },
    { key: 'farm', label: 'Farm &amp; Produce' },
    { key: 'tools', label: 'Tools &amp; Power' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'services', label: 'Services' }
  ];

  var VEHICLE_SUBS = [
    { key: 'cars', label: 'Cars' },
    { key: 'trucks', label: 'Trucks &amp; SUVs' },
    { key: 'motorcycles', label: 'Motorcycles' },
    { key: 'boats', label: 'Boats' },
    { key: 'parts', label: 'Parts &amp; Accessories' }
  ];

  var SHOP_CATS = [
    { key: 'all', label: 'All' }, { key: 'prime', label: 'PRIME' },
    { key: 'grocery', label: 'Grocery' }, { key: 'eats', label: 'Eats' },
    { key: 'bakery', label: 'Bakery' }, { key: 'hardware', label: 'Hardware' },
    { key: 'pharmacy', label: 'Pharmacy' }
  ];

  var JOB_CATS = [
    { key: 'all', label: 'All' }, { key: 'retail', label: 'Retail' },
    { key: 'trades', label: 'Trades &amp; labor' }, { key: 'hospitality', label: 'Hospitality' },
    { key: 'delivery', label: 'Delivery' }
  ];

  var WANTED_CATS = [
    { key: 'all', label: 'All' }, { key: 'goods', label: 'Goods' },
    { key: 'equipment', label: 'Equipment' }, { key: 'vehicles', label: 'Vehicles' },
    { key: 'housing', label: 'Housing' }, { key: 'services', label: 'Services' },
    { key: 'food', label: 'Food' }, { key: 'other', label: 'Other' }
  ];

  // Desktop sidebar counts are illustrative demo figures, as in the prototype.
  var DESK_CAT_COUNTS = {
    '': 412, vehicles: 88, home: 104, rentals: 57,
    farm: 61, tools: 39, electronics: 33, services: 30
  };
  var DESK_WANTED_COUNTS = { all: 14, goods: 6, services: 4, food: 2, equipment: 1, other: 1 };
  var DESK_JOB_COUNTS = { all: 3, retail: 1, trades: 1, hospitality: 0, delivery: 1 };
  var DESK_SHOP_COUNTS = { all: 24, prime: 4, grocery: 9, eats: 6, bakery: 3, hardware: 4, pharmacy: 2 };

  /* ---------- Derived helpers ---------- */

  var SORTERS = {
    newest: function (a, b) { return a.hoursAgo - b.hoursAgo; },
    price: function (a, b) { return a.priceNum - b.priceNum; },
    priceDesc: function (a, b) { return b.priceNum - a.priceNum; },
    viewed: function (a, b) { return b.views - a.views; },
    delivery: function (a, b) { return (b.delivery ? 1 : 0) - (a.delivery ? 1 : 0); },
    near: function (a, b) { return a.hoursAgo - b.hoursAgo; }
  };

  function sortedListings(cats, sortBy) {
    var items = LISTINGS.slice();
    if (Array.isArray(cats) && cats.length) {
      items = items.filter(function (i) { return cats.indexOf(i.cat) !== -1; });
    }
    return items.sort(SORTERS[sortBy] || SORTERS.newest);
  }

  function searchListings(q) {
    if (!q || !q.trim()) return [];
    var needle = q.trim().toLowerCase();
    return LISTINGS.filter(function (i) {
      return i.title.toLowerCase().indexOf(needle) !== -1
        || i.catLabel.toLowerCase().indexOf(needle) !== -1
        || i.location.toLowerCase().indexOf(needle) !== -1;
    });
  }

  function wantedItems(cat, sortBy) {
    var list = (!cat || cat === 'all') ? WANTED.slice() : WANTED.filter(function (i) { return i.cat === cat; });
    if (sortBy === 'budget') list.sort(function (a, b) { return a.budget - b.budget; });
    else if (sortBy === 'budgetDesc') list.sort(function (a, b) { return b.budget - a.budget; });
    else if (sortBy === 'offers') list.sort(function (a, b) { return b.offers - a.offers; });
    else if (sortBy === 'fewOffers') list.sort(function (a, b) { return a.offers - b.offers; });
    else list.sort(function (a, b) { return a.hoursAgo - b.hoursAgo; });
    return list;
  }

  function jobItems(cat, sortBy) {
    var list = (!cat || cat === 'all') ? JOBS.slice() : JOBS.filter(function (i) { return i.cat === cat; });
    if (sortBy === 'pay') list.sort(function (a, b) { return a.pay - b.pay; });
    else if (sortBy === 'payDesc') list.sort(function (a, b) { return b.pay - a.pay; });
    else if (sortBy === 'viewed') list.sort(function (a, b) { return b.views - a.views; });
    return list;
  }

  function shopVisible(shopCat, shop) {
    return !shopCat || shopCat === 'all' || shopCat === shop.cat;
  }

  global.EMData = {
    IMG: IMG, TINT: TINT,
    LISTINGS: LISTINGS, WANTED: WANTED, JOBS: JOBS,
    SHOP_SECTIONS: SHOP_SECTIONS, AIRLINES: AIRLINES, HOTELS: HOTELS, TOURS: TOURS,
    CART_ITEMS: CART_ITEMS, THREADS: THREADS, NOTIFICATIONS: NOTIFICATIONS,
    CATS: CATS, VEHICLE_SUBS: VEHICLE_SUBS, SHOP_CATS: SHOP_CATS,
    JOB_CATS: JOB_CATS, WANTED_CATS: WANTED_CATS,
    DESK_CAT_COUNTS: DESK_CAT_COUNTS, DESK_WANTED_COUNTS: DESK_WANTED_COUNTS,
    DESK_JOB_COUNTS: DESK_JOB_COUNTS, DESK_SHOP_COUNTS: DESK_SHOP_COUNTS,
    sortedListings: sortedListings, searchListings: searchListings,
    wantedItems: wantedItems, jobItems: jobItems, shopVisible: shopVisible
  };
})(window);
