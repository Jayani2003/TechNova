// ─────────────────────────────────────────────────────────────
//  REVIEWS DATA STORE
//  In production replace with API calls.
//  Tour status is set by admin dashboard.
//  Only tours with status === 'completed' allow reviews.
// ─────────────────────────────────────────────────────────────

export const TOUR_STATUSES = {
  NOT_STARTED: 'not_started',
  TRAVELING:   'traveling',
  COMPLETED:   'completed',
};

// Mock: current user's bookings (comes from auth/booking API in production)
export const mockUserTours = [
  {
    id: 'booking-001',
    packageTitle: 'Golden Coast Escape',
    packageType: 'Beach Side',
    completedDate: '2024-12-15',
    status: TOUR_STATUSES.COMPLETED,
    hasReviewed: false,
  },
  {
    id: 'booking-002',
    packageTitle: 'Misty Mountains Retreat',
    packageType: 'Hill Country',
    completedDate: '2025-01-20',
    status: TOUR_STATUSES.COMPLETED,
    hasReviewed: true,
  },
  {
    id: 'booking-003',
    packageTitle: 'Wild Sri Lanka',
    packageType: 'Safari',
    completedDate: null,
    status: TOUR_STATUSES.TRAVELING,
    hasReviewed: false,
  },
];

// Mock: published reviews
export const mockReviews = [
  {
    id: 'r-001',
    user: {
      name: 'Sophie Hartmann',
      country: 'Germany',
      countryFlag: '🇩🇪',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Golden Coast Escape',
    tourType: 'Beach Side',
    stars: 5,
    title: "Absolutely magical — a trip I'll never forget",
    comment: "Sri Lanka completely exceeded every expectation I had. Our driver was incredibly knowledgeable, the beaches were pristine and untouched, and the food at every stop was spectacular. Mirissa at sunset is something I'll carry with me forever. The entire team made us feel like royalty from the moment we landed.",
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-01-03',
    verified: true,
  },
  {
    id: 'r-002',
    user: {
      name: 'James Thornton',
      country: 'United Kingdom',
      countryFlag: '🇬🇧',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Misty Mountains Retreat',
    tourType: 'Hill Country',
    stars: 5,
    title: 'The train through the tea hills is worth it alone',
    comment: "Nuwara Eliya was breathtaking. We stayed in a gorgeous planter's bungalow and woke up every morning to mist rolling over the tea fields. The Nine Arch Bridge in Ella was jaw-dropping. Our guide brought so much depth to every stop — history, culture, local stories. One of the best holidays of my life.",
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-01-18',
    verified: true,
  },
  {
    id: 'r-003',
    user: {
      name: 'Aiko Tanaka',
      country: 'Japan',
      countryFlag: '🇯🇵',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Wild Sri Lanka',
    tourType: 'Safari',
    stars: 4,
    title: 'Leopards, elephants and so much more',
    comment: "Yala National Park was absolutely incredible. We saw three leopards on our first morning game drive — our guide said it was unusually lucky! The jeep safaris at dawn are an experience unlike anything else. The only small downside was a bit of rain on day two, but that's nature. Everything else was flawless.",
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-02-01',
    verified: true,
  },
  {
    id: 'r-004',
    user: {
      name: 'Marie Dubois',
      country: 'France',
      countryFlag: '🇫🇷',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Ancient Kingdom Trail',
    tourType: 'Cultural Heritage',
    stars: 5,
    title: 'A journey through 2,500 years of civilisation',
    comment: "The Cultural Triangle blew my mind completely. Sigiriya at sunrise — climbing that ancient rock with the mist below you — is one of those experiences that changes you. Polonnaruwa and Anuradhapura are so vast and so ancient that you feel genuinely small in the best possible way. Our guide was a walking encyclopaedia.",
    images: [
      'https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-02-14',
    verified: true,
  },
  {
    id: 'r-005',
    user: {
      name: 'Lucas Oliveira',
      country: 'Brazil',
      countryFlag: '🇧🇷',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Thrills of Lanka',
    tourType: 'Adventure',
    stars: 5,
    title: "Best adventure trip I've ever done, full stop",
    comment: "The white water rafting in Kitulgala was insane — Grade 4 rapids through jungle gorges. Then zip-lining in Ella with views over the whole valley. Finishing with surfing in Arugam Bay was the perfect ending. Every activity was incredibly well organised and safety was taken seriously throughout.",
    images: [
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-02-28',
    verified: true,
  },
  {
    id: 'r-006',
    user: {
      name: 'Emma van der Berg',
      country: 'Netherlands',
      countryFlag: '🇳🇱',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Ayurveda Awakening',
    tourType: 'Wellness & Ayurveda',
    stars: 5,
    title: 'Transformative, healing and deeply peaceful',
    comment: "I came exhausted and left completely renewed. The Ayurvedic treatments at the beachside retreat in Beruwala were unlike any spa I've visited in Europe. The practitioners were genuine and deeply skilled. Kandy's botanical gardens and the meditation sessions were the perfect complement.",
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-03-05',
    verified: true,
  },
  {
    id: 'r-007',
    user: {
      name: 'David Chen',
      country: 'Australia',
      countryFlag: '🇦🇺',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Island Shores Explorer',
    tourType: 'Beach Side',
    stars: 4,
    title: 'Incredible variety across the coastline',
    comment: "Two weeks hitting beaches from the south to the east coast was brilliant. Each destination had its own personality — Galle was cultural, Mirissa was laid-back paradise, and Trincomalee was rugged and beautiful. The point-to-point transfers were smooth and our driver became a genuine friend by the end.",
    images: [
      'https://images.unsplash.com/photo-1559628233-100c798642cf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-03-12',
    verified: true,
  },
  {
    id: 'r-008',
    user: {
      name: 'Priya Sharma',
      country: 'India',
      countryFlag: '🇮🇳',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150',
    },
    tourTitle: 'Full Cultural Triangle',
    tourType: 'Cultural Heritage',
    stars: 5,
    title: 'Every temple, every stone tells a story',
    comment: "As someone deeply interested in South Asian history, this tour was a dream. The Sacred City of Anuradhapura moved me to tears — the Sri Maha Bodhi is something you feel rather than just see. Mihintale at dawn was completely serene. Our guide's depth of knowledge was extraordinary.",
    images: [
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=600',
    ],
    datePublished: '2025-03-20',
    verified: true,
  },
];

// ── Aggregate stats ─────────────────────────────────────────
export const getAggregateStats = (reviews = mockReviews) => {
  if (!reviews.length) return { avg: 0, total: 0, breakdown: {} };
  const total = reviews.length;
  const sum   = reviews.reduce((acc, r) => acc + r.stars, 0);
  const avg   = (sum / total).toFixed(1);
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { breakdown[r.stars] = (breakdown[r.stars] || 0) + 1; });
  return { avg, total, breakdown };
};

// ── Get reviewable (completed + not yet reviewed) tours ─────
export const getReviewableTours = () =>
  mockUserTours.filter(
    t => t.status === TOUR_STATUSES.COMPLETED && !t.hasReviewed
  );

// ── Format date ─────────────────────────────────────────────
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};
