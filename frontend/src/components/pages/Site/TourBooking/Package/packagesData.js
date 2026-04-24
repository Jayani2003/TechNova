// ─────────────────────────────────────────────────────────────
//  PACKAGES DATA STORE
//  To add a new package: push a new object into the array below.
//  To add a new TYPE:    add a new string to PACKAGE_TYPES.
//  To add a new DAY option: add a number to PACKAGE_DAYS.
//  Filters are auto-generated from the data — no UI changes needed.
// ─────────────────────────────────────────────────────────────

export const PACKAGE_TYPES = [
  'Beach Side',
  'Hill Country',
  'Safari',
  'Cultural Heritage',
  'Adventure',
  'Wellness & Ayurveda',
];

export const PACKAGE_DAYS = [7, 14, 21, 28];

const STORAGE_KEY = 'sl_admin_packages';

const loadPackages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : packages;
  } catch {
    return packages;
  }
};

export const packages = [

  // ── BEACH SIDE ─────────────────────────────────────────────
  {
    id: 'bs-7-1',
    type: 'Beach Side',
    days: 7,
    title: 'Golden Coast Escape',
    description: 'Sun-soaked shores, turquoise waters and fresh seafood on Sri Lanka\'s stunning southern coastline.',
    image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&q=80&w=800',
    highlights: ['Snorkeling', 'Sunset cruises', 'Fresh seafood', 'Beach yoga'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival & city orientation. Explore Galle Face Green and the vibrant Pettah market.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Bentota', days: 2, description: 'Sri Lanka\'s premier beach resort town. Water sports, river safari and pristine golden beaches.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600' },
      { name: 'Mirissa', days: 2, description: 'Laid-back beach paradise famous for whale watching and the iconic Palm Tree Hill viewpoint.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600' },
      { name: 'Galle', days: 2, description: 'UNESCO World Heritage fort town blending colonial history with boutique cafes and art galleries.', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'bs-7-2',
    type: 'Beach Side',
    days: 7,
    title: 'East Coast Serenity',
    description: 'Discover the untouched east coast beaches of Trincomalee and Arugam Bay, away from the crowds.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    highlights: ['Surfing', 'Whale watching', 'Diving', 'Temple visits'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival, transfer and overnight rest.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Trincomalee', days: 3, description: 'Natural harbour with coral reefs, Pigeon Island and the famous Koneswaram Temple on a clifftop.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600' },
      { name: 'Arugam Bay', days: 3, description: 'World-renowned surf point with a relaxed vibe, leopard safaris nearby and stunning lagoon sunsets.', image: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'bs-14-1',
    type: 'Beach Side',
    days: 14,
    title: 'Island Shores Explorer',
    description: 'A comprehensive tour of Sri Lanka\'s finest beaches from the south to the east coast.',
    image: 'https://images.unsplash.com/photo-1559628233-100c798642cf?auto=format&fit=crop&q=80&w=800',
    highlights: ['Whale watching', 'Diving', 'Snorkeling', 'Beach hopping'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival and city tour.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Bentota', days: 2, description: 'Beach resort and river safari experience.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600' },
      { name: 'Galle', days: 2, description: 'Dutch fort, lighthouse and local art scene.', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600' },
      { name: 'Mirissa', days: 2, description: 'Whale watching season and beach relaxation.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600' },
      { name: 'Tangalle', days: 2, description: 'Secluded beaches and turtle nesting grounds.', image: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&q=80&w=600' },
      { name: 'Trincomalee', days: 3, description: 'Natural harbour, Pigeon Island snorkeling.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600' },
      { name: 'Arugam Bay', days: 2, description: 'World-class surfing and lagoon sunsets.', image: 'https://images.unsplash.com/photo-1559628233-100c798642cf?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'bs-21-1',
    type: 'Beach Side',
    days: 21,
    title: 'Complete Coastal Journey',
    description: 'The ultimate beach odyssey circling the entire island coastline with handpicked stops at every gem.',
    image: 'https://images.unsplash.com/photo-1527073620320-77635188c627?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    highlights: ['Full island loop', 'Deep sea fishing', 'Coral reef diving', 'Luxury beach stays'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival and city introduction.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Negombo', days: 2, description: 'Lagoon fishing village and colonial Dutch canals.', image: 'https://images.unsplash.com/photo-1559628233-100c798642cf?auto=format&fit=crop&q=80&w=600' },
      { name: 'Bentota', days: 3, description: 'Water sports capital of Sri Lanka.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600' },
      { name: 'Galle', days: 2, description: 'UNESCO fort and boutique experiences.', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600' },
      { name: 'Mirissa', days: 3, description: 'Whale watching and beach bliss.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600' },
      { name: 'Tangalle', days: 2, description: 'Turtle nesting beaches and lagoons.', image: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&q=80&w=600' },
      { name: 'Trincomalee', days: 3, description: 'Pigeon Island and harbour diving.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600' },
      { name: 'Arugam Bay', days: 3, description: 'Surf, leopard trails and lagoon sunsets.', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Passekudah', days: 2, description: 'Calm shallow bay perfect for swimming and water sports.', image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&q=80&w=600' },
    ],
  },

  // ── HILL COUNTRY ───────────────────────────────────────────
  {
    id: 'hc-7-1',
    type: 'Hill Country',
    days: 7,
    title: 'Misty Mountains Retreat',
    description: 'Rolling tea plantations, misty peaks and colonial hill stations in the heart of the island.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['Tea factory tours', 'Train journey', 'Waterfall hikes', 'Colonial architecture'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival and transfer to the highlands.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kandy', days: 2, description: 'Sacred Temple of the Tooth Relic, Kandy Lake and traditional Kandyan dance performances.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
      { name: 'Nuwara Eliya', days: 2, description: 'Little England of Sri Lanka — tea estates, rose gardens and a scenic train ride through the mountains.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Ella', days: 2, description: 'Nine Arch Bridge, Little Adam\'s Peak hike and the most scenic rail journey in Asia.', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'hc-7-2',
    type: 'Hill Country',
    days: 7,
    title: 'Tea Trail Classic',
    description: 'An intimate journey through Ceylon\'s finest tea estates with exclusive planter bungalow stays.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['Planter bungalow stays', 'Tea tasting', 'Estate walks', 'Sunrise hikes'],
    destinations: [
      { name: 'Kandy', days: 2, description: 'Cultural capital and gateway to the hill country.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
      { name: 'Hatton', days: 2, description: 'Adam\'s Peak pilgrimage and vast tea estate landscapes.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Nuwara Eliya', days: 3, description: 'Tea factory visits, colonial club houses and Gregory Lake boating.', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'hc-14-1',
    type: 'Hill Country',
    days: 14,
    title: 'Highlands & Heritage',
    description: 'From ancient rock fortresses to misty tea valleys — a full exploration of Sri Lanka\'s interior.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['Sigiriya Rock', 'Tea estates', 'Scenic train', 'Ancient temples'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival and city tour.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Sigiriya', days: 2, description: '5th century rock fortress rising 200m above the jungle plains.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kandy', days: 3, description: 'Temple of the Tooth, royal botanical gardens and cultural shows.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
      { name: 'Nuwara Eliya', days: 3, description: 'Tea country heart — factory tours, waterfalls and colonial charm.', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
      { name: 'Ella', days: 3, description: 'Hiking, Nine Arch Bridge and the world\'s most scenic train.', image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&q=80&w=600' },
      { name: 'Horton Plains', days: 2, description: 'World\'s End cliff edge and Baker\'s Falls in cloud forest.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'hc-21-1',
    type: 'Hill Country',
    days: 21,
    title: 'Grand Hill Country Circuit',
    description: 'The definitive highlands experience combining cultural triangle, tea country and southern coast.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['Full cultural triangle', 'All tea regions', 'Scenic train', 'Ayurveda retreat'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Anuradhapura', days: 2, description: 'Ancient capital with sacred Sri Maha Bodhi tree.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Sigiriya', days: 2, description: 'Lion Rock fortress and Dambulla cave temples.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kandy', days: 3, description: 'Temple of the Tooth and Peradeniya Gardens.', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
      { name: 'Hatton', days: 2, description: 'Adam\'s Peak sunrise climb.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Nuwara Eliya', days: 3, description: 'Tea estates and colonial hill station.', image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&q=80&w=600' },
      { name: 'Ella', days: 3, description: 'Nine Arch Bridge and hiking trails.', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Horton Plains', days: 2, description: 'World\'s End and cloud forest walks.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Colombo', days: 3, description: 'Departure city exploration.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
    ],
  },

  // ── SAFARI ─────────────────────────────────────────────────
  {
    id: 'sf-7-1',
    type: 'Safari',
    days: 7,
    title: 'Wild Sri Lanka',
    description: 'Track leopards, elephants and blue whales on this action-packed wildlife adventure.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['Leopard spotting', 'Elephant gathering', 'Bird watching', 'Jeep safaris'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival and transfer.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Yala National Park', days: 3, description: 'World\'s highest density of leopards plus elephants, sloth bears and crocs. Dawn and dusk jeep safaris.', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600' },
      { name: 'Udawalawe', days: 2, description: 'Best park for elephant herds — guaranteed sightings at the elephant transit home.', image: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?auto=format&fit=crop&q=80&w=600' },
      { name: 'Mirissa', days: 1, description: 'Blue whale watching — largest creature on Earth.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'sf-7-2',
    type: 'Safari',
    days: 7,
    title: 'Elephant Kingdom',
    description: 'A focused elephant experience across Sri Lanka\'s finest national parks and sanctuaries.',
    image: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?auto=format&fit=crop&q=80&w=800',
    highlights: ['Minneriya gathering', 'Elephant orphanage', 'Forest lodges', 'Night safaris'],
    destinations: [
      { name: 'Pinnawala', days: 1, description: 'Elephant orphanage — feeding and bathing time.', image: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?auto=format&fit=crop&q=80&w=600' },
      { name: 'Minneriya', days: 2, description: 'The Gathering — world\'s largest elephant congregation (200–400 elephants).', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kaudulla', days: 2, description: 'Sister park to Minneriya with equally spectacular elephant herds.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Udawalawe', days: 2, description: 'Elephant transit home and full day game drives.', image: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'sf-14-1',
    type: 'Safari',
    days: 14,
    title: 'Big Five Sri Lanka',
    description: 'Track all of Sri Lanka\'s iconic wildlife including leopard, elephant, sloth bear, blue whale and crocodile.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['All major parks', 'Leopard tracking', 'Bird watching', 'Marine wildlife'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Wilpattu', days: 3, description: 'Sri Lanka\'s oldest national park — leopards amid natural lakes (villus).', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600' },
      { name: 'Minneriya', days: 2, description: 'The elephant gathering spectacle.', image: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?auto=format&fit=crop&q=80&w=600' },
      { name: 'Udawalawe', days: 2, description: 'Elephant herds and open grassland game drives.', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=600' },
      { name: 'Yala', days: 3, description: 'Leopard capital of the world.', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600' },
      { name: 'Mirissa', days: 2, description: 'Blue whale and dolphin watching at sea.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600' },
      { name: 'Colombo', days: 1, description: 'Departure.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
    ],
  },

  // ── CULTURAL HERITAGE ──────────────────────────────────────
  {
    id: 'ch-7-1',
    type: 'Cultural Heritage',
    days: 7,
    title: 'Ancient Kingdom Trail',
    description: 'Journey through 2,500 years of Sri Lankan history across the UNESCO Cultural Triangle.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['UNESCO sites', 'Ancient temples', 'Rock art', 'Royal palaces'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival and colonial architecture tour.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Anuradhapura', days: 2, description: 'First ancient capital with colossal dagobas and the sacred Bodhi tree.', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600' },
      { name: 'Polonnaruwa', days: 2, description: 'Medieval royal city with magnificent stone sculptures and royal bathing pools.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Sigiriya', days: 2, description: 'Lion Rock — 5th century sky palace with frescoes and mirror wall.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'ch-14-1',
    type: 'Cultural Heritage',
    days: 14,
    title: 'Full Cultural Triangle',
    description: 'The complete immersion into Sri Lanka\'s ancient civilisations, sacred sites and living traditions.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['6 UNESCO sites', 'Traditional crafts', 'Temple festivals', 'Cultural performances'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival, Gangaramaya Temple and National Museum.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Negombo', days: 1, description: 'Dutch colonial heritage and fishing village culture.', image: 'https://images.unsplash.com/photo-1559628233-100c798642cf?auto=format&fit=crop&q=80&w=600' },
      { name: 'Anuradhapura', days: 2, description: 'Ancient capital, Sri Maha Bodhi and Ruwanweli Seya.', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600' },
      { name: 'Mihintale', days: 1, description: 'Cradle of Buddhism in Sri Lanka — sacred mountain monastery.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Polonnaruwa', days: 2, description: 'Medieval royal capital and Gal Vihara rock temple.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
      { name: 'Sigiriya', days: 2, description: 'Lion Rock fortress and Dambulla cave temples.', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kandy', days: 3, description: 'Temple of the Tooth Relic and Kandyan cultural shows.', image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&q=80&w=600' },
      { name: 'Galle', days: 2, description: 'Dutch fort UNESCO site and colonial heritage walking tour.', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600' },
    ],
  },

  // ── ADVENTURE ──────────────────────────────────────────────
  {
    id: 'adv-7-1',
    type: 'Adventure',
    days: 7,
    title: 'Thrills of Lanka',
    description: 'White water rafting, zip-lining, rock climbing and surfing — Sri Lanka\'s best adventure in one week.',
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=800',
    highlights: ['White water rafting', 'Zip-lining', 'Rock climbing', 'Surfing'],
    destinations: [
      { name: 'Kitulgala', days: 2, description: 'White water rafting on the Kelani River — Grade 3–4 rapids through jungle gorges.', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Ella', days: 2, description: 'Rock climbing, zip-lining and the famous Little Adam\'s Peak hike.', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
      { name: 'Arugam Bay', days: 3, description: 'World-class surf point — learn to surf or ride the barrel for experienced surfers.', image: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'adv-14-1',
    type: 'Adventure',
    days: 14,
    title: 'Ultimate Adventure Circuit',
    description: 'Two weeks of non-stop action — the most thrilling experiences Sri Lanka has to offer.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    highlights: ['Rafting', 'Hiking', 'Surfing', 'Diving', 'Cycling'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kitulgala', days: 2, description: 'White water rafting and jungle trekking.', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Ella', days: 2, description: 'Mountain biking, rock climbing and zip-line.', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
      { name: 'Knuckles Range', days: 2, description: 'Multi-day trekking through UNESCO cloud forest.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Trincomalee', days: 3, description: 'Scuba diving at Pigeon Island coral reefs.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600' },
      { name: 'Arugam Bay', days: 4, description: 'Surfing, kite surfing and coastal cycling.', image: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&q=80&w=600' },
    ],
  },

  // ── WELLNESS & AYURVEDA ────────────────────────────────────
  {
    id: 'wa-7-1',
    type: 'Wellness & Ayurveda',
    days: 7,
    title: 'Ayurveda Awakening',
    description: 'Ancient healing traditions, herbal treatments and mindful living in tranquil retreat settings.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    highlights: ['Ayurvedic treatments', 'Yoga sessions', 'Herbal spa', 'Meditation'],
    destinations: [
      { name: 'Beruwala', days: 3, description: 'Beachside Ayurveda resort — Panchakarma detox and traditional oil treatments.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kandy', days: 2, description: 'Herbal garden visits, temple meditation and botanical spa.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
      { name: 'Nuwara Eliya', days: 2, description: 'Mountain wellness retreat with tea therapy and forest meditation walks.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  {
    id: 'wa-14-1',
    type: 'Wellness & Ayurveda',
    days: 14,
    title: 'Complete Wellness Journey',
    description: 'A transformative two-week retreat combining Ayurveda, yoga, meditation and Sri Lanka\'s healing nature.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    highlights: ['Deep Ayurveda program', 'Yoga retreat', 'Meditation', 'Nature therapy'],
    destinations: [
      { name: 'Colombo', days: 1, description: 'Arrival and wellness consultation.', image: 'https://images.unsplash.com/photo-1571734982700-09da72d9c7c3?auto=format&fit=crop&q=80&w=600' },
      { name: 'Beruwala', days: 4, description: 'Full Panchakarma Ayurveda program in a beachside retreat.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600' },
      { name: 'Kandy', days: 3, description: 'Yoga retreat, temple healing rituals and botanical garden walks.', image: 'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600' },
      { name: 'Nuwara Eliya', days: 3, description: 'High altitude meditation, tea therapy and forest bathing.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600' },
      { name: 'Tangalle', days: 3, description: 'Silent beach retreat, sunrise yoga and Ayurvedic closure treatments.', image: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&q=80&w=600' },
    ],
  },
];

// ── Helper: get unique types from data (auto-updates when new packages added) ──
export const getTypes = () => [...new Set(loadPackages().map(p => p.type))];

// ── Helper: get unique day options from data ──
export const getDays  = () => [...new Set(loadPackages().map(p => p.days))].sort((a,b) => a - b);

// ── Helper: filter packages ──
export const filterPackages = (type = 'All', days = 'All') =>
  loadPackages().filter(p =>
    (type === 'All' || p.type === type) &&
    (days === 'All' || p.days === Number(days))
  );
